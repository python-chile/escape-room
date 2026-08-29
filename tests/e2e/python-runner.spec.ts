import { expect, test } from "@playwright/test";

import { writeCode } from "./challenges/helpers";

test.describe("Python runner", () => {
  test("aísla las variables entre ejecuciones", async ({ page }) => {
    await page.goto("/estaciones/01-estacion-espacial/01-variable-string");

    const runButton = page.locator("[data-python-run]");
    const status = page.locator("[data-python-status-text]");
    const output = page.locator("[data-python-output]");
    const feedback = page.locator("[data-python-feedback]");
    const nextLink = page.locator("[data-python-next]");

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
});
