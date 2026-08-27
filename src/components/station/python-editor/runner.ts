import { withBase } from "@/lib/paths";
import { completeRoom } from "@/lib/progress";

import { celebrate } from "./celebrate";
import { getExecutionTime, MAX_LOADING_TIME } from "./constants";
import type { PythonEditorElements } from "./dom";
import {
  isRunnerMessage,
  type ParentRunnerMessage,
  type RunnerDataset,
  type RunnerMessage,
} from "./protocol";
import type { Challenge } from "./types";
import type { PythonEditorUi } from "./ui";

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
  let activeRequestId: string | undefined;
  let timeoutId: number | undefined;

  function clearRunTimeout() {
    if (timeoutId === undefined) {
      return;
    }

    window.clearTimeout(timeoutId);
    timeoutId = undefined;
  }

  function postMessage(message: ParentRunnerMessage) {
    elements.runner.contentWindow?.postMessage(message, "*");
  }

  function announceParentIsReady() {
    postMessage({ type: "python-parent-ready" });
  }

  function resetRunner() {
    clearRunTimeout();
    activeRequestId = undefined;
    isReady = false;
    elements.runButton.disabled = true;
    elements.runner.src = `${withBase(
      "/python-runner.html",
    )}?instance=${Date.now()}`;
  }

  function finishRun(result: string, status: "success" | "error") {
    clearRunTimeout();
    activeRequestId = undefined;
    ui.showResult(result, status);
  }

  function handleExecutionStarted(
    message: Extract<RunnerMessage, { type: "python-execution-started" }>,
  ) {
    if (message.requestId !== activeRequestId) {
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

  function handleResult(
    message: Extract<RunnerMessage, { type: "python-result" }>,
  ) {
    if (message.requestId !== activeRequestId) {
      return;
    }

    finishRun(message.output, message.status);

    if (message.chart) {
      ui.showChart(message.chart);
    } else {
      ui.clearChart();
    }

    if (message.status !== "success" || !message.validation) {
      return;
    }

    const { feedback, passed } = message.validation;

    ui.showFeedback(feedback, passed);

    if (passed) {
      completeRoom();
      celebrate();
    }

    if (passed && challenge?.successHref) {
      ui.showNextLink(
        challenge.successHref,
        challenge.successLabel ?? "Continuar",
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
    if (!isReady || activeRequestId || !elements.runner.contentWindow) {
      return;
    }

    const requestId = crypto.randomUUID();

    activeRequestId = requestId;
    ui.prepareRun();

    timeoutId = window.setTimeout(() => {
      ui.showLoadingTimeout();
      resetRunner();
    }, MAX_LOADING_TIME);

    try {
      const dataset = await loadDataset();

      if (
        activeRequestId !== requestId ||
        !isReady ||
        !elements.runner.contentWindow
      ) {
        return;
      }

      postMessage({
        type: "run-python",
        requestId,
        code: getCode(),
        challenge,
        dataset,
      });
    } catch (error) {
      if (activeRequestId !== requestId) {
        return;
      }

      clearRunTimeout();
      activeRequestId = undefined;
      ui.showUnexpectedError(error);
    }
  }

  elements.runner.addEventListener("load", announceParentIsReady);

  window.addEventListener("message", (event) => {
    if (
      event.source !== elements.runner.contentWindow ||
      !isRunnerMessage(event.data)
    ) {
      return;
    }

    const message = event.data;

    switch (message.type) {
      case "python-runner-ready":
        if (!isReady) {
          isReady = true;
          ui.setReady();
        }
        break;

      case "python-execution-started":
        handleExecutionStarted(message);
        break;

      case "python-result":
        handleResult(message);
        break;
    }
  });

  announceParentIsReady();

  return {
    isReady: () => isReady,
    run,
  };
}
