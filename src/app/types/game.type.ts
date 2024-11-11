import { Requirement } from './content.type';

export type GameStatus = 'loading' | 'not-started' | 'started' | 'finished';

export interface RequirementResult {
  requirement: Requirement;
  wasCorrect: boolean;
}
