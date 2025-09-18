// This file contains shared types used by both the frontend and the backend functions.

export type RiskScore = '🟢 Low' | '🟡 Medium' | '🔴 High';

export interface RiskAssessment {
  isRisky: boolean;
  riskScore: RiskScore;
  rationale: string;
}

export interface Clause {
  id: string;
  clauseText: string;
  riskAssessment?: RiskAssessment;
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

export interface CompareToStandardsInput {
  clause: string;
  documentType: string;
  jurisdiction?: string;
}
export interface CompareToStandardsOutput {
  comparison: string;
  isStandard: boolean;
  rationale: string;
}

export interface ExtractTextFromDocumentInput {
  fileDataUri: string;
}
export interface ExtractTextFromDocumentOutput {
  text: string;
}

export interface FlagRiskyClausesInput {
  documentText: string;
}
export type FlagRiskyClausesOutput = {
  id: string;
  clauseText: string;
  riskAssessment?: RiskAssessment;
}[];


export interface SimulateScenarioInput {
  documentText: string;
  scenario: string;
}
export interface SimulateScenarioOutput {
  outcome: string;
  riskLevel: RiskScore;
  rationale:string;
}

export interface SuggestNegotiationsInput {
  clauseText: string;
  documentType: string;
  userProfile: string;
  jurisdiction: string;
}
export interface SuggestNegotiationsOutput {
  negotiationSuggestions: string[];
  rationale: string;
}

export interface SummarizeClauseInput {
  clause: string;
}
export interface SummarizeClauseOutput {
  summary: string;
}
