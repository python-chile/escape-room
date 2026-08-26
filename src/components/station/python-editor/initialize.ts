import { createPythonCodeEditor } from "./code-editor";
import { getPythonEditorElements } from "./dom";
import { createPythonRunner } from "./runner";
import type { Challenge } from "./types";
import { createPythonEditorUi } from "./ui";

function moveHintIntoEditor(editor: HTMLElement, hintSlot: HTMLElement) {
  const hint = editor.previousElementSibling;

  if (hint instanceof HTMLDetailsElement && hint.matches("[data-station-hint]")) {
    hintSlot.append(hint);
  }
}

export function initializePythonEditors() {
  document
    .querySelectorAll<HTMLElement>("[data-python-editor]")
    .forEach((editor) => {
      const elements = getPythonEditorElements(editor);

      moveHintIntoEditor(editor, elements.hintSlot);

      const starterCode = editor.dataset.pythonStarterCode ?? "";

      const challenge = editor.dataset.pythonChallenge
        ? (JSON.parse(editor.dataset.pythonChallenge) as Challenge)
        : undefined;

      const editorView = createPythonCodeEditor(
        elements.codeElement,
        starterCode,
      );

      const ui = createPythonEditorUi(elements);

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
    });
}
