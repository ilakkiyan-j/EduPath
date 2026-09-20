'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  Compass,
  GitBranch,
  CheckSquare,
  BarChart3,
  MessageSquare,
  Sparkles,
  RotateCcw,
  Activity,
  Terminal,
  Menu,
  X,
  LogOut,
  UserRound,
  ChevronDown,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const PRIMARY_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: Compass },
  { href: '/roadmap', label: 'Roadmap', icon: BrainCircuit },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/skills', label: 'Skill Graph', icon: GitBranch },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [resetting, setResetting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [eventCount, setEventCount] = useState(3);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  useEffect(() => {
    fetch('/api/agent/events')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setEventCount(data.data.length);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleReset = async () => {
    if (confirm('Reset demo state to baseline (before task submission)?')) {
      setResetting(true);
      try {
        await fetch('/api/demo/reset', { method: 'POST' });
        window.location.reload();
      } finally {
        setResetting(false);
      }
    }
  };

  const isActive = (href: string) => pathname.startsWith(href);
  const isSignedIn = status === 'authenticated';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-background rounded-[6px] flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-accent-cyan" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-tight text-foreground">
                EduPath
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20">
                AI Agent
              </span>
            </Link>
          </div>

          {/* Minimalist Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {PRIMARY_NAV.map(item => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-accent-indigo/15 text-accent-indigo dark:text-cyan-300 font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Toolbar Utilities */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Assistant Icon Link */}
            <Link
              href="/chat"
              className={`p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors relative ${
                isActive('/chat') ? 'text-accent-indigo dark:text-cyan-300 bg-card' : ''
              }`}
              title="AI Assistant"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>

            {/* Agent Timeline Drawer Trigger */}
            <button
              onClick={() => {
                const drawer = document.getElementById('agent-drawer-toggle');
                if (drawer) drawer.click();
              }}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors relative"
              title="Agent Timeline & Decision Log"
            >
              <Activity className="w-4 h-4 text-accent-cyan animate-pulse" />
              {eventCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-indigo ring-2 ring-background" />
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Dropdown / Auth Buttons */}
            {isSignedIn ? (
              <div className="relative ml-1" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-border transition-all"
                  aria-label="User menu"
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-[11px] font-bold uppercase shadow-sm">
                    {(session?.user?.name || session?.user?.email || '?').slice(0, 1)}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 card p-1.5 shadow-xl border border-border bg-surface/95 backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {session?.user?.name || 'Signed In'}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {session?.user?.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                    >
                      <UserRound className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/projects"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Projects Studio</span>
                    </Link>

                    <Link
                      href="/onboarding"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Upload Resume</span>
                    </Link>

                    <div className="border-t border-border my-1" />

                    <button
                      onClick={handleReset}
                      disabled={resetting}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-colors text-left"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-amber-400' : ''}`} />
                      <span>Reset Demo Baseline</span>
                    </button>

                    <div className="border-t border-border my-1" />

                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 ml-1">
                <Link
                  href="/signin"
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-accent-indigo text-white shadow-sm hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors ml-0.5"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 space-y-1">
          {PRIMARY_NAV.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  active
                    ? 'bg-accent-indigo/15 text-accent-indigo dark:text-cyan-300 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/chat"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Assistant</span>
          </Link>

          <Link
            href="/projects"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Projects Studio</span>
          </Link>
        </div>
      )}
    </header>
  );
}