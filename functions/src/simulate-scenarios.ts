/**
 * @fileOverview Simulates scenarios based on document clauses to understand potential outcomes.
 */

import { ai } from './genkit';
import { z } from 'genkit';
import type {
  SimulateScenarioInput,
  SimulateScenarioOutput,
} from './lib/types';

const SimulateScenarioInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to analyze.'),
  scenario: z
    .string()
    .describe('The scenario to simulate (e.g., defaulting on payments).'),
});

const SimulateScenarioOutputSchema = z.object({
  outcome: z
    .string()
    .describe(
      'The predicted outcome of the scenario based on the document clauses.'
    ),
  riskLevel: z
    .enum(['🟢 Low', '🟡 Medium', '🔴 High'])
    .describe('The risk level associated with the outcome.'),
  rationale: z
    .string()
    .describe(
      'The rationale behind the predicted outcome and risk level.'
    ),
});

const simulateScenarioPrompt = ai.definePrompt({
  name: 'simulateScenarioPrompt',
  input: { schema: SimulateScenarioInputSchema },
  output: { schema: SimulateScenarioOutputSchema },
  prompt: `You are an AI expert in legal document analysis and risk assessment.

You are provided with a document and a hypothetical scenario. Your task is to analyze the document and predict the outcome of the scenario, along with the associated risk level and rationale.

Document:
{{documentText}}

Scenario:
{{scenario}}

Consider all relevant clauses in the document and provide a clear and concise explanation of the likely outcome, its risk level (🟢 Low, 🟡 Medium, or 🔴 High), and the rationale behind your assessment.
`,
});

export const simulateScenarioFlow = ai.defineFlow(
  {
    name: 'simulateScenarioFlow',
    inputSchema: SimulateScenarioInputSchema,
    outputSchema: SimulateScenarioOutputSchema,
  },
  async (input: SimulateScenarioInput): Promise<SimulateScenarioOutput> => {
    const { output } = await simulateScenarioPrompt(input);
    return output!;
  }
);
