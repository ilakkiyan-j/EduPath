'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sliders,
  RotateCcw,
  Zap,
  Info,
} from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import WeeklyPlan from '@/components/weekly-plan';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [recalculating, setRecalculating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      const res = await fetch('/api/roadmap');
      const data = await res.json();
      if (data.success && data.data) {
        setRoadmap(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleUpdateAvailability = async () => {
    setRecalculating(true);
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyHours }),
      });
      const data = await res.json();
      if (data.success) {
        setRoadmap(data.data);
      }
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Loading Adaptive Roadmap...</p>
      </div>
    );
  }

  const items = roadmap?.items || [];
  const adaptations = roadmap?.adaptations || [];
  const hasAdaptation = adaptations.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 text-xs font-semibold text-accent-indigo dark:text-cyan-400">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Autonomous State Machine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Adaptive Learning Journey
          </h1>
          <p className="text-xs text-muted-foreground">
            {roadmap?.title || 'Personalized AI Engineer Mastery Path'} • Dynamic weekly milestones mutable by evaluation results
          </p>
        </div>

        {/* Dynamic Constraint Control */}
        <div className="p-2.5 rounded-2xl card flex items-center gap-3">
          <div className="text-left">
            <span className="text-[10px] text-muted-foreground block">Weekly Budget</span>
            <span className="text-xs font-bold text-accent-cyan">{weeklyHours} hrs/wk</span>
          </div>
          <input
            type="range"
            min={5}
            max={35}
            step={5}
            value={weeklyHours}
            onChange={e => setWeeklyHours(Number(e.target.value))}
            className="w-24 accent-indigo-500 cursor-pointer"
          />
          <button
            onClick={handleUpdateAvailability}
            disabled={recalculating}
            className="px-3 py-1.5 rounded-xl btn-primary text-xs flex items-center gap-1"
          >
            {recalculating ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Sliders className="w-3.5 h-3.5" />}
            <span>Re-plan</span>
          </button>
        </div>
      </div>

      {/* Dynamic Adaptation Banner */}
      {hasAdaptation && (
        <div className="p-4 rounded-2xl card bg-rose-500/5 border-rose-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-rose-500 dark:text-rose-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
              Roadmap Restructured by Adaptation Agent
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {formatTimeAgo(adaptations[0].createdAt)}
            </span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed">
            {adaptations[0].diffSummary}
          </p>
          <div className="p-2.5 rounded-xl bg-card border border-border text-xs">
            <span className="font-semibold text-accent-cyan block mb-0.5">Evidence Cited:</span>
            <p className="italic text-muted-foreground">{adaptations[0].evidence}</p>
          </div>
        </div>
      )}

      {/* Weekly Learning Plan */}
      {items.length > 0 && (
        <WeeklyPlan
          milestone={items.find((i: any) => i.status === 'in_progress') || items[0]}
        />
      )}

      {/* Week Milestones Timeline */}
      <div className="space-y-3.5">
        <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
          Weekly Milestone Progression
        </h3>

        <div className="space-y-3">
          {items.map((item: any) => {
            const isCompleted = item.status === 'completed';
            const isInProgress = item.status === 'in_progress';
            const isAdapted = item.adaptationNote || item.title.includes('Injected') || item.title.includes('Remedial');

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl card transition-all relative overflow-hidden ${
                  isAdapted
                    ? 'bg-rose-500/5 border-rose-500/40 shadow-sm'
                    : isInProgress
                    ? 'bg-accent-indigo/5 border-accent-indigo/40 shadow-sm'
                    : isCompleted
                    ? 'bg-surface/60 opacity-85'
                    : 'bg-surface'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-accent-cyan bg-accent-cyan/10 px-2.5 py-0.5 rounded border border-accent-cyan/20">
                        WEEK {item.weekNumber}
                      </span>
                      {isCompleted && (
                        <span className="badge badge-success">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {isInProgress && (
                        <span className="badge badge-accent animate-pulse">
                          Current Focus
                        </span>
                      )}
                      {isAdapted && (
                        <span className="badge badge-danger">
                          ⚡ Prerequisite Injected by Agent
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-medium text-muted-foreground">Target Skills:</span>
                      {item.targetSkills.split(',').map((skill: string) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-card text-muted-foreground border border-border"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>

                    {item.adaptationNote && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-card border border-rose-500/20 text-xs text-rose-500 dark:text-rose-400">
                        <strong className="block mb-0.5 font-semibold">Adaptation Rationale:</strong>
                        <span>{item.adaptationNote}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-accent-indigo" />
                      {item.estimatedHours} hrs
                    </span>

                    {isInProgress && (
                      <Link
                        href="/tasks"
                        className="btn btn-primary text-xs py-1.5 px-3.5 shadow-sm"
                      >
                        <span>Start Task</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Adaptation Audit Trail */}
      {hasAdaptation && (
        <div className="p-5 rounded-2xl card space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
            <Info className="w-4 h-4 text-accent-cyan" />
            Roadmap Adaptation History Log
          </h3>

          <div className="space-y-2.5">
            {adaptations.map((a: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-card border border-border space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider text-[10px]">
                    Trigger: {a.triggerType}
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px]">{formatTimeAgo(a.createdAt)}</span>
                </div>
                <p className="text-foreground">{a.reason}</p>
                <p className="text-muted-foreground italic text-[11px]">↳ {a.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
