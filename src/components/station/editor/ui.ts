import type { PythonEditorElements } from "./dom";
import { getPythonErrorHelp } from "./python-error-help";

export type PythonEditorUi = {
  clearChart: () => void;
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

  function clearCelebration() {
    delete document.documentElement.dataset.pyschoolCelebrated;
  }

  function showResults() {
    elements.results.hidden = false;
    elements.results.classList.add("flex");
    elements.workspace.classList.add("python-workspace--with-results");
  }

  function hideResults() {
    elements.results.hidden = true;
    elements.results.classList.remove("flex");
    elements.workspace.classList.remove("python-workspace--with-results");
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

  function clearOutput() {
    lastResult = "";
    lastStatus = undefined;

    elements.output.textContent = "";
    elements.feedback.hidden = true;

    hideErrorHelp();
    hideNextLink();
    clearChart();
    hideResults();
    clearCelebration();
  }

  function clearChart() {
    elements.chart.removeAttribute("src");
    elements.chartContainer.hidden = true;
  }

  function hideNextLink() {
    elements.nextLink.hidden = true;
  }

  return {
    clearChart,
    hideNextLink,

    prepareRun() {
      elements.runButton.disabled = true;
      elements.statusText.textContent = "Cargando entorno…";
      clearOutput();
    },

    resetCode(isReady) {
      clearOutput();

      elements.statusText.textContent = isReady
        ? "Listo para ejecutar"
        : "Preparando entorno…";
    },

    setErrorHelpEnabled(enabled) {
      errorHelpEnabled = enabled;
      updateErrorHelp();
    },

    setReady() {
      elements.runButton.disabled = false;
      elements.statusText.textContent = "Listo para ejecutar";
    },

    setRunning() {
      elements.statusText.textContent = "Ejecutando…";
    },

    showChart(chart) {
      elements.chart.src = `data:image/png;base64,${chart}`;
      elements.chartContainer.hidden = false;
    },

    showExecutionTimeout(executionTime) {
      lastResult = "";
      lastStatus = undefined;

      showResults();
      hideErrorHelp();

      elements.statusText.textContent = "Detenido por tiempo máximo";

      elements.output.textContent = `La ejecución superó los ${
        executionTime / 1_000
      } segundos y fue detenida.`;
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

      showResults();
      hideErrorHelp();

      elements.statusText.textContent = "No se pudo cargar el entorno";

      elements.output.textContent =
        "La carga de Python o de los datos tardó demasiado. Inténtalo nuevamente.";
    },

    showNextLink(href, label) {
      elements.nextLink.href = href;
      elements.nextLink.textContent = `${label} →`;
      elements.nextLink.hidden = false;
    },

    showResult(result, status) {
      lastResult = result;
      lastStatus = status;

      showResults();

      // El mensaje original de Python siempre se conserva.
      elements.output.textContent = result;

      elements.statusText.textContent =
        status === "success" ? "Ejecución terminada" : "Error";

      elements.runButton.disabled = false;

      updateErrorHelp();
    },

    showUnexpectedError(error) {
      lastResult = "";
      lastStatus = undefined;

      showResults();
      hideErrorHelp();

      elements.output.textContent =
        error instanceof Error ? error.message : "Ocurrió un error inesperado.";

      elements.statusText.textContent = "Error";
      elements.runButton.disabled = false;
    },
  };
}
