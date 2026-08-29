import { readVariable } from "./runtime.js";

const VALIDATED_VARIABLE = "__pyschool_validated";
const FEEDBACK_VARIABLE = "__pyschool_feedback";

const DEFAULT_TOLERANCE = 0.000001;

function createValidationResult(passed, challenge) {
  return {
    passed,
    feedback: passed ? challenge.successMessage : challenge.errorMessage,
  };
}

function createIncompleteResult(challenge) {
  return {
    passed: false,
    feedback:
      challenge.incompleteMessage ||
      `Define la variable "${challenge.variable}" e inténtalo nuevamente.`,
  };
}

async function validatePythonChallenge(runtime, namespace, challenge) {
  namespace.set(VALIDATED_VARIABLE, false);
  namespace.set(FEEDBACK_VARIABLE, "");

  try {
    await runtime.runPythonAsync(challenge.validator, {
      globals: namespace,
    });

    const validationResult = readVariable(namespace, VALIDATED_VARIABLE);

    const feedbackResult = readVariable(namespace, FEEDBACK_VARIABLE);

    const passed = validationResult.value === true;
    const feedback = String(feedbackResult.value || "");

    return {
      passed,
      feedback:
        feedback ||
        (passed ? challenge.successMessage : challenge.errorMessage),
    };
  } finally {
    namespace.delete(VALIDATED_VARIABLE);
    namespace.delete(FEEDBACK_VARIABLE);
  }
}

function validateEqualsChallenge(result, challenge) {
  const passed = result.value === challenge.expected;

  return createValidationResult(passed, challenge);
}

function validateNumberChallenge(result, challenge) {
  const value = result.value;
  const isNumber = typeof value === "number" && Number.isFinite(value);
  const tolerance = challenge.tolerance ?? DEFAULT_TOLERANCE;
  const passed = isNumber && Math.abs(value - challenge.expected) < tolerance;

  return createValidationResult(passed, challenge);
}

export async function validateChallenge(runtime, namespace, challenge) {
  if (!challenge) {
    return null;
  }

  if (challenge.type === "python") {
    return validatePythonChallenge(runtime, namespace, challenge);
  }

  const result = readVariable(namespace, challenge.variable);

  if (!result.exists || result.value === null) {
    return createIncompleteResult(challenge);
  }

  switch (challenge.type) {
    case "equals":
      return validateEqualsChallenge(result, challenge);

    case "number":
      return validateNumberChallenge(result, challenge);

    default:
      return null;
  }
}
