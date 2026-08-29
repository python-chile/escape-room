import { createPythonCodeEditor } from "./code-editor";
import { getPythonEditorElements } from "./dom";
import {
  getErrorHelpPreference,
  setErrorHelpPreference,
} from "./python-error-help";
import { createPythonRunner } from "./runner";
import type { Challenge } from "./types";
import { createPythonEditorUi } from "./ui";

function moveHintIntoEditor(editor: HTMLElement, hintSlot: HTMLElement) {
  const hint = editor.previousElementSibling;

  if (
    hint instanceof HTMLDetailsElement &&
    hint.matches("[data-station-hint]")
  ) {
    hintSlot.append(hint);
  }
}

function parseChallenge(value?: string): Challenge | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as Challenge;
  } catch {
    return undefined;
  }
}

function initializePythonEditor(editor: HTMLElement) {
  const elements = getPythonEditorElements(editor);
  const starterCode = editor.dataset.pythonStarterCode ?? "";
  const challenge = parseChallenge(editor.dataset.pythonChallenge);

  moveHintIntoEditor(editor, elements.hintSlot);

  const editorView = createPythonCodeEditor(elements.codeElement, starterCode);

  const ui = createPythonEditorUi(elements);
  const errorHelpEnabled = getErrorHelpPreference();

  elements.errorHelpToggle.checked = errorHelpEnabled;
  ui.setErrorHelpEnabled(errorHelpEnabled);

  elements.errorHelpToggle.addEventListener("change", () => {
    const enabled = elements.errorHelpToggle.checked;

    setErrorHelpPreference(enabled);
    ui.setErrorHelpEnabled(enabled);
  });

  const runner = createPythonRunner({
    challenge,
    elements,
    getCode: () => editorView.state.doc.toString(),
    ui,
  });

  elements.runButton.addEventListener("click", () => {
    void runner.run();
  });

  elements.resetButton.addEventListener("click", () => {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: starterCode,
      },
    });

    ui.resetCode(runner.isReady());
    editorView.focus();
  });
}

export function initializePythonEditors() {
  document
    .querySelectorAll<HTMLElement>("[data-python-editor]")
    .forEach(initializePythonEditor);
}
