import { NextResponse } from 'next/server';
import { getCurrentProfile, getCurrentSession, UNAUTHORIZED_RESPONSE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return UNAUTHORIZED_RESPONSE;

    const profile = await getCurrentProfile();

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
