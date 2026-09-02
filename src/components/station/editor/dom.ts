export type PythonEditorElements = {
  editorShell: HTMLElement;
  editorExpand: HTMLButtonElement;

  codeElement: HTMLElement;
  codePanel: HTMLElement;
  workspace: HTMLElement;

  results: HTMLElement;

  hintSlot: HTMLElement;
  emptyHints: HTMLElement;
  hintCount: HTMLElement;

  runButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;

  output: HTMLElement;
  outputCount: HTMLElement;
  logs: HTMLElement;

  statusText: HTMLElement;
  statusDot: HTMLElement;

  feedback: HTMLElement;
  nextLink: HTMLAnchorElement;

  chartTab: HTMLButtonElement;
  chartContainer: HTMLElement;
  chart: HTMLImageElement;
  chartExpand: HTMLButtonElement;
  chartDownload: HTMLButtonElement;
  chartDialog: HTMLDialogElement;
  chartDialogImage: HTMLImageElement;
  chartDialogClose: HTMLButtonElement;

  runner: HTMLIFrameElement;

  errorHelpToggle: HTMLInputElement;
  errorHelp: HTMLElement;
  errorHelpName: HTMLElement;
  errorHelpExplanation: HTMLElement;
  errorHelpSuggestion: HTMLElement;
  errorHelpClose: HTMLButtonElement;

  terminalTabs: HTMLButtonElement[];
  terminalPanels: HTMLElement[];
  terminalContent: HTMLElement;
  terminalToggle: HTMLButtonElement;
  clearTerminal: HTMLButtonElement;
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
    editorShell: queryRequiredElement(editor, "[data-python-editor-shell]"),

    editorExpand: queryRequiredElement(editor, "[data-python-editor-expand]"),

    codeElement: queryRequiredElement(editor, "[data-python-code]"),

    codePanel: queryRequiredElement(editor, "[data-python-code-panel]"),

    workspace: queryRequiredElement(editor, "[data-python-workspace]"),

    results: queryRequiredElement(editor, "[data-python-results]"),

    hintSlot: queryRequiredElement(editor, "[data-python-hint-slot]"),

    emptyHints: queryRequiredElement(editor, "[data-python-empty-hints]"),

    hintCount: queryRequiredElement(editor, "[data-python-hint-count]"),

    runButton: queryRequiredElement(editor, "[data-python-run]"),

    resetButton: queryRequiredElement(editor, "[data-python-reset]"),

    output: queryRequiredElement(editor, "[data-python-output]"),

    outputCount: queryRequiredElement(editor, "[data-python-output-count]"),

    logs: queryRequiredElement(editor, "[data-python-logs]"),

    statusText: queryRequiredElement(editor, "[data-python-status-text]"),

    statusDot: queryRequiredElement(editor, "[data-python-status-dot]"),

    feedback: queryRequiredElement(editor, "[data-python-feedback]"),

    nextLink: queryRequiredElement(editor, "[data-python-next]"),

    chartTab: queryRequiredElement(editor, "[data-python-chart-tab]"),

    chartContainer: queryRequiredElement(
      editor,
      "[data-python-chart-container]",
    ),

    chart: queryRequiredElement(editor, "[data-python-chart]"),

    chartExpand: queryRequiredElement(editor, "[data-python-chart-expand]"),

    chartDownload: queryRequiredElement(editor, "[data-python-chart-download]"),

    chartDialog: queryRequiredElement(editor, "[data-python-chart-dialog]"),

    chartDialogImage: queryRequiredElement(
      editor,
      "[data-python-chart-dialog-image]",
    ),

    chartDialogClose: queryRequiredElement(
      editor,
      "[data-python-chart-dialog-close]",
    ),

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

    errorHelpClose: queryRequiredElement(
      editor,
      "[data-python-error-help-close]",
    ),

    terminalTabs: Array.from(
      editor.querySelectorAll<HTMLButtonElement>("[data-python-terminal-tab]"),
    ),

    terminalPanels: Array.from(
      editor.querySelectorAll<HTMLElement>("[data-python-terminal-panel]"),
    ),

    terminalContent: queryRequiredElement(
      editor,
      "[data-python-terminal-content]",
    ),

    terminalToggle: queryRequiredElement(
      editor,
      "[data-python-terminal-toggle]",
    ),

    clearTerminal: queryRequiredElement(editor, "[data-python-clear-terminal]"),
  };
}
