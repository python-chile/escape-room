import type { Completion, CompletionContext } from "@codemirror/autocomplete";

const builtinFunctions: Completion[] = [
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
].map((label) => ({
  label,
  type: "function",
}));

const builtinConstants: Completion[] = ["True", "False", "None"].map(
  (label) => ({
    label,
    type: "constant",
  }),
);

export function completePython(context: CompletionContext) {
  const word = context.matchBefore(/[A-Za-z_]\w*/);

  if (!word && !context.explicit) {
    return null;
  }

  const variables = new Set<string>();
  const source = context.state.doc.toString();
  const assignments = source.matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/gm);

  for (const match of assignments) {
    const variable = match[1];

    if (variable) {
      variables.add(variable);
    }
  }

  const variableCompletions: Completion[] = Array.from(variables)
    .sort()
    .map((label) => ({
      label,
      type: "variable",
    }));

  return {
    from: word?.from ?? context.pos,
    options: [...variableCompletions, ...builtinFunctions, ...builtinConstants],
  };
}
