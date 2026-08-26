export type RunnerValidation = {
  passed: boolean;
  feedback: string;
};

export type RunnerMessage = {
  type: string;
  requestId?: string;
  output?: string;
  status?: "success" | "error";
  chart?: string;
  validation?: RunnerValidation;
};

export type RunnerDataset = {
  fileName: string;
  content: string;
};
