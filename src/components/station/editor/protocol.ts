import type { Challenge } from "./types";

export type RunnerValidation = {
  passed: boolean;
  feedback: string;
};

export type RunnerDataset = {
  fileName: string;
  content: string;
};

export type RunnerMessage =
  | {
      type: "python-runner-ready";
    }
  | {
      type: "python-execution-started";
      requestId: string;
    }
  | {
      type: "python-result";
      requestId: string;
      output: string;
      status: "success" | "error";
      chart?: string;
      validation?: RunnerValidation;
    };

export type ParentRunnerMessage =
  | {
      type: "python-parent-ready";
    }
  | {
      type: "run-python";
      requestId: string;
      code: string;
      challenge?: Challenge;
      dataset?: RunnerDataset;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidation(value: unknown): value is RunnerValidation {
  return (
    isRecord(value) &&
    typeof value.passed === "boolean" &&
    typeof value.feedback === "string"
  );
}

export function isRunnerMessage(value: unknown): value is RunnerMessage {
  if (!isRecord(value) || typeof value.type !== "string") {
    return false;
  }

  if (value.type === "python-runner-ready") {
    return true;
  }

  if (
    value.type === "python-execution-started" &&
    typeof value.requestId === "string"
  ) {
    return true;
  }

  return (
    value.type === "python-result" &&
    typeof value.requestId === "string" &&
    typeof value.output === "string" &&
    (value.status === "success" || value.status === "error") &&
    (value.chart === undefined || typeof value.chart === "string") &&
    (value.validation === undefined || isValidation(value.validation))
  );
}
