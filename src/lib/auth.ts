import { getServerSession, type NextAuthOptions, type User } from 'next-auth';
import { NextResponse } from 'next/server';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';

const profileInclude = {
  user: true,
  targetRole: true,
  preference: true,
  skills: {
    include: {
      evidence: true,
      skill: true,
    },
  },
  gaps: {
    include: {
      skill: true,
    },
  },
} as const;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        if (!verifyPassword(credentials.password, user.passwordHash)) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
        } satisfies User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) session.user.id = token.id;
      return session;
    },
  },
};

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export async function getCurrentProfile() {
  const session = await getCurrentSession();
  if (!session?.user?.id) return null;

  return prisma.learnerProfile.findUnique({
    where: { userId: session.user.id },
    include: profileInclude,
  });
}

export async function getCurrentProfileId() {
  const session = await getCurrentSession();
  if (!session?.user?.id) return null;

  const profile = await prisma.learnerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  return profile?.id ?? null;
}

export const UNAUTHORIZED_RESPONSE = NextResponse.json(
  { success: false, error: 'Unauthorized' },
  { status: 401 }
);