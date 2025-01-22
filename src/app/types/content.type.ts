export interface Requirement {
  id: number;
  text: string;
  isValid: boolean;
  feedback: string;
}

export type Result = 'correct' | 'incorrect' | 'not-classified';

export interface RequirementAttempt {
  id: number;
  result: Result;
}

export interface RequirementAttemptResult {
  id: number;
  requirementId: number;
  text: string;
  feedback: string;
  isValid: boolean;
  result: Result;
}
