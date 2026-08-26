import type { PythonEditorElements } from "./dom";

export type PythonEditorUi = {
  clearChart: () => void;
  hideNextLink: () => void;
  prepareRun: () => void;
  resetCode: (isReady: boolean) => void;
  setLoading: () => void;
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
  function clearCelebration() {
    delete document.documentElement.dataset.pyschoolCelebrated;
  }

  function showResults() {
    elements.results.hidden = false;
    elements.workspace.classList.add("python-workspace--with-results");
  }

  function hideResults() {
    elements.results.hidden = true;
    elements.workspace.classList.remove("python-workspace--with-results");
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
      elements.status.textContent = "Cargando entorno…";
      elements.output.textContent = "";
      elements.feedback.hidden = true;

      hideNextLink();
      clearChart();
      hideResults();
      clearCelebration();
    },

    resetCode(isReady) {
      elements.output.textContent = "";
      elements.feedback.hidden = true;

      hideNextLink();
      clearChart();
      hideResults();
      clearCelebration();

      elements.status.textContent = isReady
        ? "Listo para ejecutar"
        : "Preparando entorno…";
    },

    setLoading() {
      elements.status.textContent = "Cargando entorno…";
    },

    setReady() {
      elements.runButton.disabled = false;
      elements.status.textContent = "Listo para ejecutar";
    },

    setRunning() {
      elements.status.textContent = "Ejecutando…";
    },

    showChart(chart) {
      elements.chart.src = `data:image/png;base64,${chart}`;
      elements.chartContainer.hidden = false;
    },

    showExecutionTimeout(executionTime) {
      showResults();
      elements.status.textContent = "Detenido por tiempo máximo";
      elements.output.textContent =
        `La ejecución superó los ${executionTime / 1_000} segundos y fue detenida.`;
    },

    showFeedback(message, passed) {
      elements.feedback.hidden = false;
      elements.feedback.textContent = message;
      elements.feedback.className = passed
        ? "mt-5 border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        : "mt-5 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900";
    },

    showLoadingTimeout() {
      showResults();
      elements.status.textContent = "No se pudo cargar el entorno";
      elements.output.textContent =
        "La carga de Python o de los datos tardó demasiado. Inténtalo nuevamente.";
    },

    showNextLink(href, label) {
      elements.nextLink.hidden = false;
      elements.nextLink.href = href;
      elements.nextLink.textContent = `${label} →`;
    },

    showResult(result, status) {
      showResults();
      elements.output.textContent = result;

      elements.status.textContent =
        status === "success" ? "Ejecución terminada" : "Error";

      elements.runButton.disabled = false;
    },

    showUnexpectedError(error) {
      showResults();
      elements.output.textContent = String(error);

      elements.status.textContent = "Error";
      elements.runButton.disabled = false;
    },
  };
}
