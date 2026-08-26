export type PythonEditorElements = {
  codeElement: HTMLElement;
  codePanel: HTMLElement;
  workspace: HTMLElement;
  results: HTMLElement;
  hintSlot: HTMLElement;
  runButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  output: HTMLElement;
  status: HTMLElement;
  feedback: HTMLElement;
  nextLink: HTMLAnchorElement;
  chartContainer: HTMLElement;
  chart: HTMLImageElement;
  runner: HTMLIFrameElement;
};

function requireElement<T extends Element>(
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
    codeElement: requireElement(editor, "[data-python-code]"),
    codePanel: requireElement(editor, "[data-python-code-panel]"),
    workspace: requireElement(editor, "[data-python-workspace]"),
    results: requireElement(editor, "[data-python-results]"),
    hintSlot: requireElement(editor, "[data-python-hint-slot]"),
    runButton: requireElement(editor, "[data-python-run]"),
    resetButton: requireElement(editor, "[data-python-reset]"),
    output: requireElement(editor, "[data-python-output]"),
    status: requireElement(editor, "[data-python-status]"),
    feedback: requireElement(editor, "[data-python-feedback]"),
    nextLink: requireElement(editor, "[data-python-next]"),
    chartContainer: requireElement(
      editor,
      "[data-python-chart-container]",
    ),
    chart: requireElement(editor, "[data-python-chart]"),
    runner: requireElement(editor, "[data-python-runner]"),
  };
}
