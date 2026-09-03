import { autocompletion } from "@codemirror/autocomplete";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, type KeyBinding } from "@codemirror/view";

import { completePython } from "./completions";
import { pythonEditorTheme } from "./editor-theme";

type PythonCodeEditorOptions = {
  onRun: () => void;
};

function createEditorKeymap(onRun: () => void): readonly KeyBinding[] {
  return [
    {
      key: "Mod-Enter",
      preventDefault: true,
      run() {
        onRun();

        return true;
      },
    },
    ...defaultKeymap,
    indentWithTab,
  ];
}

export function createPythonCodeEditor(
  parent: HTMLElement,
  starterCode: string,
  { onRun }: PythonCodeEditorOptions,
): EditorView {
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

        keymap.of(createEditorKeymap(onRun)),

        EditorView.lineWrapping,

        EditorView.contentAttributes.of({
          "aria-label": "Editor de código Python",
          "aria-multiline": "true",
          autocapitalize: "off",
          autocomplete: "off",
          autocorrect: "off",
          spellcheck: "false",
        }),

        pythonEditorTheme,
      ],
    }),

    parent,
  });
}
