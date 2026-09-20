import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-background rounded-[8px] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-accent-cyan" />
              </div>
            </div>
            <span className="font-extrabold tracking-tight">EduPath AI</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-xs">
            Your AI career agent that learns how you learn. Understand, identify, plan, practice, evaluate, adapt.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Product
          </span>
          <div className="flex flex-col gap-1.5">
            <Link href="/roadmap" className="text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link>
            <Link href="/tasks" className="text-muted-foreground hover:text-foreground transition-colors">Tasks</Link>
            <Link href="/skills" className="text-muted-foreground hover:text-foreground transition-colors">Skill Graph</Link>
            <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors">Assistant</Link>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account
          </span>
          <div className="flex flex-col gap-1.5">
            <Link href="/signin" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/signup" className="text-muted-foreground hover:text-foreground transition-colors">Create Account</Link>
            <Link href="/onboarding" className="text-muted-foreground hover:text-foreground transition-colors">Onboarding</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} EduPath AI. Autonomous Adaptive Career Agent.</span>
          <span className="font-mono">Adaptive • Transparent • Learner-first</span>
        </div>
      </div>
    </footer>
  );
}