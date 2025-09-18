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
  documentType: z.string(),
  userProfile: z.string(),
  jurisdiction: z.string(),
});
export type FlagRiskyClausesInput = z.infer<typeof FlagRiskyClausesInputSchema>;

const RiskAssessmentSchema = z.object({
  isRisky: z.boolean().describe('Whether the clause is potentially risky.'),
  riskScore: z
    .enum(['🟢 Low', '🟡 Medium', '🔴 High'])
    .optional()
    .describe(
      'The risk score of the clause: 🟢 Low (Standard), 🟡 Medium (Unfavorable but negotiable), 🔴 High (High risk / predatory).'
    ),
  rationale: z
    .string()
    .optional()
    .describe('The rationale for why the clause is considered risky.'),
});

const StandardsComparisonSchema = z.object({
  comparison: z
    .string()
    .describe('A comparison of the clause to regional and industry standards.'),
  isStandard: z
    .boolean()
    .describe(
      'Whether the clause is considered standard for the given document type and jurisdiction.'
    ),
  rationale: z
    .string()
    .describe(
      'The rationale for why the clause is considered standard or not.'
    ),
});

const NegotiationSuggestionSchema = z.object({
  negotiationSuggestions: z
    .array(z.string())
    .describe('A list of negotiation suggestions.'),
  rationale: z
    .string()
    .describe('The rationale behind the negotiation suggestions.'),
});

const ClauseAnalysisSchema = z.object({
  id: z.string().describe('A unique identifier for the clause.'),
  clauseText: z.string().describe('The text of the clause.'),
  summary: z.string().describe('A plain language summary of the clause.'),
  riskAssessment: RiskAssessmentSchema.describe(
    'The risk assessment for the clause.'
  ),
  standardsComparison: StandardsComparisonSchema.describe(
    'A comparison to industry and regional standards.'
  ),
  negotiationSuggestion: NegotiationSuggestionSchema.describe(
    'Tailored negotiation advice.'
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
  prompt: `You are an expert legal analyst AI. Your task is to perform a comprehensive analysis of a legal document.

First, act as an OCR/NER system. Read the document text and split it into a structured list of every individual clause.

For each clause you identify, perform a full analysis and provide the following information:
1.  A unique 'id' for the clause (e.g., "clause-1", "clause-2").
2.  The full, original text of the clause in the 'clauseText' field.
3.  A 'summary' of the clause in plain, easy-to-understand language.
4.  A 'riskAssessment' object.
    - If the clause is risky, this object must contain: 'isRisky': true, 'riskScore', and 'rationale'.
    - If a clause is standard and not risky, this object must contain: 'isRisky': false.
5.  A 'standardsComparison' object containing:
    - 'comparison': How the clause stacks up against regional and industry standards for the given document type.
    - 'isStandard': A boolean indicating if the clause is standard.
    - 'rationale': The reasoning for your standards assessment.
6.  A 'negotiationSuggestion' object containing:
    - 'negotiationSuggestions': An array of actionable talking points or alternative phrasing to negotiate more favorable terms, tailored to the user's role.
    - 'rationale': An explanation of why these suggestions are beneficial.

Context for Analysis:
- Document Type: {{{documentType}}}
- User's Role: {{{userProfile}}}
- Jurisdiction: {{{jurisdiction}}}

Document Text to Analyze:
{{{documentText}}}

IMPORTANT: Your response MUST be a single, valid JSON array containing objects for every clause in the document. Do not include any text, markdown, or formatting before or after the JSON array. Each object in the array must conform to the full schema defined.
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
