import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SkillGapAgent } from '@/ai/agents/skill-gap-agent';
import { getCurrentSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const body = await req.json().catch(() => ({}));
    const roleId = body.roleId as string | undefined;

    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: session.user.id },
      include: { skills: { include: { skill: true, evidence: true } }, targetRole: true },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const targetRoleId = roleId || profile.targetRoleId || undefined;
    const role = await prisma.role.findUnique({
      where: { id: targetRoleId },
      include: {
        roleSkills: {
          include: { skill: true },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ success: false, error: 'Target role not found' }, { status: 404 });
    }

    // Format role requirements and learner skills for SkillGapAgent
    const roleRequirements = role.roleSkills.map(rs => ({
      skillName: rs.skill.name,
      requiredLevel: rs.requiredLevel,
      importance: rs.importance,
    }));

    const learnerSkills = profile.skills.map(ls => ({
      skillName: ls.skill.name,
      currentLevel: ls.level,
      evidenceSnippets: ls.evidence.map(e => e.snippet),
    }));

    const gapAgent = new SkillGapAgent();
    const gapAnalysis = await gapAgent.analyzeGaps({
      targetRoleTitle: role.title,
      roleRequirements,
      learnerSkills,
    });

    // Update Profile Readiness
    await prisma.learnerProfile.update({
      where: { id: profile.id },
      data: {
        targetRoleId: role.id,
        careerReadiness: gapAnalysis.overallReadiness,
      },
    });

    // Persist Skill Gaps
    for (const g of gapAnalysis.gaps) {
      const slug = g.skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let skill = await prisma.skill.findUnique({ where: { slug } });
      if (!skill) {
        skill = await prisma.skill.create({
          data: {
            slug,
            name: g.skillName,
            category: 'core',
          },
        });
      }

      await prisma.skillGap.upsert({
        where: {
          profileId_skillId: {
            profileId: profile.id,
            skillId: skill.id,
          },
        },
        update: {
          currentLevel: g.currentLevel,
          requiredLevel: g.requiredLevel,
          gapLevel: g.gapLevel,
          confidence: g.confidence,
          reason: g.reason,
        },
        create: {
          profileId: profile.id,
          skillId: skill.id,
          currentLevel: g.currentLevel,
          requiredLevel: g.requiredLevel,
          gapLevel: g.gapLevel,
          confidence: g.confidence,
          reason: g.reason,
        },
      });
    }

    // Log Agent Event
    const criticalCount = gapAnalysis.gaps.filter(g => g.gapLevel === 'critical').length;
    await prisma.agentEvent.create({
      data: {
        profileId: profile.id,
        agentName: 'SkillGapAgent',
        action: 'detected_gaps',
        description: `Compared profile with "${role.title}". Detected ${criticalCount} Critical Gaps. Career Readiness assessed at ${gapAnalysis.overallReadiness}%.`,
        evidence: `Identified critical gaps: ${gapAnalysis.gaps.filter(g => g.gapLevel === 'critical').map(g => g.skillName).join(', ')}`,
        outputData: JSON.stringify(gapAnalysis),
      },
    });

    return NextResponse.json({
      success: true,
      data: gapAnalysis,
    });
  } catch (error: any) {
    console.error('Error analyzing gaps:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
