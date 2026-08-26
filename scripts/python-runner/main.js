import { captureChart } from "./chart.js";
import { appendOutput, send } from "./messages.js";
import { getPyodide, prepareRuntime } from "./runtime.js";
import { validateChallenge } from "./validation.js";

const MAX_CODE_LENGTH = 8_000;

function silenceRuntimeOutput(runtime) {
  runtime.setStdout({
    batched: () => { },
  });

  runtime.setStderr({
    batched: () => { },
  });
}

function captureRuntimeOutput(runtime, onOutput) {
  runtime.setStdout({
    batched: onOutput,
  });

  runtime.setStderr({
    batched: onOutput,
  });
}

window.addEventListener("message", async (event) => {
  if (event.source !== window.parent) {
    return;
  }

  const message = event.data;

  if (!message || typeof message.type !== "string") {
    return;
  }

  if (message.type === "python-parent-ready") {
    send({ type: "python-runner-ready" });
    return;
  }

  if (
    message.type !== "run-python" ||
    typeof message.requestId !== "string" ||
    typeof message.code !== "string"
  ) {
    return;
  }

  if (message.code.length > MAX_CODE_LENGTH) {
    send({
      type: "python-result",
      requestId: message.requestId,
      output: "El código supera el límite de 8.000 caracteres.",
      status: "error",
    });
    return;
  }

  let output = "";

  try {
    const runtime = await getPyodide();

    // La carga de pandas/matplotlib no debe aparecer en la consola del alumno.
    silenceRuntimeOutput(runtime);

    await prepareRuntime(
      runtime,
      message.challenge,
      message.dataset,
    );

    // Desde aquí solo se captura print(), errores y salida del código del alumno.
    captureRuntimeOutput(runtime, (text) => {
      output = appendOutput(output, text);
    });

    send({
      type: "python-execution-started",
      requestId: message.requestId,
    });

    const result = await runtime.runPythonAsync(message.code);

    if (result !== undefined) {
      output = appendOutput(output, String(result));
    }

    result?.destroy?.();

    const chart = await captureChart(runtime);
    const validation = await validateChallenge(runtime, message.challenge);

    send({
      type: "python-result",
      requestId: message.requestId,
      output: output || "El código se ejecutó sin salida.",
      status: "success",
      validation,
      chart,
    });
  } catch (error) {
    send({
      type: "python-result",
      requestId: message.requestId,
      output: appendOutput(output, String(error)),
      status: "error",
    });
  }
});

send({ type: "python-runner-ready" });
