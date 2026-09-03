import { expect, type Page } from "@playwright/test";

import type { ChallengeTest } from "./types";

export async function writeCode(page: Page, code: string): Promise<void> {
  const editor = page.locator("[data-python-code] .cm-content");

  await expect(editor).toBeVisible();

  await editor.fill(code);
}

export async function runChallenge(
  page: Page,
  challenge: ChallengeTest,
): Promise<void> {
  await page.goto(challenge.path);

  const runButton = page.locator("[data-python-run]");

  const status = page.locator("[data-python-status-text]");

  const output = page.locator("[data-python-output]");

  await expect(runButton).toBeEnabled({
    timeout: 90_000,
  });

  await writeCode(page, challenge.code);

  await runButton.click();

  await expect(status).toHaveText(
    /^(Ejecución terminada|Error|Detenido por tiempo máximo|No se pudo cargar el entorno)$/,
    {
      timeout: challenge.chart ? 120_000 : 90_000,
    },
  );

  const executionStatus = await status.textContent();

  if (executionStatus !== "Ejecución terminada") {
    const errorOutput = await output.textContent();

    throw new Error(
      `La ejecución terminó con "${executionStatus}":\n${errorOutput}`,
    );
  }

  if (challenge.chart) {
    const chartTab = page.locator('[data-python-terminal-tab="chart"]');

    const chart = page.locator("[data-python-chart]");

    await expect(chartTab).toBeVisible();
    await expect(chartTab).toHaveAttribute("aria-selected", "true");

    await expect(chart).toBeVisible();

    await expect(chart).toHaveAttribute("src", /^data:image\/png;base64,/);

    const outputTab = page.locator('[data-python-terminal-tab="output"]');

    await outputTab.click();

    await expect(outputTab).toHaveAttribute("aria-selected", "true");
  }

  const feedback = page.locator("[data-python-feedback]");

  await expect(feedback).toBeVisible();

  await expect(feedback).toHaveClass(/text-emerald-800/);

  await expect(page.locator("html")).toHaveAttribute(
    "data-pyschool-celebrated",
    "true",
  );

  const nextLink = page.locator("[data-python-next]");

  await expect(nextLink).toBeVisible();

  await expect(nextLink).toHaveAttribute("href", challenge.nextHref);
}
