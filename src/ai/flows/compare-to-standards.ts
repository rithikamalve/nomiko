'use server';

/**
 * @fileOverview A flow to compare a given clause to regional and industry standards.
 *
 * - compareToStandards - A function that compares a clause to industry standards.
 * - CompareToStandardsInput - The input type for the compareToStandards function.
 * - CompareToStandardsOutput - The return type for the compareToStandards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareToStandardsInputSchema = z.object({
  clause: z
    .string()
    .describe('The clause to compare to regional and industry standards.'),
  documentType: z
    .string()
    .describe(
      'The type of document the clause is from (e.g., rental agreement, loan agreement).'
    ),
  jurisdiction: z
    .string()
    .optional()
    .describe(
      'The jurisdiction (e.g., state, region) the document is subject to. Optional: If not specified, attempt to determine automatically.'
    ),
});
export type CompareToStandardsInput = z.infer<typeof CompareToStandardsInputSchema>;

const CompareToStandardsOutputSchema = z.object({
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
export type CompareToStandardsOutput = z.infer<typeof CompareToStandardsOutputSchema>;

export async function compareToStandards(input: CompareToStandardsInput): Promise<CompareToStandardsOutput> {
  return compareToStandardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareToStandardsPrompt',
  input: {schema: CompareToStandardsInputSchema},
  output: {schema: CompareToStandardsOutputSchema},
  prompt: `You are an expert legal analyst specializing in contract review.

You will compare the given clause to regional and industry standards for the specified document type and jurisdiction.  If no jurisdiction is specified, use your best judgement based on the content of the clause.

Clause: {{{clause}}}
Document Type: {{{documentType}}}
Jurisdiction: {{{jurisdiction}}}

Analyze the clause and provide a comparison to regional and industry standards, including whether it is considered standard or not, and a rationale for your analysis.

Consider factors such as deposit amounts, termination notice periods, liability limitations, and other relevant terms.
`,
});

const compareToStandardsFlow = ai.defineFlow(
  {
    name: 'compareToStandardsFlow',
    inputSchema: CompareToStandardsInputSchema,
    outputSchema: CompareToStandardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
