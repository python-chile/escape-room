import type { Challenge } from "./types";

export const MAX_EXECUTION_TIME = 3_000;

export const MAX_DATA_EXECUTION_TIME = 10_000;

export const MAX_CHART_EXECUTION_TIME = 15_000;

export const MAX_LOADING_TIME = 90_000;

export const MAX_DATASET_SIZE_BYTES = 2_000_000;

export function getExecutionTime(challenge?: Challenge): number {
  if (challenge?.packages?.includes("matplotlib")) {
    return MAX_CHART_EXECUTION_TIME;
  }

  if (challenge?.packages?.includes("pandas")) {
    return MAX_DATA_EXECUTION_TIME;
  }

  return MAX_EXECUTION_TIME;
}
