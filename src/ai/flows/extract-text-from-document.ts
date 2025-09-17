'use server';

/**
 * @fileOverview Extracts text from a document (PDF or DOCX).
 *
 * - extractTextFromDocument - A function that extracts text from a document file.
 * - ExtractTextFromDocumentInput - The input type for the extractTextFromDocument function.
 * - ExtractTextFromDocumentOutput - The return type for the extractTextFromDocumentOutput function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import mammoth from 'mammoth';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const ExtractTextFromDocumentInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The file content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromDocumentInput = z.infer<typeof ExtractTextFromDocumentInputSchema>;

const ExtractTextFromDocumentOutputSchema = z.object({
  text: z.string().describe('The extracted text content of the document.'),
});
export type ExtractTextFromDocumentOutput = z.infer<typeof ExtractTextFromDocumentOutputSchema>;

export async function extractTextFromDocument(
  input: ExtractTextFromDocumentInput
): Promise<ExtractTextFromDocumentOutput> {
  return extractTextFromDocumentFlow(input);
}

const extractTextFromDocumentFlow = ai.defineFlow(
  {
    name: 'extractTextFromDocumentFlow',
    inputSchema: ExtractTextFromDocumentInputSchema,
    outputSchema: ExtractTextFromDocumentOutputSchema,
  },
  async ({ fileDataUri }) => {
    const
      mimeType = fileDataUri.substring(
        fileDataUri.indexOf(':') + 1,
        fileDataUri.indexOf(';')
      );
    const base64Data = fileDataUri.substring(fileDataUri.indexOf(',') + 1);
    const fileBuffer = Buffer.from(base64Data, 'base64');

    let text = '';

    if (mimeType === 'application/pdf') {
      const data = await pdf(fileBuffer);
      text = data.text;
    } else if (
      mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    return { text };
  }
);
