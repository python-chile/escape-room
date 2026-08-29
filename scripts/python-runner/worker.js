import { captureChart } from "./chart.js";
import { appendOutput, send } from "./messages.js";
import {
  createExecutionNamespace,
  getPyodide,
  prepareRuntime,
} from "./runtime.js";
import { validateChallenge } from "./validation.js";

const PYODIDE_SCRIPT_URL =
  "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

const MAX_CODE_LENGTH = 8_000;

const CODE_LENGTH_ERROR = "El código supera el límite de 8.000 caracteres.";

const EMPTY_OUTPUT_MESSAGE = "El código se ejecutó sin salida.";

const BUSY_ERROR = "El entorno ya está ejecutando otro código.";

let activeRequestId;

globalThis.importScripts(PYODIDE_SCRIPT_URL);

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
    typeof message === "object" &&
    message !== null &&
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

async function executeStudentCode(runtime, namespace, code) {
  const result = await runtime.runPythonAsync(code, {
    globals: namespace,
  });

  try {
    return result === undefined ? undefined : String(result);
  } finally {
    result?.destroy?.();
  }
}

async function handleRunRequest(message) {
  const { requestId, code, challenge, dataset } = message;

  if (activeRequestId) {
    sendExecutionError(requestId, BUSY_ERROR);

    return;
  }

  if (code.length > MAX_CODE_LENGTH) {
    sendExecutionError(requestId, CODE_LENGTH_ERROR);

    return;
  }

  activeRequestId = requestId;

  let output = "";

  const appendRuntimeOutput = (text) => {
    output = appendOutput(output, text);
  };

  try {
    const runtime = await getPyodide();

    silenceRuntimeOutput(runtime);

    await prepareRuntime(runtime, challenge, dataset);

    captureRuntimeOutput(runtime, appendRuntimeOutput);

    sendExecutionStarted(requestId);

    const namespace = createExecutionNamespace(runtime);

    try {
      const result = await executeStudentCode(runtime, namespace, code);

      if (result !== undefined) {
        appendRuntimeOutput(result);
      }

      const chart = await captureChart(runtime, namespace);

      const validation = await validateChallenge(runtime, namespace, challenge);

      sendExecutionSuccess({
        requestId,
        output,
        validation,
        chart,
      });
    } finally {
      namespace.destroy?.();
    }
  } catch (error) {
    sendExecutionError(requestId, appendOutput(output, String(error)));
  } finally {
    activeRequestId = undefined;
  }
}

function handleMessage(event) {
  if (!isRunPythonMessage(event.data)) {
    return;
  }

  void handleRunRequest(event.data);
}

globalThis.addEventListener("message", handleMessage);

send({
  type: "python-runner-ready",
});
