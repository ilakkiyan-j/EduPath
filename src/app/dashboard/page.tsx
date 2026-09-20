'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Zap,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Activity,
  Sparkles,
  GitBranch,
  FileCode,
  Clock,
} from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, roadRes, evRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/roadmap'),
          fetch('/api/agent/events'),
        ]);

        const profData = await profRes.json();
        const roadData = await roadRes.json();
        const evData = await evRes.json();

        if (profData.success) setProfile(profData.data);
        if (roadData.success) setRoadmap(roadData.data);
        if (evData.success) setEvents(evData.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Loading EduPath AI Mission Control...</p>
      </div>
    );
  }

  const acquiredCount = profile?.skills?.filter((s: any) => s.level >= 4).length || 2;
  const inProgressCount = profile?.skills?.filter((s: any) => s.level >= 2 && s.level < 4).length || 4;
  const criticalGaps = profile?.gaps?.filter((g: any) => g.gapLevel === 'critical' || g.gapLevel === 'high') || [];
  const readiness = profile?.careerReadiness || 68;

  const activeMilestone = roadmap?.items?.find((i: any) => i.status === 'in_progress') || roadmap?.items?.[0];
  const hasAdaptation = roadmap?.adaptations && roadmap.adaptations.length > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-5 rounded-2xl card bg-surface/90 border border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
            <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
              Welcome back, {profile?.user?.name || 'Ilakkiyan'}!
              <span className="text-xs font-normal text-muted-foreground">
                • Target: {profile?.targetRole?.title || 'AI Engineer'}
              </span>
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            {hasAdaptation ? (
              <span className="text-rose-500 dark:text-rose-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Roadmap was dynamically adapted based on your latest task evaluation!
              </span>
            ) : (
              'Your adaptive career roadmap is active. Ready to demonstrate the autonomous loop?'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tasks"
            className="btn btn-primary text-xs py-2 px-3.5 shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Today&apos;s Challenge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Career Readiness */}
        <div className="p-4 rounded-2xl card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Career Readiness</span>
            <Target className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">{readiness}%</span>
            <span className="text-[11px] text-muted-foreground">for {profile?.targetRole?.title || 'AI Engineer'}</span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>

        {/* Skills Acquired */}
        <div className="p-4 rounded-2xl card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Skills Acquired</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">{acquiredCount}</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Verified</span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            REST APIs, TypeScript, Node.js
          </p>
        </div>

        {/* In Progress */}
        <div className="p-4 rounded-2xl card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">In Progress</span>
            <BrainCircuit className="w-4 h-4 text-accent-indigo" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">{inProgressCount}</span>
            <span className="text-[11px] text-accent-indigo font-medium">Active practice</span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            Python, RAG, Prompt Engineering
          </p>
        </div>

        {/* Critical Gaps */}
        <div className="p-4 rounded-2xl card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Critical Gaps</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">{criticalGaps.length}</span>
            <span className="text-[11px] text-rose-500 font-medium">Blocking role</span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            Tool Calling, Error Handling
          </p>
        </div>
      </div>

      {/* Main Grid: Roadmap Timeline (2 cols) & Right Sidebar (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Roadmap Timeline */}
        <div className="lg:col-span-2 p-5 rounded-2xl card space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-accent-indigo" />
                Adaptive Learning Journey
              </h3>
              <p className="text-xs text-muted-foreground">
                {roadmap?.title || 'Personalized AI Engineer Path'}
              </p>
            </div>
            <Link
              href="/roadmap"
              className="text-xs font-semibold text-accent-cyan hover:underline flex items-center gap-1"
            >
              <span>Full Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {roadmap?.items?.map((item: any) => {
              const isDone = item.status === 'completed';
              const isInProg = item.status === 'in_progress';
              const isAdapted = item.adaptationNote || item.title.includes('Injected');

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAdapted
                      ? 'bg-rose-500/5 border-rose-500/30'
                      : isInProg
                      ? 'bg-accent-indigo/5 border-accent-indigo/40 shadow-sm'
                      : 'bg-surface border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground">
                          WEEK {item.weekNumber}
                        </span>
                        {isDone && (
                          <span className="badge badge-success text-[10px] py-0 px-2">
                            Completed
                          </span>
                        )}
                        {isInProg && (
                          <span className="badge badge-accent text-[10px] py-0 px-2 animate-pulse">
                            Active Focus
                          </span>
                        )}
                        {isAdapted && (
                          <span className="badge badge-danger text-[10px] py-0 px-2">
                            ⚡ Adapted by Agent
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                      {item.adaptationNote && (
                        <p className="text-[11px] text-rose-500 dark:text-rose-400 italic pt-0.5">
                          ↳ Reason: {item.adaptationNote}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-muted-foreground font-mono">
                        {item.estimatedHours} hrs
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Active Task Card */}
          <div className="p-5 rounded-2xl card border-accent-cyan/30 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="badge badge-accent text-[10px] py-0.5 px-2">
                Today&apos;s Task
              </span>
              <span className="text-xs text-muted-foreground font-mono">60 min</span>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-foreground">
                Build a Resilient Weather Tool Agent
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Implement autonomous tool schema validation and defensive error recovery for missing cities or network timeouts.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground block mb-0.5">Evaluation Rubric:</span>
              <span>Schema Completeness & Error Handling thresholds.</span>
            </div>

            <Link
              href="/tasks"
              className="w-full btn btn-primary py-2 text-xs"
            >
              <span>Work on Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Skill Graph Card */}
          <div className="p-4 rounded-2xl card space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-accent-indigo" />
                Skill Graph Preview
              </h4>
              <Link href="/skills" className="text-[11px] text-accent-cyan hover:underline">
                View DAG
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Topological skill dependencies: Python → LLMs → RAG → Tools → AI Agents.
            </p>
            <div className="p-2.5 rounded-xl bg-card border border-border text-[11px] font-mono flex items-center justify-between">
              <span className="text-foreground">Tool Calling (1/5)</span>
              <span className="text-rose-500 font-bold">⚠ Critical Gap</span>
            </div>
          </div>

          {/* Recent Agent Decisions */}
          <div className="p-4 rounded-2xl card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-accent-cyan" />
                Recent Agent Decisions
              </h4>
              <button
                onClick={() => {
                  const drawer = document.getElementById('agent-drawer-toggle');
                  if (drawer) drawer.click();
                }}
                className="text-[11px] text-accent-cyan hover:underline"
              >
                Inspect
              </button>
            </div>

            <div className="space-y-2">
              {events.slice(0, 3).map((ev: any) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg bg-card border border-border text-[11px] space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-accent-indigo">{ev.agentName}</span>
                    <span className="text-[10px] text-muted-foreground">{formatTimeAgo(ev.createdAt)}</span>
                  </div>
                  <p className="text-foreground/90 line-clamp-2">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
