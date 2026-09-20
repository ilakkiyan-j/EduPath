'use client';

import { useState, useEffect } from 'react';
import {
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowDown,
  Sparkles,
  Info,
} from 'lucide-react';

export default function SkillsPage() {
  const [data, setData] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
          if (json.data.skills?.length) {
            const tool = json.data.skills.find((s: any) => s.slug === 'tool-calling') || json.data.skills[0];
            setSelectedSkill(tool);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Rendering Skill Dependency Graph...</p>
      </div>
    );
  }

  const profile = data?.profile;
  const gaps = profile?.gaps || [];
  const learnerSkills = profile?.skills || [];

  const getSkillStatus = (skillId: string) => {
    const gap = gaps.find((g: any) => g.skillId === skillId);
    const ls = learnerSkills.find((l: any) => l.skillId === skillId);
    if (!gap && !ls) return { level: 0, gapLevel: 'unknown', color: 'border-border bg-card text-muted-foreground' };
    if (gap?.gapLevel === 'critical') return { level: gap.currentLevel, gapLevel: 'critical', color: 'border-rose-500/50 bg-rose-500/10 text-rose-500 dark:text-rose-400' };
    if (gap?.gapLevel === 'high') return { level: gap.currentLevel, gapLevel: 'high', color: 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400' };
    if (gap?.gapLevel === 'developing') return { level: gap.currentLevel, gapLevel: 'developing', color: 'border-accent-indigo/50 bg-accent-indigo/10 text-accent-indigo dark:text-cyan-400' };
    return { level: ls?.level || 4, gapLevel: 'acquired', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
  };

  const dependencies = data?.dependencies || [];
  const dependencySkills = data?.skills || [];

  const depth: Record<string, number> = {};
  const computeDepth = (id: string): number => {
    if (depth[id] !== undefined) return depth[id];
    let d = 0;
    for (const dep of dependencies) {
      if (dep.targetSkillId === id) {
        d = Math.max(d, computeDepth(dep.prerequisiteId) + 1);
      }
    }
    depth[id] = d;
    return d;
  };

  const tierMap: Record<string, string[]> = {};
  for (const s of dependencySkills) {
    const d = String(computeDepth(s.id));
    tierMap[d] = [...(tierMap[d] || []), s.slug];
  }

  const layerNames = ['FOUNDATIONS', 'CORE BUILDING BLOCKS', 'APPLIED AI SYSTEMS', 'PRODUCTION & SCALE'];
  const graphTiers: Array<{ title: string; skills: string[] }> = Object.keys(tierMap)
    .sort((a, b) => Number(a) - Number(b))
    .map(k => ({
      title: layerNames[Number(k)] || `DEPENDENCY LAYER ${Number(k) + 1}`,
      skills: tierMap[k],
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 text-xs font-semibold text-accent-indigo dark:text-cyan-400">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Interactive Dependency DAG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Skill Graph & Gap Analysis
          </h1>
          <p className="text-xs text-muted-foreground">
            Targeting: <strong className="text-foreground">AI Engineer</strong>. Graph reflects your verified competencies and critical gaps.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs p-2 rounded-xl card bg-surface">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Acquired
          </span>
          <span className="flex items-center gap-1.5 text-accent-indigo dark:text-cyan-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-accent-indigo" /> Developing
          </span>
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> High Gap
          </span>
          <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Critical Gap
          </span>
        </div>
      </div>

      {/* Visual Topological Graph Canvas */}
      <div className="p-6 rounded-2xl card space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-cyan" />
            Topological Skill Dependency Flow
          </h3>
          <span className="text-xs text-muted-foreground">
            Click any node to inspect evidence & recommended resources
          </span>
        </div>

        <div className="space-y-6">
          {graphTiers.map((tier, tierIdx) => (
            <div key={tier.title} className="space-y-2.5">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
                TIER {tierIdx + 1}: {tier.title}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {tier.skills.map(slug => {
                  const skill = data?.skills?.find((s: any) => s.slug === slug);
                  if (!skill) return null;
                  const status = getSkillStatus(skill.id);
                  const isSelected = selectedSkill?.id === skill.id;

                  return (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative group cursor-pointer ${status.color} ${
                        isSelected ? 'ring-2 ring-accent-cyan shadow-sm' : 'hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                          {status.gapLevel}
                        </span>
                        {status.gapLevel === 'critical' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        {status.gapLevel === 'acquired' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-foreground group-hover:text-accent-indigo dark:group-hover:text-cyan-300 transition-colors">
                        {skill.name}
                      </h4>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                        <span>Level {status.level}/5</span>
                        <span className="text-accent-cyan group-hover:underline">Inspect →</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {tierIdx < graphTiers.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/60 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Skill Detail */}
      {selectedSkill && (
        <div className="p-5 rounded-2xl card border-accent-indigo/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider font-semibold">
                Skill Deep-Dive
              </span>
              <h3 className="font-extrabold text-lg text-foreground">
                {selectedSkill.name}
              </h3>
            </div>
            <span className="badge badge-neutral">
              Category: {selectedSkill.category}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {selectedSkill.description || 'Core engineering competency.'}
          </p>

          {/* Gap Reason and Evidence */}
          {(() => {
            const gap = gaps.find((g: any) => g.skillId === selectedSkill.id);
            const ls = learnerSkills.find((l: any) => l.skillId === selectedSkill.id);

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                <div className="p-3.5 rounded-xl bg-card border border-border space-y-1.5">
                  <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    AI Gap Assessment & Reason
                  </span>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {gap?.reason || 'Verified competency demonstrating required production standard.'}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-muted-foreground border-t border-border">
                    <span>Current: Level {gap?.currentLevel ?? ls?.level ?? 1}/5</span>
                    <span className="text-accent-cyan">Required: Level {gap?.requiredLevel ?? 4}/5</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-card border border-border space-y-1.5">
                  <span className="text-xs font-bold text-accent-indigo uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Verified Evidence Quotes
                  </span>
                  {ls?.evidence?.length ? (
                    ls.evidence.map((e: any, idx: number) => (
                      <p key={idx} className="text-xs text-muted-foreground italic">
                        &quot;{e.snippet}&quot;
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No positive evidence found in uploaded resume. Currently flagged as a deficiency.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Curated Resources */}
          {selectedSkill.resources?.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Targeted Learning Resources (&quot;Why this resource?&quot;):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSkill.resources.map((res: any) => (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-card border border-border hover:border-accent-cyan/40 text-xs transition-colors space-y-1 block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground group-hover:text-accent-cyan transition-colors">
                        {res.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface text-muted-foreground uppercase border border-border">
                        {res.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground italic">
                      ↳ {res.reason}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
