'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Filter,
  RefreshCw,
  Code2,
} from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

export default function AgentActivityPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent/events');
      const data = await res.json();
      if (data.success) setEvents(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const agents = ['all', 'ProfileAgent', 'SkillGapAgent', 'RoadmapAgent', 'EvaluationAgent', 'AdaptationAgent', 'ChatAgent'];

  const filteredEvents = selectedAgent === 'all'
    ? events
    : events.filter(e => e.agentName === selectedAgent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="badge badge-accent">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Autonomous Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Agent Decision History & Evidence Log
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Inspect every autonomous agent decision, underlying prompt output, and cited evidence in real time.
          </p>
        </div>

        <button
          onClick={fetchEvents}
          disabled={loading}
          className="btn-secondary text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3 text-primary" /> Filter:
        </span>
        {agents.map(a => (
          <button
            key={a}
            onClick={() => setSelectedAgent(a)}
            className={`px-3 py-1 rounded-full border text-xs transition-all shrink-0 font-medium ${
              selectedAgent === a
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-surface border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {a === 'all' ? 'All Agents' : a}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3">
        {filteredEvents.map((ev, idx) => {
          const isAdaptation = ev.agentName === 'AdaptationAgent';
          const isEvaluation = ev.agentName === 'EvaluationAgent';

          return (
            <div
              key={ev.id || idx}
              className={`card p-5 space-y-3 transition-all ${
                isAdaptation
                  ? 'border-red-500/40 bg-red-500/5'
                  : isEvaluation
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`badge text-[10px] font-bold uppercase tracking-wider ${
                      isAdaptation
                        ? 'badge-danger'
                        : isEvaluation
                        ? 'badge-warning'
                        : 'badge-accent'
                    }`}
                  >
                    {ev.agentName}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    Action: <strong className="text-foreground">{ev.action}</strong>
                  </span>
                </div>

                <span className="text-xs font-mono text-muted-foreground">
                  {formatTimeAgo(ev.createdAt)} ({new Date(ev.createdAt).toLocaleTimeString()})
                </span>
              </div>

              <h3 className="font-semibold text-sm text-foreground">
                {ev.description}
              </h3>

              {ev.evidence && (
                <div className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1">
                  <span className="font-semibold text-primary block">Cited Evidence:</span>
                  <p className="italic text-muted-foreground">{ev.evidence}</p>
                </div>
              )}

              {ev.outputData && (
                <details className="text-xs text-muted-foreground pt-1 group">
                  <summary className="cursor-pointer font-mono text-primary flex items-center gap-1.5 transition-colors">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Inspect Raw Agent Output JSON</span>
                  </summary>
                  <pre className="mt-2 p-3 rounded-xl bg-surface border border-border text-[11px] font-mono text-foreground overflow-x-auto max-h-60">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(ev.outputData), null, 2);
                      } catch {
                        return ev.outputData;
                      }
                    })()}
                  </pre>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
