import { config } from 'dotenv';
config();

import '@/ai/flows/flag-risky-clauses.ts';
import '@/ai/flows/answer-user-questions.ts';
import '@/ai/flows/simulate-scenarios.ts';
import '@/ai/flows/compare-to-standards.ts';
import '@/ai/flows/suggest-negotiations.ts';
import '@/ai/flows/summarize-clause.ts';