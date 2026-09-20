import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // API routes: NextAuth endpoints always pass through; everything else
  // returns 401 JSON instead of a page redirect
  if (pathname.startsWith('/api')) {
    if (!pathname.startsWith('/api/auth') && !token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protected pages: redirect to sign-in
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/signin';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/skills/:path*',
    '/roadmap/:path*',
    '/tasks/:path*',
    '/projects/:path*',
    '/progress/:path*',
    '/chat/:path*',
    '/agent/:path*',
    '/profile/:path*',
    '/onboarding/:path*',
    '/api/:path*',
  ],
};