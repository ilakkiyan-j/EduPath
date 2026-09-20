'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  BrainCircuit,
  LogIn,
  AlertCircle,
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const doSignIn = async (mail: string, pass: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: mail,
        password: pass,
      });
      if (res?.error) {
        setError('Invalid email or password. Please try again.');
        return;
      }
      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSignIn(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="badge badge-accent inline-flex">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to EduPath
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Continue your adaptive learning journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Password
              </label>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                min 8 characters
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
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
                Signing in...
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-muted-foreground bg-card px-3">
            or
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => doSignIn('demo.learner@edupath.ai', 'demo1234')}
          className="btn-secondary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
        >
          <BrainCircuit className="w-4 h-4 text-primary" />
          One-click Demo Learner
        </button>

        <p className="text-center text-xs text-muted-foreground">
          New to EduPath?{' '}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Create an account
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

export default function SignInPage() {
  return (
    <div className="min-h-[70vh] flex items-center py-8">
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </div>
  );
}