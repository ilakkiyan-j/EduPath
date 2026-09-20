import Link from 'next/link';
import {
  ArrowRight,
  Zap,
  Activity,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const loopSteps = [
    { step: '01', title: 'Understand', desc: 'Ingests resume & extracts verified skills with literal evidence citations' },
    { step: '02', title: 'Identify', desc: 'Compares competencies against target role to spot critical skill gaps' },
    { step: '03', title: 'Plan', desc: 'Traverses skill dependency DAG to synthesize a personalized roadmap' },
    { step: '04', title: 'Practice', desc: 'Generates realistic coding challenges with clear evaluation rubrics' },
    { step: '05', title: 'Evaluate', desc: 'Grades submissions across correctness, architecture, and error handling' },
    { step: '06', title: 'Adapt', desc: 'Reshapes upcoming milestones in real time based on performance weaknesses' },
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4">
        {/* Pill badge */}
        <div className="badge badge-accent inline-flex">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Autonomous AI Career Platform</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          Your AI career agent that{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">
            learns how you learn.
          </span>
        </h1>

        {/* Subtitle / Core Pitch */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Most learning platforms ask what course you want to take. EduPath starts somewhere else: it observes what you already know, identifies what you lack, gives you practical work, and{' '}
          <span className="text-foreground font-semibold">continuously rebuilds your roadmap</span> around your weaknesses.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            href="/signup"
            className="btn-primary text-sm font-semibold flex items-center gap-2 py-3 px-6 shadow-sm"
          >
            <Zap className="w-4 h-4" />
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="btn-secondary text-sm font-semibold flex items-center gap-2 py-3 px-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Launch Demo Dashboard</span>
          </Link>

          <Link
            href="/signin"
            className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
          >
            <span>Sign In</span>
          </Link>
        </div>

        {/* Live Demo Script Banner */}
        <div className="card p-5 max-w-xl mx-auto text-left mt-8 text-xs border-primary/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              Adaptive Feedback Loop Live Flow
            </span>
            <span className="badge badge-accent font-mono text-[10px]">
              Ready to Demo
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            1. Open <strong className="text-foreground">Dashboard</strong> → View initial roadmap (Week 3: Multi-Agent Systems).<br />
            2. Go to <strong className="text-foreground">Tasks</strong> → Submit flawed solution on Weather Agent.<br />
            3. Watch <strong className="text-foreground">Evaluation Agent</strong> score 54% and <strong className="text-foreground">Adaptation Agent</strong> automatically inject <em>Tool Reliability</em> prerequisites!<br />
            4. Ask the <strong className="text-foreground">Assistant</strong>: <em>&quot;Why did you change my roadmap?&quot;</em>
          </p>
        </div>
      </section>

      {/* Autonomous Feedback Loop Visualization */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            The Autonomous Adaptive Loop
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Every meaningful learner evaluation has the ability to change what the learner does next.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loopSteps.map(item => (
            <div
              key={item.step}
              className="card card-hover p-5 space-y-2 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="badge badge-neutral text-xs font-mono font-semibold">
                  STAGE {item.step}
                </span>
                <span className="text-[11px] text-muted-foreground">Autonomous</span>
              </div>
              <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Primary Differentiator Comparison */}
      <section className="card p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Why EduPath is an AI Agent, Not a Static LMS
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Traditional LMS platforms present linear static video playlists. EduPath behaves like a dedicated principal engineer mentoring you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-surface border border-border space-y-3">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
              Traditional Learning Platform
            </span>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <p>❌ Ask you what course you want to buy</p>
              <p>❌ Static predefined video curriculum</p>
              <p>❌ Multiple-choice quiz or unreviewed homework</p>
              <p>❌ Roadmap remains identical regardless of your weaknesses</p>
              <p>❌ Generic chatbot answering textbook questions</p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface border-2 border-primary/50 space-y-3 shadow-sm">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              EduPath AI Career Agent
            </span>
            <div className="space-y-2 text-xs sm:text-sm text-foreground">
              <p>✅ Extracts what you already know with resume evidence quotes</p>
              <p>✅ Synthesizes an interactive skill dependency graph</p>
              <p>✅ Evaluates hands-on coding and system implementations</p>
              <p>✅ <strong className="text-primary font-semibold">Dynamically rewrites roadmap</strong> when weaknesses are detected</p>
              <p>✅ Assistant explains decisions citing your actual evaluation results</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
