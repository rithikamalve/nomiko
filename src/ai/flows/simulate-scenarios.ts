'use server';

/**
 * @fileOverview Simulates scenarios based on document clauses to understand potential outcomes.
 *
 * - simulateScenario - A function that simulates a scenario based on user input and document clauses.
 * - SimulateScenarioInput - The input type for the simulateScenario function.
 * - SimulateScenarioOutput - The return type for the simulateScenario function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateScenarioInputSchema = z.object({
  documentText: z.string().describe('The text content of the document to analyze.'),
  scenario: z.string().describe('The scenario to simulate (e.g., defaulting on payments).'),
});
export type SimulateScenarioInput = z.infer<typeof SimulateScenarioInputSchema>;

const SimulateScenarioOutputSchema = z.object({
  outcome: z.string().describe('The predicted outcome of the scenario based on the document clauses.'),
  riskLevel: z.enum(['🟢 Low', '🟡 Medium', '🔴 High']).describe('The risk level associated with the outcome.'),
  rationale: z.string().describe('The rationale behind the predicted outcome and risk level.'),
});
export type SimulateScenarioOutput = z.infer<typeof SimulateScenarioOutputSchema>;

export async function simulateScenario(input: SimulateScenarioInput): Promise<SimulateScenarioOutput> {
  return simulateScenarioFlow(input);
}

const simulateScenarioPrompt = ai.definePrompt({
  name: 'simulateScenarioPrompt',
  input: {schema: SimulateScenarioInputSchema},
  output: {schema: SimulateScenarioOutputSchema},
  prompt: `You are an AI expert in legal document analysis and risk assessment.

You are provided with a document and a hypothetical scenario. Your task is to analyze the document and predict the outcome of the scenario, along with the associated risk level and rationale.

Document:
{{documentText}}

Scenario:
{{scenario}}

Consider all relevant clauses in the document and provide a clear and concise explanation of the likely outcome, its risk level (🟢 Low, 🟡 Medium, or 🔴 High), and the rationale behind your assessment.
`,
});

const simulateScenarioFlow = ai.defineFlow(
  {
    name: 'simulateScenarioFlow',
    inputSchema: SimulateScenarioInputSchema,
    outputSchema: SimulateScenarioOutputSchema,
  },
  async input => {
    const {output} = await simulateScenarioPrompt(input);
    return output!;
  }
);
