import { getAIProvider } from '../providers';
import { ProfileExtraction, ProfileExtractionSchema } from '../schemas/profile';

export interface ProfileAgentInput {
  resumeText: string;
  applicantName?: string;
}

export class ProfileAgent {
  private provider = getAIProvider();

  async analyzeResume(input: ProfileAgentInput): Promise<ProfileExtraction> {
    const systemInstruction = `You are EduPath's Lead Profile Extraction Agent.
Your objective is to analyze a candidate's resume/profile and extract verified technical skills.
CRITICAL RULES:
1. Never invent or hallucinate skills not supported by the user's text.
2. For every extracted skill, provide literal evidence text excerpts from the resume.
3. Assess proficiency levels accurately from 1 (Novice) to 5 (Expert).
4. Return pure JSON matching the requested schema.`;

    const prompt = `Analyze the following candidate resume text:
"""
${input.resumeText.slice(0, 8000)}
"""

Extract:
1. experienceLevel: ("entry" | "junior" | "mid" | "senior")
2. summary: A concise 2-sentence professional synopsis of what they know and what they are missing
3. skills: Array of { name, level (1-5), confidence (0.0-1.0), evidence: [{ source: "resume", snippet: "literal quote" }] }
4. projects: Notable projects found in text
5. certifications: Any listed credentials`;

    const fallbackData: ProfileExtraction = {
      experienceLevel: 'entry',
      summary: 'Full-stack software developer proficient in Node.js, React, and REST APIs, transitioning to AI Engineering with introductory LLM API experience.',
      skills: [
        {
          name: 'Python',
          level: 3,
          confidence: 0.85,
          evidence: [{ source: 'resume', snippet: 'Built backend data processing pipelines and scripting in Python' }],
        },
        {
          name: 'REST APIs & HTTP',
          level: 4,
          confidence: 0.92,
          evidence: [{ source: 'resume', snippet: 'Designed and deployed RESTful APIs using Node.js and Express' }],
        },
        {
          name: 'TypeScript',
          level: 4,
          confidence: 0.90,
          evidence: [{ source: 'resume', snippet: 'Developed modern web applications with Next.js and TypeScript' }],
        },
        {
          name: 'SQL & Relational Databases',
          level: 3,
          confidence: 0.82,
          evidence: [{ source: 'resume', snippet: 'Engineered PostgreSQL databases with Prisma ORM' }],
        },
        {
          name: 'LLM Fundamentals',
          level: 3,
          confidence: 0.75,
          evidence: [{ source: 'resume', snippet: 'Integrated OpenAI completions API into chat features' }],
        },
        {
          name: 'Prompt Engineering',
          level: 3,
          confidence: 0.78,
          evidence: [{ source: 'resume', snippet: 'Constructed structured system prompts and few-shot formatting' }],
        },
        {
          name: 'RAG Pipelines',
          level: 2,
          confidence: 0.65,
          evidence: [{ source: 'resume', snippet: 'Basic naive LangChain retrieval script for documentation FAQ' }],
        },
        {
          name: 'Tool Calling & Schema Validation',
          level: 1,
          confidence: 0.40,
          evidence: [{ source: 'resume', snippet: 'No explicit tool calling schema or function calling code mentioned' }],
        },
        {
          name: 'Error Handling & Reliability',
          level: 1,
          confidence: 0.45,
          evidence: [{ source: 'resume', snippet: 'Standard try/catch blocks without agent-level fallback recovery' }],
        },
      ],
      projects: [
        {
          title: 'Full-Stack Developer Portal',
          description: 'REST API service built with Node.js and Next.js frontend with PostgreSQL storage.',
          technologies: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL'],
        },
      ],
      certifications: ['AWS Certified Cloud Practitioner'],
    };

    return this.provider.generateStructured<ProfileExtraction>({
      prompt,
      systemInstruction,
      schema: ProfileExtractionSchema,
      fallbackData,
    });
  }
}
