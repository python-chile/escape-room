import type { PythonEditorElements } from "./dom";
import { getPythonErrorHelp } from "./python-error-help";
import { selectPythonTerminalTab } from "./terminal";

type ExecutionStatus =
  "loading" | "ready" | "running" | "success" | "error" | "stopped";

type ResultStatus = "success" | "error";

type StatusConfiguration = {
  label: string;
  dotClass: string;
};

const STATUS_DOT_CLASSES = [
  "bg-brand",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-python-red",
  "bg-muted",
];

const STATUS_CONFIG: Record<ExecutionStatus, StatusConfiguration> = {
  loading: {
    label: "Preparando entorno…",
    dotClass: "bg-brand",
  },

  ready: {
    label: "Listo para ejecutar",
    dotClass: "bg-emerald-500",
  },

  running: {
    label: "Ejecutando…",
    dotClass: "bg-amber-500",
  },

  success: {
    label: "Ejecución terminada",
    dotClass: "bg-emerald-500",
  },

  error: {
    label: "Error",
    dotClass: "bg-python-red",
  },

  stopped: {
    label: "Ejecución detenida",
    dotClass: "bg-muted",
  },
};

export type PythonEditorUi = {
  addLog: (message: string) => void;
  clearChart: () => void;
  clearTerminal: () => void;
  hideNextLink: () => void;
  prepareRun: () => void;
  resetCode: (isReady: boolean) => void;
  setErrorHelpEnabled: (enabled: boolean) => void;
  setReady: () => void;
  setRunning: () => void;
  showChart: (chart: string) => void;
  showExecutionStopped: () => void;
  showExecutionTimeout: (executionTime: number) => void;
  showFeedback: (message: string, passed: boolean) => void;
  showLoadingTimeout: () => void;
  showNextLink: (href: string, label: string) => void;
  showResult: (result: string, status: ResultStatus) => void;
  showUnexpectedError: (error: unknown) => void;
};

export function createPythonEditorUi(
  elements: PythonEditorElements,
): PythonEditorUi {
  let errorHelpEnabled = false;
  let lastResult = "";
  let lastStatus: ResultStatus | undefined;

  function addLog(message: string): void {
    const time = new Date().toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const entry = `[${time}] ${message}`;

    elements.logs.textContent = elements.logs.textContent
      ? `${elements.logs.textContent}\n${entry}`
      : entry;
  }

  function setStatus(status: ExecutionStatus): void {
    const configuration = STATUS_CONFIG[status];

    elements.statusText.textContent = configuration.label;

    elements.statusDot.classList.remove(...STATUS_DOT_CLASSES);

    elements.statusDot.classList.add(configuration.dotClass);
  }

  function setRunButtonRunning(running: boolean): void {
    elements.runButton.dataset.running = String(running);

    elements.runIdleIcon.hidden = running;
    elements.runIdleLabel.hidden = running;

    elements.runStopIcon.hidden = !running;
    elements.runStopLabel.hidden = !running;

    const label = running ? "Detener ejecución" : "Ejecutar código";

    elements.runButton.setAttribute("aria-label", label);

    elements.runButton.title = label;
  }

  function setRunButtonAvailable(available: boolean): void {
    elements.runButton.disabled = !available;
  }

  function clearCelebration(): void {
    delete document.documentElement.dataset.pyschoolCelebrated;
  }

  function hideErrorHelp(): void {
    elements.errorHelp.hidden = true;
    elements.errorHelpName.textContent = "";
    elements.errorHelpExplanation.textContent = "";
    elements.errorHelpSuggestion.textContent = "";
  }

  function updateErrorHelp(): void {
    if (!errorHelpEnabled || lastStatus !== "error") {
      hideErrorHelp();

      return;
    }

    const help = getPythonErrorHelp(lastResult);

    if (!help) {
      hideErrorHelp();

      return;
    }

    elements.errorHelpName.textContent = help.errorName;

    elements.errorHelpExplanation.textContent = help.explanation;

    elements.errorHelpSuggestion.textContent = help.suggestion;

    elements.errorHelp.hidden = false;
  }

  function clearChart(): void {
    if (elements.chartDialog.open) {
      elements.chartDialog.close();
    }

    elements.chart.removeAttribute("src");

    elements.chartDialogImage.removeAttribute("src");

    elements.chartContainer.hidden = true;
    elements.chartTab.hidden = true;

    selectPythonTerminalTab(elements, "output");
  }

  function hideNextLink(): void {
    elements.nextLink.hidden = true;
    elements.nextLink.removeAttribute("href");
  }

  function clearTerminal(): void {
    lastResult = "";
    lastStatus = undefined;

    elements.output.textContent = "";
    elements.logs.textContent = "";
    elements.outputCount.hidden = true;
    elements.feedback.hidden = true;
    elements.feedback.textContent = "";

    hideErrorHelp();
    hideNextLink();
    clearChart();
    clearCelebration();
  }

  function showOutput(message: string): void {
    elements.output.textContent = message;
    elements.outputCount.hidden = false;

    selectPythonTerminalTab(elements, "output");
  }

  function setIdleControls(available: boolean): void {
    setRunButtonRunning(false);
    setRunButtonAvailable(available);
  }

  return {
    addLog,

    clearChart,

    clearTerminal,

    hideNextLink,

    prepareRun() {
      clearTerminal();

      setStatus("loading");
      setRunButtonRunning(true);
      setRunButtonAvailable(true);

      addLog("Preparando ejecución");
    },

    resetCode(isReady) {
      clearTerminal();

      setStatus(isReady ? "ready" : "loading");
      setIdleControls(isReady);

      addLog("Código restablecido");
    },

    setErrorHelpEnabled(enabled) {
      errorHelpEnabled = enabled;

      updateErrorHelp();
    },

    setReady() {
      setStatus("ready");
      setIdleControls(true);

      addLog("Entorno Python listo");
    },

    setRunning() {
      setStatus("running");
      setRunButtonRunning(true);
      setRunButtonAvailable(true);

      addLog("Ejecución iniciada");
    },

    showChart(chart) {
      const source = `data:image/png;base64,${chart}`;

      elements.chart.src = source;
      elements.chartDialogImage.src = source;

      elements.chartContainer.hidden = false;
      elements.chartTab.hidden = false;

      selectPythonTerminalTab(elements, "chart");

      addLog("Gráfico generado");
    },

    showExecutionStopped() {
      lastResult = "";
      lastStatus = undefined;

      clearChart();

      setStatus("stopped");
      setIdleControls(false);

      showOutput("La ejecución fue detenida por el usuario.");

      addLog("Ejecución detenida por el usuario");
    },

    showExecutionTimeout(executionTime) {
      lastResult = "";
      lastStatus = undefined;

      clearChart();

      setStatus("stopped");
      setIdleControls(false);

      showOutput(
        `La ejecución superó ${executionTime / 1_000} segundos y fue detenida.`,
      );

      addLog("Ejecución detenida por tiempo máximo");
    },

    showFeedback(message, passed) {
      elements.feedback.hidden = false;
      elements.feedback.textContent = message;

      elements.feedback.className = passed
        ? "mt-5 border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        : "mt-5 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900";
    },

    showLoadingTimeout() {
      lastResult = "";
      lastStatus = undefined;

      clearChart();

      setStatus("error");
      setIdleControls(false);

      showOutput(
        "La carga de Python o de los datos tardó demasiado. Inténtalo nuevamente.",
      );

      addLog("Tiempo de carga agotado");
    },

    showNextLink(href, label) {
      elements.nextLink.href = href;
      elements.nextLink.textContent = `${label} →`;
      elements.nextLink.hidden = false;
    },

    showResult(result, status) {
      lastResult = result;
      lastStatus = status;

      showOutput(result);

      setStatus(status === "success" ? "success" : "error");

      setIdleControls(true);

      addLog(
        status === "success"
          ? "Ejecución completada"
          : "La ejecución terminó con errores",
      );

      updateErrorHelp();
    },

    showUnexpectedError(error) {
      lastResult = "";
      lastStatus = undefined;

      clearChart();

      const message =
        error instanceof Error ? error.message : "Ocurrió un error inesperado.";

      showOutput(message);

      setStatus("error");
      setIdleControls(true);

      addLog("Ocurrió un error inesperado");
    },
  };
}
