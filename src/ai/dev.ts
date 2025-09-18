import { config } from 'dotenv';
config();

import '@/ai/flows/flag-risky-clauses.ts';
import '@/ai/flows/answer-user-questions.ts';
import '@/ai/flows/simulate-scenarios.ts';
import '@/ai/flows/extract-text-from-document.ts';
import '@/ai/flows/summarize-clause';
import '@/ai/flows/compare-to-standards';
import '@/ai/flows/suggest-negotiations';
