'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Clock,
  ArrowRight,
  Zap,
  Code2,
} from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(json => {
        if (json.success) setTasks(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Loading Practice Challenges...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="badge badge-accent">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Stage 5: Hands-On Practice & Evaluation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Practical Challenges & Coding Tasks
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
          EduPath generates realistic coding exercises targeting your active gaps. Submissions are evaluated by the Evaluation Agent and feed directly into roadmap adaptation.
        </p>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map(task => {
          const isSubmitted = task.submissions?.length > 0;
          const latestEval = task.submissions?.[0]?.evaluation;
          const score = latestEval?.overallScore;
          const isPassing = latestEval?.isPassing;

          return (
            <div
              key={task.id}
              className="card card-hover p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-accent font-mono uppercase tracking-wider text-[10px]">
                      {task.difficulty}
                    </span>
                    {task.roadmapItem && (
                      <span className="text-xs text-muted-foreground">
                        {task.roadmapItem.title}
                      </span>
                    )}
                    {isSubmitted && (
                      <span
                        className={`badge text-[10px] ${
                          isPassing ? 'badge-success' : 'badge-danger'
                        }`}
                      >
                        {isPassing ? `Passed (${score}%)` : `Evaluated: ${score}% (Weakness Found)`}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg text-foreground">
                    {task.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                    {task.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {task.estimatedMinutes} mins
                  </span>

                  <Link
                    href={`/tasks/${task.id}`}
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <span>{isSubmitted ? 'View Evaluation / Resubmit' : 'Open Challenge'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
