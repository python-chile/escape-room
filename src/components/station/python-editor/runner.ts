import { completeRoom } from "@/lib/progress";

import { celebrate } from "./celebrate";
import { getExecutionTime, MAX_LOADING_TIME } from "./constants";
import type { PythonEditorElements } from "./dom";
import type { RunnerDataset, RunnerMessage } from "./protocol";
import type { Challenge } from "./types";
import type { PythonEditorUi } from "./ui";
import { withBase } from "@/lib/paths";

type PythonRunnerOptions = {
  challenge?: Challenge;
  elements: PythonEditorElements;
  getCode: () => string;
  ui: PythonEditorUi;
};

export function createPythonRunner({
  challenge,
  elements,
  getCode,
  ui,
}: PythonRunnerOptions) {
  let isReady = false;
  let requestId = "";
  let timeoutId: number | undefined;

  function clearRunTimeout() {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  function announceParentIsReady() {
    elements.runner.contentWindow?.postMessage(
      { type: "python-parent-ready" },
      "*",
    );
  }

  function resetRunner() {
    clearRunTimeout();
    isReady = false;
    elements.runButton.disabled = true;
    elements.runner.src = `${withBase("/python-runner.html")}?instance=${Date.now()}`;
  }

  function finishRun(result: string, status: "success" | "error") {
    clearRunTimeout();
    ui.showResult(result, status);
  }

  function handleExecutionStarted(message: RunnerMessage) {
    if (message.requestId !== requestId) {
      return;
    }

    clearRunTimeout();

    const executionTime = getExecutionTime(challenge);

    ui.setRunning();

    timeoutId = window.setTimeout(() => {
      ui.showExecutionTimeout(executionTime);
      resetRunner();
    }, executionTime);
  }

  function handleResult(message: RunnerMessage) {
    if (message.requestId !== requestId) {
      return;
    }

    const status = message.status === "success" ? "success" : "error";

    finishRun(String(message.output), status);

    if (message.chart) {
      ui.showChart(message.chart);
    } else {
      ui.clearChart();
    }

    if (status !== "success" || !message.validation) {
      return;
    }

    ui.showFeedback(message.validation.feedback, message.validation.passed);

    if (message.validation.passed) {
      completeRoom();
      celebrate();
    }

    if (message.validation.passed && challenge?.successHref) {
      ui.showNextLink(
        challenge.successHref,
        challenge.successLabel || "Continuar",
      );
    } else {
      ui.hideNextLink();
    }
  }

  async function loadDataset(): Promise<RunnerDataset | undefined> {
    if (!challenge?.dataset) {
      return undefined;
    }

    const response = await fetch(challenge.dataset.source);

    if (!response.ok) {
      throw new Error("No fue posible cargar los datos de la misión.");
    }

    return {
      fileName: challenge.dataset.fileName,
      content: await response.text(),
    };
  }

  async function run() {
    if (!isReady || !elements.runner.contentWindow) {
      return;
    }

    requestId = crypto.randomUUID();

    ui.prepareRun();

    try {
      const dataset = await loadDataset();

      elements.runner.contentWindow.postMessage(
        {
          type: "run-python",
          requestId,
          code: getCode(),
          challenge,
          dataset,
        },
        "*",
      );

      timeoutId = window.setTimeout(() => {
        ui.showLoadingTimeout();
        resetRunner();
      }, MAX_LOADING_TIME);
    } catch (error) {
      ui.showUnexpectedError(error);
    }
  }

  elements.runner.addEventListener("load", announceParentIsReady);

  announceParentIsReady();

  window.addEventListener("message", (event) => {
    if (event.source !== elements.runner.contentWindow) {
      return;
    }

    const message = event.data as RunnerMessage;

    if (!message || typeof message.type !== "string") {
      return;
    }

    if (message.type === "python-runner-ready") {
      if (!isReady) {
        isReady = true;
        ui.setReady();
      }

      return;
    }

    if (message.type === "python-execution-started") {
      handleExecutionStarted(message);
      return;
    }

    if (message.type === "python-result") {
      handleResult(message);
    }
  });

  return {
    isReady: () => isReady,
    run,
  };
}
