'use server';

/**
 * @fileOverview Answers user questions about a document using AI.
 *
 * - answerUserQuestion - A function that answers a user's question about a document.
 * - AnswerUserQuestionInput - The input type for the answerUserQuestion function.
 * - AnswerUserQuestionOutput - The return type for the answerUserQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerUserQuestionInputSchema = z.object({
  documentText: z.string().describe('The text content of the document.'),
  userQuestion: z.string().describe('The user question about the document.'),
});
export type AnswerUserQuestionInput = z.infer<typeof AnswerUserQuestionInputSchema>;

const AnswerUserQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI-powered answer to the user question.'),
});
export type AnswerUserQuestionOutput = z.infer<typeof AnswerUserQuestionOutputSchema>;

export async function answerUserQuestion(input: AnswerUserQuestionInput): Promise<AnswerUserQuestionOutput> {
  return answerUserQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerUserQuestionPrompt',
  input: {schema: AnswerUserQuestionInputSchema},
  output: {schema: AnswerUserQuestionOutputSchema},
  prompt: `You are an AI assistant that answers questions about legal documents.

  Here is the document text:
  {{documentText}}

  Here is the user's question:
  {{userQuestion}}

  Answer the question as accurately and helpfully as possible, referencing specific clauses in the document where relevant.
  If you cannot answer the question based on the provided document, state that you cannot answer the question.  Do not use outside knowledge to answer the question.
  `,
});

const answerUserQuestionFlow = ai.defineFlow(
  {
    name: 'answerUserQuestionFlow',
    inputSchema: AnswerUserQuestionInputSchema,
    outputSchema: AnswerUserQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
