type Dataset = {
  source: string;
  fileName: string;
};

type ChallengeBase = {
  successMessage: string;
  errorMessage: string;
  incompleteMessage?: string;
  successHref?: string;
  successLabel?: string;
  packages?: ("pandas" | "matplotlib")[];
  dataset?: Dataset;
};

export interface EqualsChallenge extends ChallengeBase {
  type: "equals";
  variable: string;
  expected: string | number | boolean;
}

export interface NumberChallenge extends ChallengeBase {
  type: "number";
  variable: string;
  expected: number;
  tolerance?: number;
}

export interface PythonChallenge extends ChallengeBase {
  type: "python";
  validator: string;
}

export type Challenge =
  | EqualsChallenge
  | NumberChallenge
  | PythonChallenge;
