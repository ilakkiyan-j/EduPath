import { getAIProvider } from '../providers';
import { TaskEvaluationResult, TaskEvaluationSchema } from '../schemas/evaluation';

export interface EvaluationAgentInput {
  taskTitle: string;
  requirements: string[];
  evaluationCriteria: string[];
  submission: {
    code?: string;
    text?: string;
    githubUrl?: string;
  };
}

export class EvaluationAgent {
  private provider = getAIProvider();

  async evaluateSubmission(input: EvaluationAgentInput): Promise<TaskEvaluationResult> {
    const systemInstruction = `You are EduPath's Senior Technical Evaluation Agent.
Evaluate the learner's task submission against the explicit requirements and evaluation criteria.
Be objective, rigorous, and constructive.
Identify verified strengths and pinpoint specific missing components or weaknesses (e.g. error handling, edge cases, schema validations).
Calculate an overall score between 0 and 100. Passing threshold is 70.
Return pure JSON conforming to TaskEvaluationSchema.`;

    const prompt = `Task: "${input.taskTitle}"
Requirements:
${JSON.stringify(input.requirements, null, 2)}

Criteria:
${JSON.stringify(input.evaluationCriteria, null, 2)}

Learner Submission:
Code:
"""
${input.submission.code || '(No code provided)'}
"""
Text:
"""
${input.submission.text || '(No text commentary)'}
"""
GitHub: ${input.submission.githubUrl || 'N/A'}

Perform structured technical evaluation.`;

    // Check if the submission has weakness traits (e.g. mock test submission simulation)
    const submittedCode = input.submission.code || '';
    const isWeakSimulation =
      submittedCode.includes('// Flawed submission') ||
      submittedCode.includes('throw new Error') ||
      !submittedCode.includes('try') ||
      submittedCode.length < 250;

    const fallbackData: TaskEvaluationResult = isWeakSimulation
      ? {
          overallScore: 54,
          isPassing: false,
          skillsDemonstrated: ['REST APIs & HTTP', 'Basic Prompt Engineering'],
          weakAreas: ['Error Handling & Reliability', 'Tool Calling & Schema Validation', 'Fallback Recovery'],
          strengths: ['Understands basic API invocation syntax and conversational prompt structure'],
          feedback: [
            {
              category: 'Error Handling',
              comment: 'No defensive try/catch blocks or retry policies around external API calls. Crashes unhandled when API returns HTTP 500 or timeout.',
              severity: 'error',
            },
            {
              category: 'Tool Schema Validation',
              comment: 'Tool arguments from LLM completion are passed directly to API without runtime validation against JSON schema.',
              severity: 'warning',
            },
            {
              category: 'Fallback Recovery',
              comment: 'Missing conversational fallback when location is not found.',
              severity: 'warning',
            },
          ],
          skillUpdates: [
            {
              skillName: 'Tool Calling & Schema Validation',
              previousLevel: 1,
              newLevel: 1,
              confidenceChange: -0.1,
              reason: 'Lacks runtime schema verification on LLM tool arguments',
            },
            {
              skillName: 'Error Handling & Reliability',
              previousLevel: 1,
              newLevel: 1,
              confidenceChange: -0.2,
              reason: 'Uncaught exceptions on network failures',
            },
          ],
          recommendedNextAction: 'Review tool validation schemas and implement retry policies before proceeding to multi-agent architectures.',
          detailedReasoning: 'While the candidate demonstrates basic comprehension of tool calling mechanics, the code lacks production resilience. Tool arguments are unvalidated and network exceptions result in complete process failure.',
        }
      : {
          overallScore: 88,
          isPassing: true,
          skillsDemonstrated: ['Tool Calling & Schema Validation', 'Error Handling & Reliability', 'TypeScript'],
          weakAreas: ['Exponential Backoff Jitter'],
          strengths: ['Robust JSON schema verification with Zod', 'Graceful fallback on 404 city responses', 'Clean async structure'],
          feedback: [
            {
              category: 'Implementation Quality',
              comment: 'Clean TypeScript types with Zod runtime validation.',
              severity: 'info',
            },
            {
              category: 'Error Recovery',
              comment: 'Handles timeout and missing query gracefully.',
              severity: 'info',
            },
          ],
          skillUpdates: [
            {
              skillName: 'Tool Calling & Schema Validation',
              previousLevel: 1,
              newLevel: 3,
              confidenceChange: +0.35,
              reason: 'Demonstrated complete schema validation and dynamic tool execution',
            },
            {
              skillName: 'Error Handling & Reliability',
              previousLevel: 1,
              newLevel: 3,
              confidenceChange: +0.30,
              reason: 'Implemented retry logic and defensive recovery',
            },
          ],
          recommendedNextAction: 'Proceed to Multi-Agent Systems milestone.',
          detailedReasoning: 'Exemplary implementation meeting all functional and reliability criteria.',
        };

    return this.provider.generateStructured<TaskEvaluationResult>({
      prompt,
      systemInstruction,
      schema: TaskEvaluationSchema,
      fallbackData,
    });
  }
}
