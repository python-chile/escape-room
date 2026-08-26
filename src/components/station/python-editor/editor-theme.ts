import { EditorView } from "@codemirror/view";

export const pythonEditorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "#ffffff",
    color: "#101d27",
    fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
    fontSize: "0.95rem",
  },

  ".cm-scroller": {
    overflow: "auto",
  },

  ".cm-content": {
    minHeight: "100%",
    padding: "1.5rem 1rem",
    caretColor: "#0879e8",
  },

  ".cm-gutters": {
    border: "none",
    borderRight: "1px solid #e2e8f0",
    backgroundColor: "#f8fbff",
    color: "#94a3b8",
    paddingTop: "1.5rem",
  },

  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 0.75rem 0 0.5rem",
  },

  ".cm-activeLine": {
    backgroundColor: "#f8fbff",
  },

  ".cm-activeLineGutter": {
    backgroundColor: "#edf4ff",
    color: "#0879e8",
  },

  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "#bfdbfe",
  },

  ".cm-focused": {
    outline: "none",
  },
});
