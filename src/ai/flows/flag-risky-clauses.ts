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
  documentText: z.string().describe('The complete text of the document to analyze.'),
});
export type FlagRiskyClausesInput = z.infer<typeof FlagRiskyClausesInputSchema>;

const RiskAssessmentSchema = z.object({
  isRisky: z.boolean().describe('Whether the clause is potentially risky.'),
  riskScore: z
    .enum(['🟢 Low', '🟡 Medium', '🔴 High'])
    .describe("The risk score of the clause: 🟢 Low (Standard), 🟡 Medium (Unfavorable but negotiable), 🔴 High (High risk / predatory)."),
  rationale: z.string().describe('The rationale for why the clause is considered risky.'),
});

const ClauseAnalysisSchema = z.object({
  clauseText: z.string().describe('The text of the clause.'),
  riskAssessment: RiskAssessmentSchema.optional().describe('The risk assessment for the clause, if any.'),
});

const FlagRiskyClausesOutputSchema = z.array(ClauseAnalysisSchema);
export type FlagRiskyClausesOutput = z.infer<typeof FlagRiskyClausesOutputSchema>;

export async function flagRiskyClauses(input: FlagRiskyClausesInput) {
  return flagRiskyClausesFlow(input);
}

const flagRiskyClausesPrompt = ai.definePrompt({
  name: 'flagRiskyClausesPrompt',
  input: {schema: FlagRiskyClausesInputSchema},
  output: {schema: ClauseAnalysisSchema, json: true},
  prompt: `You are an expert legal analyst specializing in identifying potentially risky clauses in various types of documents (e.g., rental agreements, loan agreements, service agreements, terms of service).  Review the document text provided and identify any clauses that could be unfavorable or pose a risk to the user. For each potentially risky clause, provide a risk score (🟢 Low, 🟡 Medium, or 🔴 High) and a rationale for why the clause is considered risky. If a clause isn't risky, do not provide any assessment for it.

Document Text:
{{{documentText}}}

Output the analysis as a JSON object for each clause from the document. Include the original clause text and, if applicable, the risk assessment (isRisky, riskScore, rationale). If the clause is not risky, do not include a risk assessment.

Example:
{
  "clauseText": "Late payment fee of $50 if rent is not received by the 5th of the month.",
  "riskAssessment": {
    "isRisky": true,
    "riskScore": "🟡 Medium",
    "rationale": "Late fees should be reasonable and in line with local regulations. $50 may be considered high in some jurisdictions.",
  },
}
`,
});

const flagRiskyClausesFlow = ai.defineFlow(
  {
    name: 'flagRiskyClausesFlow',
    inputSchema: FlagRiskyClausesInputSchema,
    outputSchema: ClauseAnalysisSchema,
    stream: true,
  },
  async input => {
    const {stream} = await flagRiskyClausesPrompt(input);
    return stream;
  }
);
