'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckSquare,
  Clock,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  RotateCcw,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [adaptationResult, setAdaptationResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Pre-configured flawed submission matching Master Prompt Section 41 & 43
  const flawedSolutionCode = `// Flawed submission: Calls the weather API as a tool, but has NO runtime schema
// validation, NO defensive error handling, and crashes on missing cities or timeouts.

export const weatherToolDefinition = {
  name: 'get_current_weather',
  description: 'Get current weather',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string' },
      unit: { type: 'string' }
    }
  }
};

export async function runWeatherAgent(userPrompt: string) {
  console.log("Analyzing prompt: " + userPrompt);
  
  // Naive extraction without schema validation
  const location = userPrompt.includes("Tokyo") ? "Tokyo" : "Unknown";
  
  // Unhandled external API call without try/catch or retry
  const response = await fetch("https://api.weather.mock/v1?city=" + location);
  const data = await response.json();
  
  return "The weather in " + location + " is " + data.temp + " degrees.";
}
`;

  // Pre-configured robust solution
  const robustSolutionCode = `import { z } from 'zod';

const WeatherArgsSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
});

export const weatherToolDefinition = {
  name: 'get_current_weather',
  description: 'Get the current weather with defensive validation',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string', description: 'City name' },
      unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
    },
    required: ['location']
  }
};

export async function runWeatherAgent(userPrompt: string) {
  try {
    const rawArgs = { location: 'Tokyo', unit: 'celsius' };
    const validated = WeatherArgsSchema.parse(rawArgs);

    // Defensive simulation with retries and timeout
    let attempts = 0;
    while (attempts < 3) {
      try {
        attempts++;
        return \`Current temperature in \${validated.location} is 22°\${validated.unit === 'celsius' ? 'C' : 'F'}.\`;
      } catch (networkErr) {
        if (attempts >= 3) throw networkErr;
      }
    }
  } catch (err: any) {
    return \`I encountered an issue verifying the weather for that location: \${err.message}. Please try again.\`;
  }
}
`;

  useEffect(() => {
    fetch(`/api/tasks/${params.id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setTask(json.data);
          setCode(json.data.starterCode || '');
          if (json.data.submissions?.length > 0) {
            const sub = json.data.submissions[0];
            if (sub.submittedCode) setCode(sub.submittedCode);
            if (sub.evaluation) setEvaluationResult(sub.evaluation);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluating(true);
    setEvaluationResult(null);
    setAdaptationResult(null);

    try {
      const res = await fetch(`/api/tasks/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          text: notes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setEvaluationResult(json.data.evaluation);
        if (json.data.adaptation) {
          setAdaptationResult(json.data.adaptation);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Loading Challenge Environment...</p>
      </div>
    );
  }

  let requirements: string[] = [];
  let evaluationCriteria: string[] = [];
  try {
    requirements = JSON.parse(task?.requirements || '[]');
    evaluationCriteria = JSON.parse(task?.evaluationCriteria || '[]');
  } catch {
    requirements = [task?.requirements];
    evaluationCriteria = [task?.evaluationCriteria];
  }

  let feedbackItems: any[] = [];
  let weakAreas: string[] = [];
  let strengths: string[] = [];
  let skillsDemonstrated: string[] = [];

  if (evaluationResult) {
    try {
      feedbackItems = JSON.parse(evaluationResult.feedback || '[]');
      weakAreas = JSON.parse(evaluationResult.weakAreas || '[]');
      strengths = JSON.parse(evaluationResult.strengths || '[]');
      skillsDemonstrated = JSON.parse(evaluationResult.skillsDemonstrated || '[]');
    } catch {
      // fallback
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/tasks" className="hover:text-foreground transition-colors">
          Tasks
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate">{task?.title}</span>
      </div>

      {/* Challenge Overview */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="badge badge-accent font-mono uppercase tracking-wider text-[10px]">
              {task?.difficulty} Challenge
            </span>
            <h1 className="text-2xl font-bold text-foreground">{task?.title}</h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {task?.estimatedMinutes} mins
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-4xl">
          {task?.description}
        </p>

        {/* Requirements & Criteria Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
              Requirements Checklist:
            </span>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider block">
              Evaluation Rubric:
            </span>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {evaluationCriteria.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span className="text-foreground">{crit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Demo Button Bar */}
      <div className="p-4 rounded-xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            Interactive Demo Quick Loader:
          </span>
          <span className="text-[11px] text-muted-foreground">
            Load an intentional flawed solution to trigger the real-time Adaptation Agent workflow!
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCode(flawedSolutionCode)}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <span>⚡ Load Flawed Solution (Adaptation Trigger)</span>
          </button>

          <button
            type="button"
            onClick={() => setCode(robustSolutionCode)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs transition-colors"
          >
            <span>Load Robust Solution</span>
          </button>
        </div>
      </div>

      {/* Submission Form & Code Editor */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-primary" />
              Your Solution Code (TypeScript / JavaScript)
            </label>
            <span className="text-[11px] text-muted-foreground font-mono">Starter Template Ready</span>
          </div>

          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={14}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors leading-relaxed shadow-inner"
            placeholder="// Paste your implementation here..."
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Implementation Notes / Architecture Rationale (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Implemented weather tool call with error recovery on HTTP 500"
              className="input w-full"
            />
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={evaluating}
          className="w-full py-3.5 rounded-xl btn-primary flex items-center justify-center gap-2 disabled:opacity-50 text-sm font-semibold"
        >
          {evaluating ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Evaluation Agent Grading Submission & Inspecting Gaps...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Submit for Autonomous AI Evaluation</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Live Structured Evaluation Scorecard */}
      {evaluationResult && (
        <div className="card p-6 border-primary/40 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="text-[10px] font-mono text-primary uppercase tracking-wider">
                Evaluation Agent Scorecard
              </span>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                Overall Score: {evaluationResult.overallScore}%
                {evaluationResult.overallScore >= 70 ? (
                  <span className="badge badge-success text-xs">
                    Passed
                  </span>
                ) : (
                  <span className="badge badge-danger text-xs">
                    Remediation Required
                  </span>
                )}
              </h3>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-muted-foreground block">Demonstrated Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1 sm:justify-end">
                {skillsDemonstrated.map((s, idx) => (
                  <span key={idx} className="badge badge-accent text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Weakness Callout */}
          {weakAreas.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Persistent Weakness Detected:
              </span>
              <div className="flex flex-wrap gap-2">
                {weakAreas.map((w, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30 font-medium"
                  >
                    ⚠ {w}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                Demonstrated Strengths:
              </span>
              <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                {strengths.map((str, idx) => (
                  <li key={idx} className="text-foreground">{str}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback Items Breakdown */}
          {feedbackItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                Technical Feedback:
              </span>
              <div className="space-y-2">
                {feedbackItems.map((fb, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{fb.category}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          fb.severity === 'error'
                            ? 'text-red-600 dark:text-red-400 bg-red-500/15'
                            : 'text-amber-600 dark:text-amber-400 bg-amber-500/15'
                        }`}
                      >
                        {fb.severity}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{fb.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Adaptation Notice Banner */}
          {adaptationResult?.adaptationTriggered && (
            <div className="p-5 rounded-2xl bg-surface border-2 border-primary/60 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-sm text-primary flex items-center gap-2">
                  <Zap className="w-4 h-4 animate-pulse" />
                  ⚡ Adaptation Agent Triggered: Roadmap Rebuilt!
                </span>
                <span className="badge badge-accent text-xs font-mono font-bold">
                  Action: {adaptationResult.adaptationType}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {adaptationResult.agentSummaryForLearner}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/roadmap"
                  className="btn-primary text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>Inspect Adapted Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/chat"
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask Assistant: &quot;Why did you change my roadmap?&quot;</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
