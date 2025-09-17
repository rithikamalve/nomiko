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
};
