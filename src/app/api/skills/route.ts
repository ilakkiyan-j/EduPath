import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const roles = await prisma.role.findMany({
      include: {
        roleSkills: {
          include: { skill: true },
        },
      },
    });

    const skills = await prisma.skill.findMany({
      include: {
        resources: true,
      },
    });

    const dependencies = await prisma.skillDependency.findMany({
      include: {
        prerequisite: true,
        targetSkill: true,
      },
    });

    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        skills: {
          include: {
            skill: true,
            evidence: true,
          },
        },
        gaps: {
          include: {
            skill: true,
          },
        },
        targetRole: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        roles,
        skills,
        dependencies,
        profile,
      },
    });
  } catch (error: any) {
    console.error('Error fetching skills data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
