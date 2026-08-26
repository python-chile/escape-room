import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(
  fileURLToPath(new URL("..", import.meta.url)),
);

const templatePath = resolve(
  projectRoot,
  "templates/python-runner.html",
);

const outputPath = resolve(
  projectRoot,
  "public/python-runner.html",
);

const result = await build({
  entryPoints: [
    resolve(projectRoot, "scripts/python-runner/main.js"),
  ],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2022",
  write: false,
});

const template = await readFile(templatePath, "utf8");

const script = result.outputFiles[0].text.replace(
  /<\/script/gi,
  "<\\/script",
);

const html = template.replace("__PYTHON_RUNNER_SCRIPT__", script);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html, "utf8");
