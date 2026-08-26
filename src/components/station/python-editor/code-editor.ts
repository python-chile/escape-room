import { autocompletion } from "@codemirror/autocomplete";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";

import { completePython } from "./completions";
import { pythonEditorTheme } from "./editor-theme";

export function createPythonCodeEditor(
  parent: HTMLElement,
  starterCode: string,
) {
  return new EditorView({
    state: EditorState.create({
      doc: starterCode,
      extensions: [
        python(),
        syntaxHighlighting(defaultHighlightStyle),
        autocompletion({
          override: [completePython],
          activateOnTyping: true,
        }),
        keymap.of([...defaultKeymap, indentWithTab]),
        EditorView.lineWrapping,
        pythonEditorTheme,
      ],
    }),
    parent,
  });
}
