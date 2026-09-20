import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    const tasks = await prisma.task.findMany({
      where: { profileId },
      include: {
        roadmapItem: true,
        submissions: {
          include: {
            evaluation: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
