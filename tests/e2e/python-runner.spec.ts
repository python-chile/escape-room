import { expect, test, type Page } from "@playwright/test";

import { writeCode } from "./challenges/helpers";

const runnerPath = "/estaciones/01-estacion-espacial/01-variable-string";

const pythonErrors = [
  {
    name: "SyntaxError",
    code: `print("Hola"`,
  },
  {
    name: "NameError",
    code: `print(variable_inexistente)`,
  },
  {
    name: "TypeError",
    code: `print("5" + 5)`,
  },
  {
    name: "IndentationError",
    code: `if True:
print("Hola")`,
  },
  {
    name: "IndexError",
    code: `numeros = [1, 2]
print(numeros[5])`,
  },
  {
    name: "KeyError",
    code: `persona = {"nombre": "Ana"}
print(persona["edad"])`,
  },
  {
    name: "ZeroDivisionError",
    code: `print(10 / 0)`,
  },
] as const;

function getRunner(page: Page) {
  return {
    runButton: page.locator("[data-python-run]"),
    status: page.locator("[data-python-status-text]"),
    output: page.locator("[data-python-output]"),
    feedback: page.locator("[data-python-feedback]"),
    nextLink: page.locator("[data-python-next]"),
  };
}

test.describe("Python runner", () => {
  test("aísla las variables entre ejecuciones", async ({ page }) => {
    test.setTimeout(180_000);

    await page.goto(runnerPath);

    const { runButton, status, output, feedback, nextLink } = getRunner(page);

    await expect(runButton).toBeEnabled({
      timeout: 90_000,
    });

    await writeCode(
      page,
      `respuesta = "Cerrar"
variable_temporal = 123
print(variable_temporal)`,
    );

    await runButton.click();

    await expect(feedback).toBeVisible({
      timeout: 90_000,
    });

    await expect(feedback).toHaveClass(/text-emerald-800/);
    await expect(output).toContainText("123");
    await expect(nextLink).toBeVisible();
    await expect(runButton).toBeEnabled();

    await writeCode(
      page,
      `print("variable_temporal" in globals())
print("respuesta" in globals())`,
    );

    await runButton.click();

    await expect(output).toContainText("False", {
      timeout: 90_000,
    });

    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/text-amber-900/);
    await expect(nextLink).toBeHidden();
    await expect(status).toHaveText("Ejecución terminada");
  });

  test("muestra los errores comunes de Python y permite recuperarse", async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await page.goto(runnerPath);

    const { runButton, status, output, feedback, nextLink } = getRunner(page);

    await expect(runButton).toBeEnabled({
      timeout: 90_000,
    });

    for (const pythonError of pythonErrors) {
      await test.step(`muestra ${pythonError.name}`, async () => {
        await writeCode(page, pythonError.code);
        await runButton.click();

        await expect(output).toContainText(pythonError.name, {
          timeout: 90_000,
        });

        await expect(status).toHaveText("Error");
        await expect(runButton).toBeEnabled();
        await expect(nextLink).toBeHidden();

        await expect(page.locator("html")).not.toHaveAttribute(
          "data-pyschool-celebrated",
          "true",
        );
      });
    }

    await test.step("permite corregir el código después de un error", async () => {
      await writeCode(
        page,
        `respuesta = "Cerrar"
print(respuesta)`,
      );

      await runButton.click();

      await expect(status).toHaveText("Ejecución terminada", {
        timeout: 90_000,
      });

      await expect(output).toContainText("Cerrar");
      await expect(feedback).toBeVisible();
      await expect(feedback).toHaveClass(/text-emerald-800/);
      await expect(nextLink).toBeVisible();

      await expect(page.locator("html")).toHaveAttribute(
        "data-pyschool-celebrated",
        "true",
      );
    });
  });
});
