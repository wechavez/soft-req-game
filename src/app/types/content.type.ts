export interface RequirementsContentResponse {
  requirements: Requirement[];
}

export interface Requirement {
  no: number;
  text: string;
  isValid: boolean;
  feedback: string;
}
