'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
} from 'lucide-react';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create account.');
        return;
      }

      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (signInRes?.error) {
        setError('Account created. Please sign in.');
        return;
      }
      router.replace('/onboarding');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="badge badge-accent inline-flex">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start learning</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Your personal adaptive AI career agent, ready in minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Full name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="input pl-9 w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input pl-9 w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="input pl-9 w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className="input pl-9 w-full"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="p-3 rounded-xl bg-surface border border-border text-xs text-muted-foreground flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            After signing up you&apos;ll create your learner profile (upload a
            resume) so EduPath can map your skills and build your personalized
            roadmap.
          </span>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/signin" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-[70vh] flex items-center py-8">
      <Suspense fallback={null}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}