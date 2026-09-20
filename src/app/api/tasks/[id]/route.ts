import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const task = await prisma.task.findFirst({
      where: { id: params.id, profile: { userId: session.user.id } },
      include: {
        roadmapItem: true,
        submissions: {
          include: {
            evaluation: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
