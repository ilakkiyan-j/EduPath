'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  Target,
  Zap,
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgressPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/progress')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Loading Progress Analytics...</p>
      </div>
    );
  }

  const profile = data?.profile;
  const stats = data?.stats || {};
  const skills = data?.profile?.skills || [];
  const readinessHistory = data?.readinessHistory || [];
  const evaluationSeries = data?.evaluationSeries || [];
  const weakAreas = data?.memoryStats?.weakAreas || [];
  const strongAreas = data?.memoryStats?.strongAreas || [];
  const skillConfidenceHistory = data?.skillConfidenceHistory || [];

  const readiness = profile?.careerReadiness ?? 68;
  const targetRole = profile?.targetRole || 'AI Engineer';

  // Auto-generated narrative report
  const weekNumber = Math.max(1, readinessHistory.length + 1);
  const acquiredSkills = [
    ...skills.filter((s: any) => s.level >= 4).map((s: any) => s.skill.name),
    ...strongAreas.map((s: any) => s.key),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const improvingSkills = skills
    .filter((s: any) => s.confidence >= 0.5 && s.confidence < 0.75)
    .map((s: any) => s.skill.name);

  const needsAttention = weakAreas.map((w: any) => w.key);
  const agentRecommendation =
    weakAreas[0]?.value ||
    `Strengthen your weak areas (${needsAttention.slice(0, 2).join(', ') || 'none tracked'}) before advancing to advanced orchestration.`;

  const maxSeries = Math.max(
    100,
    ...[...readinessHistory.map((r: any) => r.value), ...evaluationSeries.map((e: any) => e.score)]
  );
  const series = readinessHistory.map((r: any) => r.value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="badge badge-accent">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Learner Telemetry & Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Career Readiness & Memory Report
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Auto-generated weekly report from persistent learner memory, evaluation history, and skill confidence.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Target Role Readiness</span>
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">{readiness}%</span>
            {series.length >= 2 && series[series.length - 1] >= series[0] ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                +{series[series.length - 1] - series[0]}% tracked
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">Target: {targetRole}</p>
        </div>

        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Evaluations Completed</span>
            <Award className="w-4 h-4 text-accent" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">{stats.evaluationsCompleted ?? 0}</span>
            <span className="text-xs text-primary font-medium">
              {stats.passingCount ?? 0} passing, {stats.adaptedCount ?? 0} adapted
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Continuous feedback loop active</p>
        </div>

        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Persistent Memory</span>
            <BrainCircuit className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">{weakAreas.length}</span>
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">weak / {strongAreas.length} strong</span>
          </div>
          <p className="text-xs text-muted-foreground">Learner memory persists across sessions</p>
        </div>
      </div>

      {/* Narrative Auto-Generated Weekly Report */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="card p-6 border-primary/40 space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            WEEK {weekNumber} PROGRESS REPORT
          </h3>
          <span className="badge badge-neutral text-[10px] font-mono">generated by Progress Agent</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Skills Acquired</span>
            <div className="flex flex-wrap gap-1.5">
              {acquiredSkills.length ? (
                acquiredSkills.slice(0, 6).map((s: string) => (
                  <span key={s} className="badge badge-success text-[10px] font-mono">
                    ✓ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No verified acquisitions yet this cycle</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Improving</span>
            <div className="flex flex-wrap gap-1.5">
              {improvingSkills.length ? (
                improvingSkills.slice(0, 6).map((s: string) => (
                  <span key={s} className="badge badge-warning text-[10px] font-mono">
                    ◐ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No mid-confidence skills tracked</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Needs Attention
            </span>
            <div className="flex flex-wrap gap-1.5">
              {needsAttention.length ? (
                needsAttention.slice(0, 6).map((s: string) => (
                  <span key={s} className="badge badge-danger text-[10px] font-mono">
                    ⚠ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No weak areas in memory — great streak!</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border text-xs space-y-1.5">
          <span className="font-semibold text-primary flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Agent Recommendation
          </span>
          <p className="text-muted-foreground leading-relaxed">{agentRecommendation}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-surface border border-border">
            <span className="text-xl font-bold text-foreground">{stats.evaluationsCompleted ?? 0}</span>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Tasks Evaluated</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border">
            <span className="text-xl font-bold text-foreground">{stats.tasksCompleted ?? 0}</span>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Tasks Completed</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border">
            <span className="text-xl font-bold text-foreground">{stats.submissions ?? 0}</span>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Submissions</p>
          </div>
        </div>
      </motion.div>

      {/* Readiness & Evaluation Trajectory */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Career Readiness Trajectory
        </h3>
        {series.length > 1 ? (
          <div className="flex items-end gap-1.5 h-32 pt-4">
            {series.map((v: number, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[9px] font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {v}%
                </span>
                <div
                  className="w-full bg-primary rounded-t-md transition-all duration-500 opacity-90 group-hover:opacity-100"
                  style={{ height: `${Math.max(8, (v / maxSeries) * 100)}%` }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4">
            No readiness snapshots yet. Submit an evaluation to start tracking your trajectory.
          </p>
        )}

        {evaluationSeries.length > 0 && (
          <div className="pt-3 border-t border-border space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Evaluation Score History</span>
            <div className="flex flex-wrap gap-2">
              {evaluationSeries.map((e: any, i: number) => (
                <div
                  key={i}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${
                    e.isPassing
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
                  }`}
                >
                  {e.taskTitle.slice(0, 18)}… {e.score}%
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skill Confidence Trajectory Table */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Individual Skill Confidence Levels
        </h3>

        <div className="space-y-3">
          {skills.map((s: any) => {
            const pct = Math.round(s.confidence * 100);
            const isHigh = pct >= 75;
            const isMedium = pct >= 50 && pct < 75;
            const history = skillConfidenceHistory.filter((h: any) => h.skillName === s.skill.name);

            return (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{s.skill.name}</span>
                    <span className="badge badge-neutral text-[10px] font-mono">
                      Level {s.level}/5
                    </span>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      isHigh ? 'text-emerald-600 dark:text-emerald-400' : isMedium ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {pct}% Confidence
                  </span>
                </div>

                <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigh
                        ? 'bg-emerald-500'
                        : isMedium
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {history.length > 0 && (
                  <div className="flex items-end gap-1 pt-1 h-6">
                    {history.slice(-8).map((h: any, i: number) => (
                      <div
                        key={i}
                        title={`${h.value}`}
                        className="flex-1 bg-primary/60 rounded-sm"
                        style={{ height: `${Math.max(10, h.value * 100)}%` }}
                      />
                    ))}
                  </div>
                )}

                {s.evidence?.[0] && (
                  <p className="text-[11px] text-muted-foreground italic">
                    ↳ Evidence: &quot;{s.evidence[0].snippet}&quot;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Persistent Learner Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 space-y-3 border-red-500/30">
          <h3 className="font-semibold text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Weak Areas (Persistent Memory)
          </h3>
          {weakAreas.length ? (
            weakAreas.map((w: any) => (
              <div key={w.key} className="p-3 rounded-xl bg-surface border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-red-600 dark:text-red-400">{w.key}</span>
                  <span className="text-[10px] font-mono text-red-500">{Math.round(w.confidence * 100)}% signal</span>
                </div>
                <p className="text-xs text-muted-foreground">{w.value}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic">No weak areas recorded yet.</p>
          )}
        </div>

        <div className="card p-6 space-y-3 border-emerald-500/30">
          <h3 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Strong Areas (Persistent Memory)
          </h3>
          {strongAreas.length ? (
            strongAreas.map((w: any) => (
              <div key={w.key} className="p-3 rounded-xl bg-surface border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">{w.key}</span>
                  <span className="text-[10px] font-mono text-emerald-500">{Math.round(w.confidence * 100)}% signal</span>
                </div>
                <p className="text-xs text-muted-foreground">{w.value}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic">No strong areas recorded yet.</p>
          )}
        </div>
      </div>

      <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 pt-2">
        <Clock className="w-3 h-3" />
        Memory & telemetry persist in ProgressHistory + LearnerMemory. Every evaluation updates this report automatically.
      </p>
    </div>
  );
}