export type PythonPackage = "pandas" | "matplotlib";

export type ChallengeDataset = {
  readonly source: string;
  readonly fileName: string;
};

export type ChallengeBase = {
  readonly successMessage: string;
  readonly errorMessage: string;
  readonly incompleteMessage?: string;
  readonly successHref?: string;
  readonly successLabel?: string;
  readonly packages?: readonly PythonPackage[];
  readonly dataset?: ChallengeDataset;
};

export type EqualsChallenge = ChallengeBase & {
  readonly type: "equals";
  readonly variable: string;
  readonly expected: string | number | boolean;
};

export type NumberChallenge = ChallengeBase & {
  readonly type: "number";
  readonly variable: string;
  readonly expected: number;
  readonly tolerance?: number;
};

export type PythonChallenge = ChallengeBase & {
  readonly type: "python";
  readonly validator: string;
};

export type Challenge = EqualsChallenge | NumberChallenge | PythonChallenge;
