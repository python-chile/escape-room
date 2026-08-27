const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

const ALLOWED_PACKAGES = new Set(["pandas", "matplotlib"]);
const VALID_FILE_NAME = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

const MATPLOTLIB_SETUP_SCRIPT = `
import matplotlib
matplotlib.use("Agg", force=True)
`;

let pyodidePromise;

export function getPyodide() {
  if (!pyodidePromise) {
    if (typeof globalThis.loadPyodide !== "function") {
      throw new Error("Pyodide no está disponible.");
    }

    pyodidePromise = globalThis
      .loadPyodide({
        indexURL: PYODIDE_INDEX_URL,
      })
      .catch((error) => {
        pyodidePromise = undefined;
        throw error;
      });
  }

  return pyodidePromise;
}

export function readVariable(runtime, variableName) {
  if (!runtime.globals.has(variableName)) {
    return {
      exists: false,
      value: undefined,
    };
  }

  const pythonValue = runtime.globals.get(variableName);

  if (typeof pythonValue?.toJs !== "function") {
    return {
      exists: true,
      value: pythonValue,
    };
  }

  try {
    return {
      exists: true,
      value: pythonValue.toJs(),
    };
  } finally {
    pythonValue.destroy?.();
  }
}

function getAllowedPackages(challenge) {
  const packages = challenge?.packages ?? [];

  if (!Array.isArray(packages)) {
    throw new Error("La lista de paquetes no es válida.");
  }

  const uniquePackages = [...new Set(packages)];

  for (const packageName of uniquePackages) {
    if (!ALLOWED_PACKAGES.has(packageName)) {
      throw new Error(`Paquete no permitido: ${String(packageName)}`);
    }
  }

  return uniquePackages;
}

function validateDataset(dataset) {
  const isValid =
    typeof dataset === "object" &&
    dataset !== null &&
    typeof dataset.fileName === "string" &&
    typeof dataset.content === "string" &&
    VALID_FILE_NAME.test(dataset.fileName) &&
    !dataset.fileName.includes("..");

  if (!isValid) {
    throw new Error("El archivo de datos no es válido.");
  }

  return dataset;
}

async function loadPackages(runtime, packages) {
  for (const packageName of packages) {
    await runtime.loadPackage(packageName);
  }

  if (packages.includes("matplotlib")) {
    await runtime.runPythonAsync(MATPLOTLIB_SETUP_SCRIPT);
  }
}

function writeDataset(runtime, dataset) {
  if (!dataset) {
    return;
  }

  const validatedDataset = validateDataset(dataset);

  runtime.FS.writeFile(
    `/${validatedDataset.fileName}`,
    validatedDataset.content,
  );
}

export async function prepareRuntime(runtime, challenge, dataset) {
  const packages = getAllowedPackages(challenge);

  await loadPackages(runtime, packages);
  writeDataset(runtime, dataset);
}
