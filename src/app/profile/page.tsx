'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  FileText,
} from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(json => {
        if (json.success) setProfile(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Loading Learner Profile...</p>
      </div>
    );
  }

  const skills = profile?.skills || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="badge badge-accent">
            <User className="w-3.5 h-3.5" />
            <span>Verified Learner Identity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {profile?.user?.name || 'Ilakkiyan'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {profile?.user?.email} • Experience: <strong className="text-foreground capitalize">{profile?.experienceLevel}</strong>
          </p>
        </div>

        <Link
          href="/onboarding"
          className="btn-secondary text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <FileText className="w-3.5 h-3.5 text-primary" />
          <span>Upload New Resume</span>
        </Link>
      </div>

      {/* Summary Box */}
      <div className="card p-6 space-y-2">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
          AI Profile Synthesis:
        </span>
        <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
          &quot;{profile?.summary || 'Full-stack developer transitioning to AI Engineering with verified REST API experience.'}&quot;
        </p>
      </div>

      {/* Extracted Skills and Grounded Evidence */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">
          Extracted Competencies with Literal Evidence Excerpts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((s: any) => (
            <div
              key={s.id}
              className="card p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground">{s.skill.name}</span>
                <span className="badge badge-neutral font-mono text-[11px]">
                  Level {s.level}/5
                </span>
              </div>

              {s.evidence?.length > 0 ? (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    Extracted Resume Citation:
                  </span>
                  {s.evidence.map((ev: any, idx: number) => (
                    <p key={idx} className="text-muted-foreground italic text-[11px] leading-relaxed">
                      &quot;{ev.snippet}&quot;
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground italic">No direct citation found.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
