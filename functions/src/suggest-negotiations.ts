/**
 * @fileOverview A flow to provide tailored negotiation suggestions based on the document's clauses and user profile.
 */

import { ai } from './genkit';
import { z } from 'genkit';
import type {
  SuggestNegotiationsInput,
  SuggestNegotiationsOutput,
} from './lib/types';

const SuggestNegotiationsInputSchema = z.object({
  clauseText: z
    .string()
    .describe('The text of the contract clause to analyze.'),
  documentType: z
    .string()
    .describe(
      'The type of document (e.g., rental agreement, loan agreement).'
    ),
  userProfile: z
    .string()
    .describe(
      'The user profile (e.g., tenant, freelancer, small business owner).'
    ),
  jurisdiction: z
    .string()
    .describe('The relevant jurisdiction for the contract.'),
});

const SuggestNegotiationsOutputSchema = z.object({
  negotiationSuggestions: z
    .array(
      z
        .string()
        .describe(
          'A specific suggestion for negotiating a more favorable term.'
        )
    )
    .describe(
      'A list of negotiation suggestions tailored to the clause, document type, user profile, and jurisdiction.'
    ),
  rationale: z
    .string()
    .describe(
      'The rationale behind the negotiation suggestions, explaining why they are beneficial.'
    ),
});

const prompt = ai.definePrompt({
  name: 'suggestNegotiationsPrompt',
  input: { schema: SuggestNegotiationsInputSchema },
  output: { schema: SuggestNegotiationsOutputSchema },
  prompt: `You are an expert contract negotiator. Based on the contract clause, document type, user profile, and jurisdiction provided, suggest specific negotiation points and explain the rationale behind each suggestion.

  Clause Text: {{{clauseText}}}
  Document Type: {{{documentType}}}
  User Profile: {{{userProfile}}}
  Jurisdiction: {{{jurisdiction}}}

  Provide a list of negotiation suggestions and a rationale explaining why these suggestions are beneficial for the user.
  Format the output as a JSON object with "negotiationSuggestions" (an array of strings) and "rationale" (a string).
  `,
});

export const suggestNegotiationsFlow = ai.defineFlow(
  {
    name: 'suggestNegotiationsFlow',
    inputSchema: SuggestNegotiationsInputSchema,
    outputSchema: SuggestNegotiationsOutputSchema,
  },
  async (input: SuggestNegotiationsInput): Promise<SuggestNegotiationsOutput> => {
    const { output } = await prompt(input);
    return output!;
  }
);
