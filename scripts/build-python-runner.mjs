import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const SCRIPT_PLACEHOLDER = "__PYTHON_RUNNER_SCRIPT__";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

const entryPath = resolve(projectRoot, "scripts/python-runner/main.js");

const templatePath = resolve(projectRoot, "templates/python-runner.html");

const outputPath = resolve(projectRoot, "public/python-runner.html");

async function bundleRunner() {
  const result = await build({
    entryPoints: [entryPath],
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2022",
    charset: "utf8",
    legalComments: "none",
    treeShaking: true,
    write: false,
    outfile: "python-runner.js",
  });

  const outputFile = result.outputFiles.find((file) =>
    file.path.endsWith(".js"),
  );

  if (!outputFile) {
    throw new Error("esbuild no generó el bundle del runner.");
  }

  return outputFile.text;
}

function injectScript(template, script) {
  const occurrences = template.split(SCRIPT_PLACEHOLDER).length - 1;

  if (occurrences !== 1) {
    throw new Error(
      `La plantilla debe contener exactamente una vez el marcador ${SCRIPT_PLACEHOLDER}.`,
    );
  }

  const safeScript = script.replace(/<\/script/gi, "<\\/script");

  return template.replace(SCRIPT_PLACEHOLDER, safeScript);
}

async function buildPythonRunner() {
  const [template, script] = await Promise.all([
    readFile(templatePath, "utf8"),
    bundleRunner(),
  ]);

  const html = injectScript(template, script);

  await mkdir(dirname(outputPath), {
    recursive: true,
  });

  await writeFile(outputPath, html, "utf8");
}

await buildPythonRunner();
