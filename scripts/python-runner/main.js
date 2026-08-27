/* global window */
import { captureChart } from "./chart.js";
import { appendOutput, send } from "./messages.js";
import { getPyodide, prepareRuntime } from "./runtime.js";
import { validateChallenge } from "./validation.js";

const MAX_CODE_LENGTH = 8_000;

const CODE_LENGTH_ERROR = "El código supera el límite de 8.000 caracteres.";

const EMPTY_OUTPUT_MESSAGE = "El código se ejecutó sin salida.";

function configureRuntimeOutput(runtime, onOutput) {
  runtime.setStdout({
    batched: onOutput,
  });

  runtime.setStderr({
    batched: onOutput,
  });
}

function silenceRuntimeOutput(runtime) {
  configureRuntimeOutput(runtime, () => {});
}

function captureRuntimeOutput(runtime, onOutput) {
  configureRuntimeOutput(runtime, onOutput);
}

function isRunPythonMessage(message) {
  return (
    message.type === "run-python" &&
    typeof message.requestId === "string" &&
    typeof message.code === "string"
  );
}

function sendExecutionStarted(requestId) {
  send({
    type: "python-execution-started",
    requestId,
  });
}

function sendExecutionError(requestId, output) {
  send({
    type: "python-result",
    requestId,
    output,
    status: "error",
  });
}

function sendExecutionSuccess({ requestId, output, validation, chart }) {
  send({
    type: "python-result",
    requestId,
    output: output || EMPTY_OUTPUT_MESSAGE,
    status: "success",
    validation,
    chart,
  });
}

async function executeStudentCode(runtime, code) {
  const result = await runtime.runPythonAsync(code);

  try {
    return result === undefined ? undefined : String(result);
  } finally {
    result?.destroy?.();
  }
}

async function handleRunRequest(message) {
  const { requestId, code, challenge, dataset } = message;

  if (code.length > MAX_CODE_LENGTH) {
    sendExecutionError(requestId, CODE_LENGTH_ERROR);

    return;
  }

  let output = "";

  const appendRuntimeOutput = (text) => {
    output = appendOutput(output, text);
  };

  try {
    const runtime = await getPyodide();

    // La preparación de paquetes y datos no debe
    // aparecer en la consola del estudiante.
    silenceRuntimeOutput(runtime);

    await prepareRuntime(runtime, challenge, dataset);

    // Desde este punto se captura la salida producida
    // durante la ejecución y validación del desafío.
    captureRuntimeOutput(runtime, appendRuntimeOutput);

    sendExecutionStarted(requestId);

    const result = await executeStudentCode(runtime, code);

    if (result !== undefined) {
      appendRuntimeOutput(result);
    }

    const chart = await captureChart(runtime);

    const validation = await validateChallenge(runtime, challenge);

    sendExecutionSuccess({
      requestId,
      output,
      validation,
      chart,
    });
  } catch (error) {
    sendExecutionError(requestId, appendOutput(output, String(error)));
  }
}

async function handleParentMessage(event) {
  if (event.source !== window.parent) {
    return;
  }

  const message = event.data;

  if (!message || typeof message.type !== "string") {
    return;
  }

  if (message.type === "python-parent-ready") {
    send({
      type: "python-runner-ready",
    });

    return;
  }

  if (isRunPythonMessage(message)) {
    await handleRunRequest(message);
  }
}

window.addEventListener("message", handleParentMessage);

send({
  type: "python-runner-ready",
});
