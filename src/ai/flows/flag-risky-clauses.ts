'use server';

/**
 * @fileOverview This file defines a Genkit flow for identifying and flagging potentially risky clauses in a document.
 *
 * - flagRiskyClauses - A function that takes document text as input and returns a stream of risky clauses with risk scores and rationales.
 * - FlagRiskyClausesInput - The input type for the flagRiskyClauses function.
 * - FlagRiskyClausesOutput - The return type for the flagRiskyClauses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagRiskyClausesInputSchema = z.object({
  documentText: z
    .string()
    .describe('The complete text of the document to analyze.'),
});
export type FlagRiskyClausesInput = z.infer<typeof FlagRiskyClausesInputSchema>;

const RiskAssessmentSchema = z.object({
  isRisky: z.boolean().describe('Whether the clause is potentially risky.'),
  riskScore: z
    .enum(['🟢 Low', '🟡 Medium', '🔴 High'])
    .describe(
      'The risk score of the clause: 🟢 Low (Standard), 🟡 Medium (Unfavorable but negotiable), 🔴 High (High risk / predatory).'
    ),
  rationale: z
    .string()
    .describe('The rationale for why the clause is considered risky.'),
});

const ClauseAnalysisSchema = z.object({
  id: z.string().describe('A unique identifier for the clause.'),
  clauseText: z.string().describe('The text of the clause.'),
  riskAssessment: RiskAssessmentSchema.optional().describe(
    'The risk assessment for the clause, if any.'
  ),
});

const FlagRiskyClausesOutputSchema = z.array(ClauseAnalysisSchema);
export type FlagRiskyClausesOutput = z.infer<typeof FlagRiskyClausesOutputSchema>;

export async function flagRiskyClauses(input: FlagRiskyClausesInput) {
  return flagRiskyClausesFlow(input);
}

const flagRiskyClausesPrompt = ai.definePrompt({
  name: 'flagRiskyClausesPrompt',
  input: {schema: FlagRiskyClausesInputSchema},
  output: {schema: FlagRiskyClausesOutputSchema, json: true},
  prompt: `You are an expert legal analyst. Your first task is to act as an OCR/NER system. Read the following document text and split it into a structured list of every individual clause.

Once you have the list of clauses, your second task is to analyze each clause to identify if it is potentially unfavorable or poses a risk to the user.

For each clause you identify from the document:
1.  Generate a unique 'id' for the clause (e.g., "clause-1", "clause-2").
2.  Include the full, original text of the clause in the 'clauseText' field.
3.  If a clause is risky, add a 'riskAssessment' object with:
    - 'isRisky': true
    - 'riskScore': '🟢 Low', '🟡 Medium', or '🔴 High'.
    - 'rationale': A brief explanation of the risk.
4.  If a clause is standard and not risky, DO NOT include the 'riskAssessment' object.

Document Text:
{{{documentText}}}

IMPORTANT: Your response MUST be a single, valid JSON array containing objects for every clause in the document. Do not include any text or formatting before or after the JSON array.
`,
});

const flagRiskyClausesFlow = ai.defineFlow(
  {
    name: 'flagRiskyClausesFlow',
    inputSchema: FlagRiskyClausesInputSchema,
    outputSchema: FlagRiskyClausesOutputSchema,
  },
  async input => {
    const {output} = await flagRiskyClausesPrompt(input);
    return output!;
  }
);
