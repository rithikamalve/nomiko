/**
 * @fileOverview Initializes and exports all AI flows as callable Firebase Functions.
 */

import { initializeApp } from 'firebase-admin/app';
import { onFlow } from '@genkit-ai/firebase/functions';
import { defineSecret } from 'firebase-functions/v2/params';
import { setGlobalOptions } from 'firebase-functions/v2';
import * as answerUserQuestions from './answer-user-questions';
import * as compareToStandards from './compare-to-standards';
import * as extractTextFromDocument from './extract-text-from-document';
import * as flagRiskyClauses from './flag-risky-clauses';
import * as simulateScenarios from './simulate-scenarios';
import * as suggestNegotiations from './suggest-negotiations';
import * as summarizeClause from './summarize-clause';

// Initialize Firebase
initializeApp();

// It's recommended to set your Gemini API Key as a secret.
// You can do this by running the following command:
// firebase functions:secrets:set GEMINI_API_KEY
const geminiApiKey = defineSecret('GEMINI_API_KEY');

// Set global options for all functions
setGlobalOptions({
  region: 'us-central1',
  secrets: [geminiApiKey],
});

// Export all flows as onFlow functions
export const answerUserQuestionFlow = onFlow(
  {
    name: 'answerUserQuestionFlow',
    ...answerUserQuestions.answerUserQuestionFlow,
  },
  answerUserQuestions.answerUserQuestionFlow.fn
);

export const compareToStandardsFlow = onFlow(
  {
    name: 'compareToStandardsFlow',
    ...compareToStandards.compareToStandardsFlow,
  },
  compareToStandards.compareToStandardsFlow.fn
);

export const extractTextFromDocumentFlow = onFlow(
  {
    name: 'extractTextFromDocumentFlow',
    ...extractTextFromDocument.extractTextFromDocumentFlow,
  },
  extractTextFromDocument.extractTextFromDocumentFlow.fn
);

export const flagRiskyClausesFlow = onFlow(
  {
    name: 'flagRiskyClausesFlow',
    ...flagRiskyClauses.flagRiskyClausesFlow,
  },
  flagRiskyClauses.flagRiskyClausesFlow.fn
);

export const simulateScenarioFlow = onFlow(
  {
    name: 'simulateScenarioFlow',
    ...simulateScenarios.simulateScenarioFlow,
  },
  simulateScenarios.simulateScenarioFlow.fn
);

export const suggestNegotiationsFlow = onFlow(
  {
    name: 'suggestNegotiationsFlow',
    ...suggestNegotiations.suggestNegotiationsFlow,
  },
  suggestNegotiations.suggestNegotiationsFlow.fn
);

export const summarizeClauseFlow = onFlow(
  {
    name: 'summarizeClauseFlow',
    ...summarizeClause.summarizeClauseFlow,
  },
  summarizeClause.summarizeClauseFlow.fn
);
