'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  Zap,
  RotateCcw,
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/projects', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setProjects(prev => [data.data, ...prev]);
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Synthesizing Gap-Closing Projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="badge badge-accent">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Capstone Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Multi-Gap Capstone Projects
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Instead of separate piecemeal tutorials, the Project Agent synthesizes cohesive full-stack applications that simultaneously close your critical missing competencies.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary text-xs flex items-center gap-2 self-start sm:self-auto shrink-0 disabled:opacity-50"
        >
          {generating ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Project Agent Synthesizing Spec...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Synthesize New Gap-Closing Project</span>
            </>
          )}
        </button>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        {projects.map((proj: any) => {
          let skillsDeveloped: string[] = [];
          let requirements: string[] = [];
          try {
            skillsDeveloped = JSON.parse(proj.skillsDeveloped || '[]');
            requirements = JSON.parse(proj.requirements || '[]');
          } catch {
            skillsDeveloped = [proj.skillsDeveloped];
            requirements = [proj.requirements];
          }

          return (
            <div
              key={proj.id}
              className="card card-hover p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-accent uppercase tracking-wider text-[10px] font-mono">
                      {proj.difficulty} Capstone
                    </span>
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {proj.estimatedHours} hrs build time
                    </span>
                  </div>

                  <h3 className="font-bold text-lg sm:text-xl text-foreground">
                    {proj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-4xl">
                    {proj.description}
                  </p>
                </div>
              </div>

              {/* Why This Project Callout */}
              <div className="p-4 rounded-xl bg-surface border border-border text-xs space-y-1">
                <strong className="text-primary block font-semibold">Why This Project?</strong>
                <p className="text-muted-foreground leading-relaxed">{proj.whyThisProject}</p>
              </div>

              {/* Skills Developed Badges */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Simultaneously Closes Gaps In:
                </span>
                <div className="flex flex-wrap gap-2">
                  {skillsDeveloped.map((s, idx) => (
                    <span
                      key={idx}
                      className="badge badge-neutral text-xs"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {requirements.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                    Key Architecture Requirements:
                  </span>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span className="text-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
