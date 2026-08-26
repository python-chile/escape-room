import type { CompletionContext } from "@codemirror/autocomplete";

const pythonWords = [
  "print",
  "input",
  "len",
  "range",
  "type",
  "str",
  "int",
  "float",
  "bool",
  "list",
  "dict",
  "tuple",
  "set",
  "sum",
  "min",
  "max",
  "round",
  "abs",
  "enumerate",
  "zip",
  "True",
  "False",
  "None",
].map((label) => ({
  label,
  type: "function",
}));

export function completePython(context: CompletionContext) {
  const word = context.matchBefore(/[a-zA-Z_]\w*/);

  if (!word && !context.explicit) {
    return null;
  }

  const variables = new Set<string>();

  for (const match of context.state.doc
    .toString()
    .matchAll(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/gm)) {
    variables.add(match[1]);
  }

  return {
    from: word?.from ?? context.pos,
    options: [
      ...[...variables].map((label) => ({
        label,
        type: "variable",
      })),
      ...pythonWords,
    ],
  };
}
