export type PythonErrorHelp = {
  errorName: string;
  explanation: string;
  suggestion: string;
};

type PythonErrorRule = PythonErrorHelp & {
  pattern: RegExp;
};

const ERROR_HELP_STORAGE_KEY = "pyschool-python-error-help";

const PYTHON_ERROR_RULES: PythonErrorRule[] = [
  {
    pattern: /\bIndentationError\b|\bTabError\b/,
    errorName: "Error de indentación",
    explanation:
      "Python encontró un bloque de código cuya sangría no es válida o no coincide con las líneas cercanas.",
    suggestion:
      "Revisa los espacios al comienzo de la línea. El código dentro de un if, for, while o función debe tener la misma indentación.",
  },
  {
    pattern: /\bSyntaxError\b/,
    errorName: "Error de sintaxis",
    explanation:
      "Python no pudo comprender una parte del código porque su estructura no es válida.",
    suggestion:
      "Revisa la línea indicada. Comprueba paréntesis, comillas, dos puntos y palabras reservadas.",
  },
  {
    pattern: /\bNameError\b/,
    errorName: "Nombre no definido",
    explanation:
      "Python intentó utilizar una variable o función que todavía no está definida.",
    suggestion:
      "Comprueba que el nombre exista, esté escrito correctamente y haya sido definido antes de utilizarlo.",
  },
  {
    pattern: /\bTypeError\b/,
    errorName: "Tipos incompatibles",
    explanation:
      "Python recibió un tipo de dato que no puede utilizar en esa operación o función.",
    suggestion:
      "Revisa los valores involucrados. Es posible que estés mezclando texto, números, listas u otros tipos incompatibles.",
  },
  {
    pattern: /\bIndexError\b/,
    errorName: "Índice fuera de rango",
    explanation:
      "Se intentó acceder a una posición que no existe dentro de una lista o secuencia.",
    suggestion:
      "Revisa la cantidad de elementos y recuerda que los índices de las listas comienzan en cero.",
  },
  {
    pattern: /\bKeyError\b/,
    errorName: "Clave inexistente",
    explanation:
      "Se intentó obtener una clave que no existe dentro de un diccionario.",
    suggestion:
      "Comprueba cómo está escrita la clave o verifica su existencia antes de acceder a ella.",
  },
  {
    pattern: /\bZeroDivisionError\b/,
    errorName: "División por cero",
    explanation: "Python intentó realizar una división cuyo divisor es cero.",
    suggestion:
      "Revisa el valor utilizado como divisor y valida que sea distinto de cero antes de dividir.",
  },
];

export function getPythonErrorHelp(output: string): PythonErrorHelp | null {
  const rule = PYTHON_ERROR_RULES.find(({ pattern }) => pattern.test(output));

  if (!rule) {
    return null;
  }

  return {
    errorName: rule.errorName,
    explanation: rule.explanation,
    suggestion: rule.suggestion,
  };
}

export function getErrorHelpPreference(): boolean {
  try {
    return window.localStorage.getItem(ERROR_HELP_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setErrorHelpPreference(enabled: boolean): void {
  try {
    window.localStorage.setItem(ERROR_HELP_STORAGE_KEY, String(enabled));
  } catch {
    // La ayuda continúa funcionando durante la sesión
    // aunque el almacenamiento local no esté disponible.
  }
}
