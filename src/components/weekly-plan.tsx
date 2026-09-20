'use client';

import { useState, useEffect } from 'react';
import {
  CalendarDays,
  BookOpen,
  Terminal,
  Hammer,
  ClipboardCheck,
  Wrench,
  FolderKanban,
  RefreshCcw,
  Clock,
} from 'lucide-react';

interface WeeklyPlanProps {
  milestone?: {
    id: string;
    weekNumber: number;
    title: string;
    estimatedHours: number;
    targetSkills: string;
  } | null;
}

const DAYS = [
  { key: 'monday', label: 'MON', icon: BookOpen, type: 'Learn', tone: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  { key: 'tuesday', label: 'TUE', icon: Terminal, type: 'Practice', tone: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
  { key: 'wednesday', label: 'WED', icon: Hammer, type: 'Build', tone: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  { key: 'thursday', label: 'THU', icon: ClipboardCheck, type: 'Evaluate', tone: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
  { key: 'friday', label: 'FRI', icon: Wrench, type: 'Fix', tone: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { key: 'saturday', label: 'SAT', icon: FolderKanban, type: 'Project', tone: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { key: 'sunday', label: 'SUN', icon: RefreshCcw, type: 'Review', tone: 'text-muted-foreground bg-muted border-border' },
];

export default function WeeklyPlan({ milestone }: WeeklyPlanProps) {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(json => {
        if (json.success) setTasks(json.data || []);
      })
      .catch(console.error);
  }, []);

  if (!milestone) return null;

  const weekTasks = tasks.filter((t: any) => t.roadmapItemId === milestone.id);
  const pending = weekTasks.filter((t: any) => t.status !== 'completed');
  const primaryTask = pending[0] || weekTasks[0];
  const secondaryTask = pending[1] || weekTasks[1];
  const latestEval = weekTasks
    .flatMap((t: any) => t.submissions || [])
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.evaluation;

  const fixFocus = latestEval?.recommendedNextAction || "Refactor & harden this week's deliverable";
  const estimatedHours = milestone.estimatedHours || 12;
  const learnMinutes = Math.min(60, Math.max(30, Math.round(estimatedHours * 60 * 0.25)));
  const practiceMinutes = primaryTask?.estimatedMinutes || 60;
  const buildMinutes = secondaryTask?.estimatedMinutes || Math.round(estimatedHours * 60 * 0.3);
  const projectHours = Math.max(2, Math.min(3, Math.round(estimatedHours / 4)));

  const schedule = [
    { ...DAYS[0], title: milestone.title, detail: 'Core concepts & documentation reading', minutes: learnMinutes },
    {
      ...DAYS[1],
      title: primaryTask?.title || milestone.title,
      detail: primaryTask?.description || 'Guided practice exercise',
      minutes: practiceMinutes,
    },
    {
      ...DAYS[2],
      title: secondaryTask?.title || 'Milestone Deliverable',
      detail: secondaryTask?.description || "Hands-on build combining this week's skills",
      minutes: buildMinutes,
    },
    { ...DAYS[3], title: `AI Assessment — ${milestone.title}`, detail: 'Submit your work for agent evaluation', minutes: 30 },
    { ...DAYS[4], title: fixFocus, detail: latestEval ? 'Resolve weaknesses flagged by Evaluation Agent' : 'Code review & defensive fixes', minutes: 45 },
    { ...DAYS[5], title: `${milestone.title} Capstone`, detail: `Consolidate: ${milestone.targetSkills}`, minutes: projectHours * 60 },
    { ...DAYS[6], title: 'Weekly Reflection', detail: 'Review agent feedback & update learner memory', minutes: 20 },
  ];

  const formatMinutes = (m: number) =>
    m >= 60 ? `${Math.round(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-accent-cyan" />
            <h3 className="font-bold text-sm text-foreground">
              Weekly Learning Plan
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Week {milestone.weekNumber} — auto-scheduled from your active milestone, tasks & latest evaluation
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground px-2.5 py-1 rounded-lg bg-card border border-border">
          {estimatedHours} hrs / week
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {schedule.map(day => {
          const Icon = day.icon;
          return (
            <div
              key={day.key}
              className="p-3.5 rounded-xl card bg-surface hover:border-accent-indigo/40 transition-colors text-xs space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                    {day.label}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>

                <span
                  className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${day.tone}`}
                >
                  {day.type}
                </span>

                <h4 className="font-bold text-xs text-foreground leading-snug line-clamp-2 min-h-[2rem]">
                  {day.title}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                  {day.detail}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground pt-2 border-t border-border">
                <Clock className="w-3 h-3" />
                {formatMinutes(day.minutes)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}