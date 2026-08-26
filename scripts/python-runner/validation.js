import { readVariable } from "./runtime.js";

export async function validateChallenge(runtime, challenge) {
  if (!challenge) {
    return null;
  }

  if (challenge.type === "python") {
    runtime.globals.set("__pyschool_validated", false);
    runtime.globals.set("__pyschool_feedback", "");

    await runtime.runPythonAsync(challenge.validator);

    const validationResult = readVariable(
      runtime,
      "__pyschool_validated",
    );

    const feedbackResult = readVariable(
      runtime,
      "__pyschool_feedback",
    );

    const passed = validationResult.value === true;
    const feedback = String(feedbackResult.value || "");

    return {
      passed,
      feedback:
        feedback ||
        (passed ? challenge.successMessage : challenge.errorMessage),
    };
  }

  const result = readVariable(runtime, challenge.variable);

  if (!result.exists || result.value === null) {
    return {
      passed: false,
      feedback:
        challenge.incompleteMessage ||
        `Define la variable "${challenge.variable}" e inténtalo nuevamente.`,
    };
  }

  if (challenge.type === "equals") {
    const passed = result.value === challenge.expected;

    return {
      passed,
      feedback: passed
        ? challenge.successMessage
        : challenge.errorMessage,
    };
  }

  if (challenge.type === "number") {
    const isNumber =
      typeof result.value === "number" &&
      Number.isFinite(result.value);

    const tolerance = challenge.tolerance ?? 0.000001;
    const passed =
      isNumber &&
      Math.abs(result.value - challenge.expected) < tolerance;

    return {
      passed,
      feedback: passed
        ? challenge.successMessage
        : challenge.errorMessage,
    };
  }

  return null;
}
