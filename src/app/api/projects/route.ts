import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProjectAgent } from '@/ai/agents/project-agent';
import { getCurrentSession, getCurrentProfileId, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const profileId = await getCurrentProfileId();
    if (!profileId) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const projects = await prisma.generatedProject.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        targetRole: true,
        skills: { include: { skill: true } },
        gaps: { include: { skill: true } },
      },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const projectAgent = new ProjectAgent();
    const generated = await projectAgent.generateProject({
      targetRoleTitle: profile.targetRole?.title || 'AI Engineer',
      existingSkills: profile.skills.map(s => s.skill.name),
      missingSkills: profile.gaps.map(g => g.skill.name),
    });

    const project = await prisma.generatedProject.create({
      data: {
        profileId: profile.id,
        title: generated.title,
        description: generated.description,
        difficulty: generated.difficulty,
        skillsDeveloped: JSON.stringify(generated.skillsDeveloped),
        whyThisProject: generated.whyThisProject,
        requirements: JSON.stringify(generated.requirements),
        evaluationCriteria: JSON.stringify(generated.evaluationCriteria),
        estimatedHours: generated.estimatedHours,
      },
    });

    await prisma.agentEvent.create({
      data: {
        profileId: profile.id,
        agentName: 'ProjectAgent',
        action: 'synthesized_project',
        description: `Synthesized cross-cutting capstone project: "${generated.title}".`,
        evidence: `Designed to bridge ${generated.skillsDeveloped.length} skills simultaneously: ${generated.skillsDeveloped.slice(0, 3).join(', ')}...`,
      },
    });

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
