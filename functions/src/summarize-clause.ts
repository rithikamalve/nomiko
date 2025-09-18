/**
 * @fileOverview Summarizes a clause of a document into plain language.
 */

import { ai } from './genkit';
import { z } from 'genkit';
import type {
  SummarizeClauseInput,
  SummarizeClauseOutput,
} from './lib/types';

const SummarizeClauseInputSchema = z.object({
  clause: z.string().describe('The clause of the document to summarize.'),
});

const SummarizeClauseOutputSchema = z.object({
  summary: z.string().describe('The plain language summary of the clause.'),
});

const summarizeClausePrompt = ai.definePrompt({
  name: 'summarizeClausePrompt',
  input: { schema: SummarizeClauseInputSchema },
  output: { schema: SummarizeClauseOutputSchema },
  prompt: `Summarize the following clause into plain language:

  {{{clause}}}`,
});

export const summarizeClauseFlow = ai.defineFlow(
  {
    name: 'summarizeClauseFlow',
    inputSchema: SummarizeClauseInputSchema,
    outputSchema: SummarizeClauseOutputSchema,
  },
  async (input: SummarizeClauseInput): Promise<SummarizeClauseOutput> => {
    const { output } = await summarizeClausePrompt(input);
    return output!;
  }
);
