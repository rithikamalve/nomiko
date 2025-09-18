/**
 * @fileOverview Answers user questions about a document using AI.
 */

import { ai } from './genkit';
import { z } from 'genkit';
import type {
  AnswerUserQuestionInput,
  AnswerUserQuestionOutput,
} from './lib/types';

const AnswerUserQuestionInputSchema = z.object({
  documentText: z.string().describe('The text content of the document.'),
  userQuestion: z.string().describe('The user question about the document.'),
});

const AnswerUserQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI-powered answer to the user question.'),
});

const prompt = ai.definePrompt({
  name: 'answerUserQuestionPrompt',
  input: { schema: AnswerUserQuestionInputSchema },
  output: { schema: AnswerUserQuestionOutputSchema },
  prompt: `You are an AI assistant that answers questions about legal documents.

  Here is the document text:
  {{documentText}}

  Here is the user's question:
  {{userQuestion}}

  Answer the question as accurately and helpfully as possible, referencing specific clauses in the document where relevant.
  If you cannot answer the question based on the provided document, state that you cannot answer the question.  Do not use outside knowledge to answer the question.
  `,
});

export const answerUserQuestionFlow = ai.defineFlow(
  {
    name: 'answerUserQuestionFlow',
    inputSchema: AnswerUserQuestionInputSchema,
    outputSchema: AnswerUserQuestionOutputSchema,
  },
  async (input: AnswerUserQuestionInput): Promise<AnswerUserQuestionOutput> => {
    const { output } = await prompt(input);
    return output!;
  }
);
