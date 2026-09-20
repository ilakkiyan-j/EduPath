import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const events = await prisma.agentEvent.findMany({
      where: { profile: { userId: session.user.id } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        profile: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    console.error('Error fetching agent events:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
