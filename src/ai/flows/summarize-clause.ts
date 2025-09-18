'use server';

/**
 * @fileOverview Summarizes a clause of a document into plain language.
 *
 * - summarizeClause - A function that summarizes a single clause of a document.
 * - SummarizeClauseInput - The input type for the summarizeClause function.
 * - SummarizeClauseOutput - The return type for the summarizeClause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeClauseInputSchema = z.object({
  clause: z.string().describe('The clause of the document to summarize.'),
});
export type SummarizeClauseInput = z.infer<typeof SummarizeClauseInputSchema>;

const SummarizeClauseOutputSchema = z.object({
  summary: z.string().describe('The plain language summary of the clause.'),
});
export type SummarizeClauseOutput = z.infer<typeof SummarizeClauseOutputSchema>;

export async function summarizeClause(input: SummarizeClauseInput): Promise<SummarizeClauseOutput> {
  return summarizeClauseFlow(input);
}

const summarizeClausePrompt = ai.definePrompt({
  name: 'summarizeClausePrompt',
  input: {schema: SummarizeClauseInputSchema},
  output: {schema: SummarizeClauseOutputSchema},
  prompt: `Summarize the following clause into plain language:

  {{{clause}}}`,
});

const summarizeClauseFlow = ai.defineFlow(
  {
    name: 'summarizeClauseFlow',
    inputSchema: SummarizeClauseInputSchema,
    outputSchema: SummarizeClauseOutputSchema,
  },
  async input => {
    const {output} = await summarizeClausePrompt(input);
    return output!;
  }
);
