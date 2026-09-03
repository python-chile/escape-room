import { createPythonCodeEditor } from "./code-editor";
import { getPythonEditorElements } from "./dom";
import {
  getErrorHelpPreference,
  setErrorHelpPreference,
} from "./python-error-help";
import { createPythonRunner } from "./runner";
import { initializePythonTerminal } from "./terminal";
import type { Challenge } from "./types";
import { createPythonEditorUi } from "./ui";

const INITIALIZED_VALUE = "true";

function moveHintIntoEditor(
  editor: HTMLElement,
  hintSlot: HTMLElement,
): number {
  let sibling = editor.previousElementSibling;

  while (sibling) {
    if (
      sibling instanceof HTMLDetailsElement &&
      sibling.matches("[data-station-hint]")
    ) {
      const content = sibling.querySelector<HTMLElement>(
        "[data-station-hint-content]",
      );

      if (!content) {
        return 0;
      }

      content.dataset.embedded = "true";
      hintSlot.append(content);
      sibling.remove();

      return 1;
    }

    if (sibling.matches("[data-python-editor]")) {
      break;
    }

    sibling = sibling.previousElementSibling;
  }

  return 0;
}

function parseChallenge(value?: string): Challenge | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as Challenge;
  } catch {
    throw new Error(
      "La configuración del desafío Python no contiene JSON válido.",
    );
  }
}

function initializePythonEditor(editor: HTMLElement): void {
  if (editor.dataset.pythonInitialized === INITIALIZED_VALUE) {
    return;
  }

  editor.dataset.pythonInitialized = INITIALIZED_VALUE;

  try {
    const elements = getPythonEditorElements(editor);

    const starterCode = editor.dataset.pythonStarterCode ?? "";

    const challenge = parseChallenge(editor.dataset.pythonChallenge);

    const hintCount = moveHintIntoEditor(editor, elements.hintSlot);

    elements.hintCount.textContent = String(hintCount);
    elements.hintCount.hidden = hintCount === 0;
    elements.emptyHints.hidden = hintCount > 0;

    const editorView = createPythonCodeEditor(
      elements.codeElement,
      starterCode,
      {
        onRun() {
          elements.runButton.click();
        },
      },
    );

    const ui = createPythonEditorUi(elements);

    initializePythonTerminal(elements, ui);

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
  } catch (error) {
    delete editor.dataset.pythonInitialized;

    throw error;
  }
}

export function initializePythonEditors(): void {
  document
    .querySelectorAll<HTMLElement>("[data-python-editor]")
    .forEach(initializePythonEditor);
}
