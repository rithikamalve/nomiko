// This file contains shared types used by both the frontend and the backend functions.

export type RiskScore = '🟢 Low' | '🟡 Medium' | '🔴 High';

export interface RiskAssessment {
  isRisky: boolean;
  riskScore: RiskScore;
  rationale: string;
}

export interface StandardsComparison {
  comparison: string;
  isStandard: boolean;
  rationale: string;
}

export interface NegotiationSuggestion {
  negotiationSuggestions: string[];
  rationale: string;
}

export interface Clause {
  id: string;
  clauseText: string;
  summary: string;
  riskAssessment?: RiskAssessment;
  standardsComparison: StandardsComparison;
  negotiationSuggestion: NegotiationSuggestion;
}

export type DocumentDetails = {
  text: string;
  type: string;
  profile: string;
  jurisdiction: string;
  file: File;
};


// Input/Output types for AI Flows

export interface AnswerUserQuestionInput {
  documentText: string;
  userQuestion: string;
}
export interface AnswerUserQuestionOutput {
  answer: string;
}

export interface ExtractTextFromDocumentInput {
  fileDataUri: string;
}
export interface ExtractTextFromDocumentOutput {
  text: string;
}

export interface FlagRiskyClausesInput {
  documentText: string;
  documentType: string;
  userProfile: string;
  jurisdiction: string;
}
export type FlagRiskyClausesOutput = Clause[];


export interface SimulateScenarioInput {
  documentText: string;
  scenario: string;
}
export interface SimulateScenarioOutput {
  outcome: string;
  riskLevel: RiskScore;
  rationale:string;
}
