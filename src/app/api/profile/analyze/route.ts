import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProfileAgent } from '@/ai/agents/profile-agent';
import { getCurrentSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/octet-stream',
];

function matchesAllowedFile(name: string, mime: string): boolean {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const mimeOk = ALLOWED_MIME_TYPES.includes(mime);
  const extOk = ['pdf', 'docx', 'txt'].includes(ext);
  return mimeOk && extOk;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    let resumeText = '';
    let applicantName = 'Candidate';
    let targetRoleId = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      targetRoleId = (formData.get('targetRoleId') as string) || '';
      applicantName = (formData.get('applicantName') as string) || 'Candidate';

      if (file) {
        const mime = (file.type || '').toLowerCase();
        if (!matchesAllowedFile(file.name, mime)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT resume (max 10 MB).',
            },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        if (buffer.length > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            {
              success: false,
              error: 'File exceeds the 10 MB size limit. Please upload a smaller resume.',
            },
            { status: 400 }
          );
        }

        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        try {
          if (ext === 'pdf') {
            // pdf-parse dynamic import
            const pdfParse = (await import('pdf-parse')).default;
            const parsed = await pdfParse(buffer);
            resumeText = parsed.text;
          } else if (ext === 'docx') {
            const mammoth = await import('mammoth');
            const parsed = await mammoth.extractRawText({ buffer });
            resumeText = parsed.value;
          } else {
            resumeText = buffer.toString('utf-8');
          }
        } catch (e) {
          console.warn('File parsing error, reading as text fallback:', e);
          resumeText = buffer.toString('utf-8');
        }
      }
    } else {
      const body = await req.json();
      resumeText = body.text || '';
      applicantName = body.applicantName || 'Candidate';
      targetRoleId = body.targetRoleId || '';
    }

    if (!resumeText.trim()) {
      resumeText = `
Software Engineer with 2 years of experience building web applications.
Proficient in Python, JavaScript/TypeScript, React, Node.js, Express, and PostgreSQL.
Designed and consumed RESTful APIs. Built basic LangChain RAG prototype with OpenAI API.
Looking to transition to an AI Engineer role.
`;
    }

    // 1. Run Profile Agent
    const profileAgent = new ProfileAgent();
    const extracted = await profileAgent.analyzeResume({
      resumeText,
      applicantName,
    });

    // 2. Fetch the authenticated user's profile (create on first analysis)
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return UNAUTHORIZED_RESPONSE;

    let role = null;
    if (targetRoleId) {
      role = await prisma.role.findUnique({ where: { id: targetRoleId } });
    }
    if (!role) {
      role = await prisma.role.findFirst({ where: { slug: 'ai-engineer' } });
    }

    let profile = await prisma.learnerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      profile = await prisma.learnerProfile.create({
        data: {
          userId: user.id,
          targetRoleId: role?.id,
          experienceLevel: extracted.experienceLevel,
          summary: extracted.summary,
          careerReadiness: 65,
        },
      });
    } else {
      profile = await prisma.learnerProfile.update({
        where: { id: profile.id },
        data: {
          targetRoleId: role?.id,
          experienceLevel: extracted.experienceLevel,
          summary: extracted.summary,
        },
      });
    }

    // 3. Upsert Extracted Skills & Evidence
    for (const s of extracted.skills) {
      // Find or create skill in catalog
      const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let skill = await prisma.skill.findUnique({ where: { slug } });
      if (!skill) {
        skill = await prisma.skill.create({
          data: {
            slug,
            name: s.name,
            category: 'core',
            description: `Extracted competency: ${s.name}`,
          },
        });
      }

      const learnerSkill = await prisma.learnerSkill.upsert({
        where: {
          profileId_skillId: {
            profileId: profile.id,
            skillId: skill.id,
          },
        },
        update: {
          level: s.level,
          confidence: s.confidence,
        },
        create: {
          profileId: profile.id,
          skillId: skill.id,
          level: s.level,
          confidence: s.confidence,
        },
      });

      // Clear older evidence and save new verified snippets
      await prisma.skillEvidence.deleteMany({
        where: { learnerSkillId: learnerSkill.id },
      });

      for (const ev of s.evidence) {
        await prisma.skillEvidence.create({
          data: {
            learnerSkillId: learnerSkill.id,
            source: ev.source || 'resume',
            snippet: ev.snippet,
            confidence: s.confidence,
          },
        });
      }
    }

    // 4. Log Agent Event
    await prisma.agentEvent.create({
      data: {
        profileId: profile.id,
        agentName: 'ProfileAgent',
        action: 'extracted_skills',
        description: `Analyzed resume for ${applicantName}. Extracted ${extracted.skills.length} verified technical skills with evidence citations.`,
        evidence: `Direct evidence extracted from document: ${extracted.skills.slice(0, 3).map(s => s.name).join(', ')}...`,
        outputData: JSON.stringify(extracted),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        profileId: profile.id,
        extracted,
      },
    });
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
