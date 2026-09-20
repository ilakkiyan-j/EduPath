'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Zap,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [applicantName, setApplicantName] = useState('Ilakkiyan');
  const [targetRole, setTargetRole] = useState('AI Engineer');
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [learningPreference, setLearningPreference] = useState('hands-on');
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [error, setError] = useState('');

  const sampleResumes = [
    {
      title: 'Full-Stack Developer → Aspiring AI Engineer',
      role: 'AI Engineer',
      name: 'Ilakkiyan',
      text: `Ilakkiyan — Software Engineer
EXPERIENCE:
Full-Stack Developer at TechForge (2024 - Present)
- Engineered scalable backend microservices and RESTful APIs using Node.js, Express, and PostgreSQL.
- Developed responsive, accessible frontend interfaces with React, Next.js, and TypeScript.
- Integrated OpenAI completions API for customer service automation.
- Built a naive RAG proof-of-concept using LangChain and basic text chunking.

SKILLS:
- Languages: JavaScript, TypeScript, Python, SQL
- Frameworks: React, Next.js, Node.js, Express, Tailwind CSS
- Databases: PostgreSQL, Prisma ORM
- AI/ML: Basic Prompt Engineering, LLM API consumption, introductory LangChain

EDUCATION:
B.S. in Computer Science (2024)`,
    },
    {
      title: 'Backend Developer → AI Systems Engineer',
      role: 'AI Engineer',
      name: 'Sarah Chen',
      text: `Sarah Chen — Backend Systems Engineer
EXPERIENCE:
Backend Engineer at CloudFlow (2023 - Present)
- Architected distributed data ingestion pipelines using Python, FastAPI, and Kafka.
- Designed database schemas and optimized complex queries on PostgreSQL.
- Implemented Docker containerization and CI/CD pipelines with GitHub Actions.
- Experimented with Hugging Face embeddings and local vector indexes.

SKILLS:
- Languages: Python, Go, SQL
- Backend: FastAPI, Docker, Redis, PostgreSQL
- Architecture: Microservices, Event-Driven Architecture, Caching`,
    },
  ];

  const handleSampleSelect = (sample: typeof sampleResumes[0]) => {
    setResumeText(sample.text);
    setApplicantName(sample.name);
    setTargetRole(sample.role);
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (selected.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = () => setResumeText(reader.result as string);
        reader.readAsText(selected);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setError('');

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('applicantName', applicantName);
        res = await fetch('/api/profile/analyze', {
          method: 'POST',
          body: formData,
        });
      } else {
        res = await fetch('/api/profile/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: resumeText,
            applicantName,
          }),
        });
      }

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze resume');
      }

      setExtractedData(result.data.extracted);

      // Now trigger Gap Analysis for chosen role
      await fetch('/api/gaps/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId: undefined,
        }),
      });

      // Generate Roadmap based on constraints
      await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weeklyHours,
          learningPreference,
        }),
      });
    } catch (err: any) {
      setError(err.message || 'Error processing profile');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="badge badge-accent inline-flex">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stage 1: Autonomous Intake</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Create Your Learner Profile
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Upload your resume or pick a demo profile. Our Profile Agent extracts verified skills with textual evidence quotes.
        </p>
      </div>

      {/* Preset Quick Loader */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Quick Demo Presets (1-Click Fill)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampleResumes.map(s => (
            <button
              key={s.title}
              type="button"
              onClick={() => handleSampleSelect(s)}
              className="p-3.5 rounded-xl card card-hover text-left flex items-start justify-between group transition-all"
            >
              <div>
                <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors block">
                  {s.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {s.name} • Target: {s.role}
                </span>
              </div>
              <span className="badge badge-accent text-[10px]">
                Load
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          {/* Candidate Name & Target Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Your Name</label>
              <input
                type="text"
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)}
                required
                className="input w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Target Role</label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="input w-full"
              >
                <option value="AI Engineer">AI Engineer</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>
          </div>

          {/* Resume Upload or Paste */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Resume / Profile Data</label>
              <span className="text-[11px] text-muted-foreground">Supports PDF, DOCX, TXT or raw text</span>
            </div>

            <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors bg-surface/50">
              <input
                type="file"
                id="resume-file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resume-file" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud className="w-8 h-8 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  {file ? file.name : 'Drop your resume file here or click to browse'}
                </span>
                <span className="text-[11px] text-muted-foreground">PDF, DOCX up to 10MB</span>
              </label>
            </div>

            <div className="pt-2">
              <span className="text-xs text-muted-foreground block mb-1">Or paste resume text directly:</span>
              <textarea
                value={resumeText}
                onChange={e => {
                  setResumeText(e.target.value);
                  setFile(null);
                }}
                rows={6}
                placeholder="Paste work experience, skills, projects, and certifications..."
                className="input w-full font-mono text-xs"
              />
            </div>
          </div>

          {/* Constraints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Weekly Availability</label>
                <span className="text-xs font-bold text-primary">{weeklyHours} hrs/week</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={5}
                value={weeklyHours}
                onChange={e => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Learning Preference</label>
              <select
                value={learningPreference}
                onChange={e => setLearningPreference(e.target.value)}
                className="input w-full"
              >
                <option value="hands-on">Hands-on coding challenges & tasks</option>
                <option value="architecture">System design & architectural specs</option>
                <option value="deep-dive">Theory, documentation & papers</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={analyzing}
          className="w-full py-3.5 rounded-xl btn-primary text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Resume & Synthesizing Adaptive Roadmap...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Execute Profile Extraction & Gap Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Extraction Results Preview */}
      {extractedData && (
        <div className="card p-6 space-y-4 border-primary/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-sm text-foreground">
                Profile Agent Successfully Extracted Skills
              </h3>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <span>Go to Command Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground italic">
            &quot;{extractedData.summary}&quot;
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
              Extracted Skills with Evidence:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {extractedData.skills.map((s: any) => (
                <div
                  key={s.name}
                  className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{s.name}</span>
                    <span className="badge badge-neutral text-[10px] font-mono">
                      Level {s.level}/5
                    </span>
                  </div>
                  {s.evidence?.[0] && (
                    <p className="text-xs text-muted-foreground italic">
                      &quot;{s.evidence[0].snippet}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
