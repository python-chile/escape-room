import type { PythonEditorElements } from "./dom";
import { getPythonErrorHelp } from "./python-error-help";
import { selectPythonTerminalTab } from "./terminal";

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
  showExecutionTimeout: (executionTime: number) => void;
  showFeedback: (message: string, passed: boolean) => void;
  showLoadingTimeout: () => void;
  showNextLink: (href: string, label: string) => void;
  showResult: (result: string, status: "success" | "error") => void;
  showUnexpectedError: (error: unknown) => void;
};

export function createPythonEditorUi(
  elements: PythonEditorElements,
): PythonEditorUi {
  let errorHelpEnabled = false;
  let lastResult = "";
  let lastStatus: "success" | "error" | undefined;

  function addLog(message: string) {
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

  function clearCelebration() {
    delete document.documentElement.dataset.pyschoolCelebrated;
  }

  function hideErrorHelp() {
    elements.errorHelp.hidden = true;
    elements.errorHelpName.textContent = "";
    elements.errorHelpExplanation.textContent = "";
    elements.errorHelpSuggestion.textContent = "";
  }

  function updateErrorHelp() {
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

  function clearChart() {
    elements.chart.removeAttribute("src");

    elements.chartDialogImage.removeAttribute("src");

    elements.chartContainer.hidden = true;
    elements.chartTab.hidden = true;

    selectPythonTerminalTab(elements, "output");
  }

  function hideNextLink() {
    elements.nextLink.hidden = true;
  }

  function clearTerminal() {
    lastResult = "";
    lastStatus = undefined;

    elements.output.textContent = "";
    elements.logs.textContent = "";
    elements.outputCount.hidden = true;
    elements.feedback.hidden = true;

    hideErrorHelp();
    hideNextLink();
    clearChart();
    clearCelebration();
  }

  return {
    addLog,
    clearChart,
    clearTerminal,
    hideNextLink,

    prepareRun() {
      elements.runButton.disabled = true;

      elements.statusText.textContent = "Cargando entorno…";

      clearTerminal();
      addLog("Preparando ejecución");
    },

    resetCode(isReady) {
      clearTerminal();

      elements.statusText.textContent = isReady
        ? "Listo para ejecutar"
        : "Preparando entorno…";

      addLog("Código restablecido");
    },

    setErrorHelpEnabled(enabled) {
      errorHelpEnabled = enabled;
      updateErrorHelp();
    },

    setReady() {
      elements.runButton.disabled = false;

      elements.statusText.textContent = "Listo para ejecutar";

      addLog("Entorno Python listo");
    },

    setRunning() {
      elements.statusText.textContent = "Ejecutando…";

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

    showExecutionTimeout(executionTime) {
      lastResult = "";
      lastStatus = undefined;

      clearChart();

      elements.statusText.textContent = "Detenido por tiempo máximo";

      elements.output.textContent = `La ejecución superó ${
        executionTime / 1_000
      } segundos y fue detenida.`;

      elements.outputCount.hidden = false;

      selectPythonTerminalTab(elements, "output");

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

      elements.statusText.textContent = "No se pudo cargar el entorno";

      elements.output.textContent =
        "La carga de Python o de los datos tardó demasiado. Inténtalo nuevamente.";

      elements.outputCount.hidden = false;

      selectPythonTerminalTab(elements, "output");

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

      elements.output.textContent = result;
      elements.outputCount.hidden = false;

      elements.statusText.textContent =
        status === "success" ? "Ejecución terminada" : "Error";

      elements.runButton.disabled = false;

      selectPythonTerminalTab(elements, "output");

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

      elements.output.textContent =
        error instanceof Error ? error.message : "Ocurrió un error inesperado.";

      elements.outputCount.hidden = false;
      elements.statusText.textContent = "Error";
      elements.runButton.disabled = false;

      selectPythonTerminalTab(elements, "output");

      addLog("Ocurrió un error inesperado");
    },
  };
}
