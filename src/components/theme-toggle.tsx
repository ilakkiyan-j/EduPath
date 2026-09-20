'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cycle = () => {
    if (resolvedTheme === 'dark') setTheme('light');
    else if (resolvedTheme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <button
      onClick={cycle}
      disabled={!mounted}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-accent-indigo/50 transition-colors"
      title="Toggle theme: dark → light → system"
      aria-label="Toggle color theme"
    >
      {mounted ? (
        resolvedTheme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-accent" />
        ) : resolvedTheme === 'light' ? (
          <Sun className="w-3.5 h-3.5 text-accent" />
        ) : (
          <Monitor className="w-3.5 h-3.5 text-violet-400" />
        )
      ) : (
        <Sun className="w-3.5 h-3.5" />
      )}
      <span className="hidden sm:inline text-xs">
        {mounted
          ? resolvedTheme === 'dark'
            ? 'Dark'
            : resolvedTheme === 'light'
            ? 'Light'
            : 'System'
          : 'Theme'}
      </span>
    </button>
  );
}