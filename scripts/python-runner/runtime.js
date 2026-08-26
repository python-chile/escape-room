const PYODIDE_URL =
  "https://cdn.jsdelivr.net/pyodide/v314.0.6/full/";

let pyodide;

export async function getPyodide() {
  if (!pyodide) {
    pyodide = await globalThis.loadPyodide({
      indexURL: PYODIDE_URL,
    });
  }

  return pyodide;
}

export function readVariable(runtime, variable) {
  if (!runtime.globals.has(variable)) {
    return {
      exists: false,
      value: undefined,
    };
  }

  const value = runtime.globals.get(variable);

  if (value?.toJs) {
    const convertedValue = value.toJs();
    value.destroy?.();

    return {
      exists: true,
      value: convertedValue,
    };
  }

  return {
    exists: true,
    value,
  };
}

export async function prepareRuntime(runtime, challenge, dataset) {
  const packages = challenge?.packages ?? [];

  for (const packageName of packages) {
    if (
      packageName !== "pandas" &&
      packageName !== "matplotlib"
    ) {
      throw new Error(`Paquete no permitido: ${packageName}`);
    }

    await runtime.loadPackage(packageName);
  }

  if (!dataset) {
    return;
  }

  if (
    typeof dataset.fileName !== "string" ||
    typeof dataset.content !== "string" ||
    !/^[a-zA-Z0-9._-]+$/.test(dataset.fileName)
  ) {
    throw new Error("El archivo de datos no es válido.");
  }

  runtime.FS.writeFile(`/${dataset.fileName}`, dataset.content);
}
