'use client';

import { useState, useEffect } from 'react';
import { Activity, X, RefreshCw, Zap } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

export function AgentDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <>
      {/* Hidden button triggered by Navbar */}
      <button
        id="agent-drawer-toggle"
        className="hidden"
        onClick={() => {
          setIsOpen(prev => !prev);
        }}
      />

      {/* Slide-over backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer content */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[460px] bg-surface border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-accent-cyan animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                Agent Decision Engine
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </h3>
              <p className="text-[11px] text-muted-foreground">Autonomous transparent activity log</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
              title="Refresh timeline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-accent-cyan' : ''}`} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timeline Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 rounded-xl bg-accent-indigo/10 border border-accent-indigo/20 text-xs text-foreground flex items-start gap-2">
            <Zap className="w-4 h-4 text-accent-cyan mt-0.5 shrink-0" />
            <span className="text-muted-foreground leading-relaxed">
              Every evaluation, gap detection, and roadmap adaptation is recorded with literal evidence citations.
            </span>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No recent agent events recorded yet.
            </div>
          ) : (
            <div className="relative pl-5 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-cyan-500 before:to-border">
              {events.map((ev, index) => {
                const isAdaptation = ev.agentName === 'AdaptationAgent';
                const isEvaluation = ev.agentName === 'EvaluationAgent';

                return (
                  <div key={ev.id || index} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-surface transition-transform group-hover:scale-125 ${
                        isAdaptation
                          ? 'bg-rose-500 shadow-glow'
                          : isEvaluation
                          ? 'bg-amber-400'
                          : 'bg-accent-indigo'
                      }`}
                    />

                    {/* Card */}
                    <div
                      className={`p-3.5 rounded-xl border transition-all card ${
                        isAdaptation
                          ? 'bg-rose-500/5 border-rose-500/30'
                          : isEvaluation
                          ? 'bg-amber-500/5 border-amber-500/20'
                          : 'bg-surface hover:border-accent-indigo/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                            isAdaptation
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              : isEvaluation
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20'
                          }`}
                        >
                          {ev.agentName}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {formatTimeAgo(ev.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-foreground mb-1 leading-relaxed">
                        {ev.description}
                      </p>

                      {ev.evidence && (
                        <div className="mt-2 p-2 rounded-lg bg-card border border-border text-[11px]">
                          <span className="font-semibold text-accent-cyan block mb-0.5">Evidence Cited:</span>
                          <span className="italic text-muted-foreground">{ev.evidence}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
