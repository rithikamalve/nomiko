import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI({
      // The API key is provided by the GEMINI_API_KEY secret.
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
