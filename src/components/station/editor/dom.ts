export type PythonEditorElements = {
  codeElement: HTMLElement;
  codePanel: HTMLElement;
  workspace: HTMLElement;
  results: HTMLElement;
  hintSlot: HTMLElement;
  runButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  output: HTMLElement;
  statusText: HTMLElement;
  feedback: HTMLElement;
  nextLink: HTMLAnchorElement;
  chartContainer: HTMLElement;
  chart: HTMLImageElement;
  runner: HTMLIFrameElement;
  errorHelpToggle: HTMLInputElement;
  errorHelp: HTMLElement;
  errorHelpName: HTMLElement;
  errorHelpExplanation: HTMLElement;
  errorHelpSuggestion: HTMLElement;
};

function queryRequiredElement<T extends Element>(
  parent: HTMLElement,
  selector: string,
): T {
  const element = parent.querySelector<T>(selector);

  if (!element) {
    throw new Error(`No se encontró el elemento: ${selector}`);
  }

  return element;
}

export function getPythonEditorElements(
  editor: HTMLElement,
): PythonEditorElements {
  return {
    codeElement: queryRequiredElement(editor, "[data-python-code]"),
    codePanel: queryRequiredElement(editor, "[data-python-code-panel]"),
    workspace: queryRequiredElement(editor, "[data-python-workspace]"),
    results: queryRequiredElement(editor, "[data-python-results]"),
    hintSlot: queryRequiredElement(editor, "[data-python-hint-slot]"),
    runButton: queryRequiredElement(editor, "[data-python-run]"),
    resetButton: queryRequiredElement(editor, "[data-python-reset]"),
    output: queryRequiredElement(editor, "[data-python-output]"),
    statusText: queryRequiredElement(editor, "[data-python-status-text]"),
    feedback: queryRequiredElement(editor, "[data-python-feedback]"),
    nextLink: queryRequiredElement(editor, "[data-python-next]"),
    chartContainer: queryRequiredElement(
      editor,
      "[data-python-chart-container]",
    ),
    chart: queryRequiredElement(editor, "[data-python-chart]"),
    runner: queryRequiredElement(editor, "[data-python-runner]"),
    errorHelpToggle: queryRequiredElement(
      editor,
      "[data-python-error-help-toggle]",
    ),
    errorHelp: queryRequiredElement(editor, "[data-python-error-help]"),
    errorHelpName: queryRequiredElement(
      editor,
      "[data-python-error-help-name]",
    ),
    errorHelpExplanation: queryRequiredElement(
      editor,
      "[data-python-error-help-explanation]",
    ),
    errorHelpSuggestion: queryRequiredElement(
      editor,
      "[data-python-error-help-suggestion]",
    ),
  };
}
