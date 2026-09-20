import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'demo1234';

async function main() {
  console.log('🌱 Starting EduPath database seed...');

  // 1. Roles
  const rolesData = [
    {
      slug: 'ai-engineer',
      title: 'AI Engineer',
      description: 'Build, evaluate, and orchestrate production-grade LLM applications, RAG pipelines, and autonomous AI agents.',
    },
    {
      slug: 'software-engineer',
      title: 'Software Engineer',
      description: 'Design, develop, and maintain robust, scalable software systems across modern tech stacks.',
    },
    {
      slug: 'frontend-engineer',
      title: 'Frontend Engineer',
      description: 'Create responsive, high-performance, accessible user interfaces with modern React, Next.js, and TypeScript.',
    },
    {
      slug: 'backend-engineer',
      title: 'Backend Engineer',
      description: 'Architect scalable APIs, microservices, databases, authentication, and caching systems.',
    },
    {
      slug: 'ml-engineer',
      title: 'Machine Learning Engineer',
      description: 'Train, evaluate, optimize, and deploy machine learning and deep learning models at scale.',
    },
    {
      slug: 'data-analyst',
      title: 'Data Analyst',
      description: 'Transform raw data into actionable business intelligence through SQL, statistical modeling, and dashboards.',
    },
    {
      slug: 'devops-engineer',
      title: 'DevOps Engineer',
      description: 'Automate CI/CD pipelines, container orchestration, cloud infrastructure, and site reliability.',
    },
  ];

  const createdRoles: Record<string, string> = {};
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { slug: r.slug },
      update: r,
      create: r,
    });
    createdRoles[r.slug] = role.id;
  }

  // 2. Core Skills
  const skillsData = [
    // Foundations
    { slug: 'python', name: 'Python', category: 'foundation', description: 'Core Python syntax, data structures, and async programming' },
    { slug: 'typescript', name: 'TypeScript', category: 'foundation', description: 'Strong static typing, generics, and modern JS runtime' },
    { slug: 'rest-apis', name: 'REST APIs & HTTP', category: 'foundation', description: 'Building and consuming HTTP APIs, status codes, and headers' },
    { slug: 'sql-databases', name: 'SQL & Relational Databases', category: 'foundation', description: 'PostgreSQL, relational schemas, indexing, and queries' },
    
    // AI Engineering Skills
    { slug: 'llm-fundamentals', name: 'LLM Fundamentals', category: 'core', description: 'Transformers, tokenization, context windows, and model parameters' },
    { slug: 'prompt-engineering', name: 'Prompt Engineering', category: 'core', description: 'System prompts, few-shot prompting, structured JSON extraction' },
    { slug: 'embeddings-vector-db', name: 'Embeddings & Vector Databases', category: 'core', description: 'Vector math, similarity search, pgvector, and index tuning' },
    { slug: 'rag-pipelines', name: 'RAG Pipelines', category: 'core', description: 'Retrieval Augmented Generation, chunking, re-ranking, and context injection' },
    { slug: 'tool-calling', name: 'Tool Calling & Schema Validation', category: 'core', description: 'Function calling, structured tool execution, and argument schemas' },
    { slug: 'error-handling', name: 'Error Handling & Reliability', category: 'core', description: 'Retries, fallbacks, timeout handling, and defensive parsing' },
    { slug: 'ai-agents', name: 'AI Agents & Orchestration', category: 'advanced', description: 'Multi-step planning, state management, and autonomous tool loops' },
    { slug: 'agent-evaluation', name: 'Agent Evaluation & Guardrails', category: 'advanced', description: 'LLM-as-a-judge, hallucination detection, safety guardrails' },
    { slug: 'multi-agent-systems', name: 'Multi-Agent Systems', category: 'advanced', description: 'Collaborative agent swarms, supervisor patterns, and handoffs' },
    { slug: 'system-design', name: 'System Design for AI', category: 'production', description: 'Scalable inference architecture, caching, queues, and latency' },
    { slug: 'production-ai', name: 'Production AI Deployment', category: 'production', description: 'Dockerizing agents, streaming responses, observability, and telemetry' },
  ];

  const createdSkills: Record<string, string> = {};
  for (const s of skillsData) {
    const skill = await prisma.skill.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
    createdSkills[s.slug] = skill.id;
  }

  // 3. AI Engineer Role Skills
  const aiRoleSkills = [
    { skillSlug: 'python', requiredLevel: 4, importance: 'critical' },
    { skillSlug: 'rest-apis', requiredLevel: 4, importance: 'critical' },
    { skillSlug: 'llm-fundamentals', requiredLevel: 4, importance: 'critical' },
    { skillSlug: 'prompt-engineering', requiredLevel: 4, importance: 'core' },
    { skillSlug: 'embeddings-vector-db', requiredLevel: 4, importance: 'critical' },
    { skillSlug: 'rag-pipelines', requiredLevel: 4, importance: 'critical' },
    { skillSlug: 'tool-calling', requiredLevel: 4, importance: 'critical' },
    { skillSlug: 'error-handling', requiredLevel: 4, importance: 'critical' },
    { skillSlug: 'ai-agents', requiredLevel: 4, importance: 'critical' },
    { skillSlug: 'agent-evaluation', requiredLevel: 3, importance: 'core' },
    { skillSlug: 'multi-agent-systems', requiredLevel: 3, importance: 'core' },
    { skillSlug: 'system-design', requiredLevel: 3, importance: 'core' },
    { skillSlug: 'production-ai', requiredLevel: 4, importance: 'critical' },
  ];

  for (const rs of aiRoleSkills) {
    await prisma.roleSkill.upsert({
      where: {
        roleId_skillId: {
          roleId: createdRoles['ai-engineer'],
          skillId: createdSkills[rs.skillSlug],
        },
      },
      update: { requiredLevel: rs.requiredLevel, importance: rs.importance },
      create: {
        roleId: createdRoles['ai-engineer'],
        skillId: createdSkills[rs.skillSlug],
        requiredLevel: rs.requiredLevel,
        importance: rs.importance,
      },
    });
  }

  // 4. Skill Dependencies (The Visual Graph DAG)
  const dependencies = [
    { prereq: 'python', target: 'llm-fundamentals' },
    { prereq: 'llm-fundamentals', target: 'prompt-engineering' },
    { prereq: 'python', target: 'embeddings-vector-db' },
    { prereq: 'embeddings-vector-db', target: 'rag-pipelines' },
    { prereq: 'prompt-engineering', target: 'rag-pipelines' },
    { prereq: 'prompt-engineering', target: 'tool-calling' },
    { prereq: 'rest-apis', target: 'tool-calling' },
    { prereq: 'tool-calling', target: 'error-handling' },
    { prereq: 'tool-calling', target: 'ai-agents' },
    { prereq: 'rag-pipelines', target: 'ai-agents' },
    { prereq: 'error-handling', target: 'agent-evaluation' },
    { prereq: 'ai-agents', target: 'multi-agent-systems' },
    { prereq: 'agent-evaluation', target: 'production-ai' },
    { prereq: 'multi-agent-systems', target: 'production-ai' },
    { prereq: 'system-design', target: 'production-ai' },
  ];

  for (const dep of dependencies) {
    const prereqId = createdSkills[dep.prereq];
    const targetId = createdSkills[dep.target];
    if (prereqId && targetId) {
      await prisma.skillDependency.upsert({
        where: {
          prerequisiteId_targetSkillId: {
            prerequisiteId: prereqId,
            targetSkillId: targetId,
          },
        },
        update: {},
        create: {
          prerequisiteId: prereqId,
          targetSkillId: targetId,
        },
      });
    }
  }

  // 5. Curated Learning Resources with Explicit "Why this resource?" Rationale
  const resourcesData = [
    {
      skillSlug: 'tool-calling',
      title: 'Mastering LLM Tool Calling & Structured Outputs',
      type: 'documentation',
      url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use',
      difficulty: 'intermediate',
      estimatedMinutes: 30,
      reason: 'Teaches rigorous schema validation and handling tool invocation errors when agents invoke external APIs.',
    },
    {
      skillSlug: 'error-handling',
      title: 'Building Resilient Agents: Retries, Timeouts, and Fallbacks',
      type: 'article',
      url: 'https://e2b.dev/blog/ai-agent-reliability',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      reason: 'Essential for passing production evaluation by preventing tool calling crashes on unexpected responses.',
    },
    {
      skillSlug: 'rag-pipelines',
      title: 'Advanced RAG Architectures: Hybrid Search & Re-ranking',
      type: 'tutorial',
      url: 'https://www.pinecone.io/learn/advanced-rag-techniques/',
      difficulty: 'advanced',
      estimatedMinutes: 45,
      reason: 'Directly addresses retrieval quality gaps identified during resume analysis.',
    },
  ];

  for (const res of resourcesData) {
    const skillId = createdSkills[res.skillSlug];
    if (skillId) {
      await prisma.learningResource.create({
        data: {
          skillId,
          title: res.title,
          type: res.type,
          url: res.url,
          difficulty: res.difficulty,
          estimatedMinutes: res.estimatedMinutes,
          reason: res.reason,
        },
      });
    }
  }

  // 6. Demo Learner Profile (Ilakkiyan — Aspiring AI Engineer)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo.learner@edupath.ai' },
    update: {
      passwordHash: hashPassword(DEMO_PASSWORD),
    },
    create: {
      email: 'demo.learner@edupath.ai',
      name: 'Ilakkiyan',
      passwordHash: hashPassword(DEMO_PASSWORD),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const demoProfile = await prisma.learnerProfile.upsert({
    where: { userId: demoUser.id },
    update: {
      targetRoleId: createdRoles['ai-engineer'],
      experienceLevel: 'entry',
      careerReadiness: 68,
      summary: 'Full-stack software developer proficient in Node.js, React, and REST APIs, transitioning to AI Engineering with basic LLM API experience.',
    },
    create: {
      userId: demoUser.id,
      targetRoleId: createdRoles['ai-engineer'],
      experienceLevel: 'entry',
      careerReadiness: 68,
      summary: 'Full-stack software developer proficient in Node.js, React, and REST APIs, transitioning to AI Engineering with basic LLM API experience.',
    },
  });

  await prisma.learnerPreference.upsert({
    where: { profileId: demoProfile.id },
    update: { weeklyHours: 15, preferredStyle: 'hands-on', careerGoal: 'Become a Senior AI Engineer' },
    create: {
      profileId: demoProfile.id,
      weeklyHours: 15,
      preferredStyle: 'hands-on',
      careerGoal: 'Become a Senior AI Engineer',
    },
  });

  // Learner Skills & Evidence
  const learnerSkillsData = [
    { slug: 'python', level: 3, confidence: 0.85, snippet: 'Implemented backend data processing scripts in Python' },
    { slug: 'rest-apis', level: 4, confidence: 0.92, snippet: 'Designed and deployed RESTful APIs using Node.js and Express' },
    { slug: 'llm-fundamentals', level: 3, confidence: 0.78, snippet: 'Integrated OpenAI completions API into web applications' },
    { slug: 'prompt-engineering', level: 3, confidence: 0.80, snippet: 'Wrote structured few-shot prompts for data extraction' },
    { slug: 'rag-pipelines', level: 2, confidence: 0.70, snippet: 'Basic naive RAG implementation using LangChain' },
    { slug: 'tool-calling', level: 1, confidence: 0.50, snippet: 'Minimal evidence of structured tool calling schema' },
    { slug: 'error-handling', level: 1, confidence: 0.45, snippet: 'No evidence of agent-level defensive error recovery' },
  ];

  for (const ls of learnerSkillsData) {
    const skillId = createdSkills[ls.slug];
    if (skillId) {
      const learnerSkill = await prisma.learnerSkill.upsert({
        where: {
          profileId_skillId: {
            profileId: demoProfile.id,
            skillId,
          },
        },
        update: { level: ls.level, confidence: ls.confidence },
        create: {
          profileId: demoProfile.id,
          skillId,
          level: ls.level,
          confidence: ls.confidence,
        },
      });

      await prisma.skillEvidence.create({
        data: {
          learnerSkillId: learnerSkill.id,
          source: 'resume',
          snippet: ls.snippet,
          confidence: ls.confidence,
        },
      });
    }
  }

  // Skill Gaps
  const gapsData = [
    { slug: 'tool-calling', current: 1, required: 4, gap: 'critical', reason: 'Resume demonstrates basic API calls but lacks structured tool schemas and dynamic invocation.' },
    { slug: 'error-handling', current: 1, required: 4, gap: 'critical', reason: 'No evidence of agent error recovery, retry policies, or graceful degradation.' },
    { slug: 'ai-agents', current: 1, required: 4, gap: 'critical', reason: 'Missing multi-step autonomous planning and state machine implementation.' },
    { slug: 'rag-pipelines', current: 2, required: 4, gap: 'high', reason: 'Basic RAG present, but lacks evaluation, re-ranking, and chunking strategy optimization.' },
    { slug: 'system-design', current: 2, required: 3, gap: 'moderate', reason: 'General backend architecture evident, but lacks AI streaming and caching patterns.' },
  ];

  for (const g of gapsData) {
    const skillId = createdSkills[g.slug];
    if (skillId) {
      await prisma.skillGap.upsert({
        where: {
          profileId_skillId: {
            profileId: demoProfile.id,
            skillId,
          },
        },
        update: { currentLevel: g.current, requiredLevel: g.required, gapLevel: g.gap, reason: g.reason },
        create: {
          profileId: demoProfile.id,
          skillId,
          currentLevel: g.current,
          requiredLevel: g.required,
          gapLevel: g.gap,
          reason: g.reason,
        },
      });
    }
  }

  // Initial Roadmap
  const initialRoadmap = await prisma.roadmap.create({
    data: {
      profileId: demoProfile.id,
      title: 'Autonomous AI Engineer Mastery Path',
      totalWeeks: 6,
      status: 'active',
      items: {
        create: [
          {
            weekNumber: 1,
            orderIndex: 0,
            title: 'Week 1: Advanced RAG & Vector Retrieval',
            description: 'Implement hybrid search, vector embeddings with pgvector, and chunking evaluation.',
            targetSkills: 'RAG Pipelines, Embeddings & Vector Databases',
            estimatedHours: 12,
            status: 'completed',
          },
          {
            weekNumber: 2,
            orderIndex: 1,
            title: 'Week 2: Tool Calling & Agentic Execution',
            description: 'Design deterministic tool schemas, function execution, and agent response parsing.',
            targetSkills: 'Tool Calling & Schema Validation',
            estimatedHours: 14,
            status: 'in_progress',
          },
          {
            weekNumber: 3,
            orderIndex: 2,
            title: 'Week 3: Multi-Agent Systems & Collaboration',
            description: 'Orchestrate supervisor and worker agents with shared state and handoffs.',
            targetSkills: 'Multi-Agent Systems, AI Agents & Orchestration',
            estimatedHours: 15,
            status: 'pending',
          },
          {
            weekNumber: 4,
            orderIndex: 3,
            title: 'Week 4: Production AI Deployment & Telemetry',
            description: 'Deploy resilient agent APIs with streaming, monitoring, and rate limiting.',
            targetSkills: 'Production AI Deployment, System Design for AI',
            estimatedHours: 15,
            status: 'pending',
          },
        ],
      },
    },
    include: { items: true },
  });

  // Practice Task for Week 2
  const week2Item = initialRoadmap.items.find(i => i.weekNumber === 2);
  await prisma.task.create({
    data: {
      profileId: demoProfile.id,
      roadmapItemId: week2Item?.id,
      title: 'Build a Resilient Weather Tool Agent',
      description: 'Implement an autonomous agent that receives natural language queries, validates user intent, invokes a mock weather API via tool calling, handles failures gracefully, and formats responses.',
      difficulty: 'intermediate',
      targetSkills: JSON.stringify(['Tool Calling & Schema Validation', 'Error Handling & Reliability']),
      requirements: JSON.stringify([
        'Accepts a natural-language question (e.g. "What is the weather in Tokyo?")',
        'Defines a strict JSON tool schema for get_current_weather(location, unit)',
        'Calls the API as an autonomous tool when requested by the model',
        'Provides graceful error handling for missing cities or network timeouts',
        'Returns a user-friendly conversational response',
      ]),
      expectedOutcome: 'A runnable TypeScript/JavaScript function with mock tool calling and defensive error recovery.',
      starterCode: `// Weather Agent Challenge
interface WeatherToolArgs {
  location: string;
  unit?: 'celsius' | 'fahrenheit';
}

// 1. Define the tool schema
export const weatherToolDefinition = {
  name: 'get_current_weather',
  description: 'Get the current weather for a specified location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string', description: 'City name or coordinates' },
      unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
    },
    required: ['location']
  }
};

// 2. Implement your agent handler here
export async function runWeatherAgent(userPrompt: string) {
  // TODO: Implement tool invocation and robust error handling
}
`,
      evaluationCriteria: JSON.stringify([
        'Tool Schema Completeness (25%)',
        'Invocation Correctness (25%)',
        'Error Handling & API Fallbacks (30%)',
        'Conversational Clarity (20%)',
      ]),
      estimatedMinutes: 60,
      status: 'in_progress',
    },
  });

  // Initial Agent Events
  const events = [
    {
      agentName: 'ProfileAgent',
      action: 'extracted_skills',
      description: 'Extracted 12 technical skills and 4 evidence citations from resume.',
      evidence: 'Resume mentions Node.js, Express REST APIs, React, and introductory LangChain projects.',
    },
    {
      agentName: 'SkillGapAgent',
      action: 'detected_gaps',
      description: 'Identified 3 Critical Gaps against AI Engineer role: Tool Calling, Error Handling, and AI Agents.',
      evidence: 'Absence of production function schemas, retries, and agent state loops.',
    },
    {
      agentName: 'RoadmapAgent',
      action: 'generated_roadmap',
      description: 'Synthesized 4-milestone personalized learning roadmap targeting RAG and Tool Calling.',
      evidence: 'Scheduled Tool Calling in Week 2 based on prerequisite dependencies from Python and REST APIs.',
    },
  ];

  for (const ev of events) {
    await prisma.agentEvent.create({
      data: {
        profileId: demoProfile.id,
        agentName: ev.agentName,
        action: ev.action,
        description: ev.description,
        evidence: ev.evidence,
      },
    });
  }

  // Cross-Cutting Capstone Project
  await prisma.generatedProject.create({
    data: {
      profileId: demoProfile.id,
      title: 'AI Customer Support Agent with RAG & Tool Calling',
      description: 'Full-stack AI support agent incorporating React dashboard, Node.js API, RAG knowledge base, and external API tool integration with defensive error handling.',
      difficulty: 'advanced',
      skillsDeveloped: JSON.stringify(['AI Agents & Orchestration', 'Tool Calling & Schema Validation', 'RAG Pipelines', 'Error Handling & Reliability']),
      whyThisProject: 'Tackles your 3 most critical skill gaps (Tool Calling, Error Handling, AI Agents) in a single portfolio-ready project.',
      requirements: JSON.stringify([
        'Interactive chat interface with live streaming tokens',
        'RAG ingestion pipeline indexing company FAQ documentation',
        'Tool calling engine connecting to order status and refund APIs',
        'Robust fallback logic when tool execution fails or returns invalid schemas',
      ]),
      evaluationCriteria: JSON.stringify([
        'Agent state management and tool orchestration',
        'RAG retrieval precision and source attribution',
        'Graceful failure handling and retry limits',
      ]),
      estimatedHours: 16,
      status: 'recommended',
    },
  });

  console.log('✅ EduPath seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
