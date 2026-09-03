import { describe, expect, it } from "vitest";

import { captureChart } from "../../scripts/python-runner/chart.js";

const CHART_VARIABLE = "__pyschool_chart";

class FakeNamespace {
  readonly values = new Map<string, unknown>();

  has(name: string): boolean {
    return this.values.has(name);
  }

  get(name: string): unknown {
    return this.values.get(name);
  }

  set(name: string, value: unknown): void {
    this.values.set(name, value);
  }

  delete(name: string): boolean {
    return this.values.delete(name);
  }
}

describe("captureChart", () => {
  it("retorna undefined cuando no existe gráfico", async () => {
    const namespace = new FakeNamespace();

    const runtime = {
      async runPythonAsync() {
        namespace.set(CHART_VARIABLE, "");
      },
    };

    const result = await captureChart(runtime, namespace);

    expect(result).toBeUndefined();

    expect(namespace.has(CHART_VARIABLE)).toBe(false);
  });

  it("retorna el gráfico codificado", async () => {
    const namespace = new FakeNamespace();

    const encodedChart = "aW1hZ2Vu";

    const runtime = {
      async runPythonAsync() {
        namespace.set(CHART_VARIABLE, encodedChart);
      },
    };

    const result = await captureChart(runtime, namespace);

    expect(result).toBe(encodedChart);

    expect(namespace.has(CHART_VARIABLE)).toBe(false);
  });

  it("rechaza gráficos mayores al límite", async () => {
    const namespace = new FakeNamespace();

    const runtime = {
      async runPythonAsync() {
        namespace.set(CHART_VARIABLE, "a".repeat(4_000_001));
      },
    };

    await expect(captureChart(runtime, namespace)).rejects.toThrow(
      "El gráfico generado supera el tamaño máximo permitido.",
    );

    expect(namespace.has(CHART_VARIABLE)).toBe(false);
  });

  it("limpia la variable si falla la captura", async () => {
    const namespace = new FakeNamespace();

    namespace.set(CHART_VARIABLE, "anterior");

    const runtime = {
      async runPythonAsync() {
        throw new Error("No se pudo crear el PNG");
      },
    };

    await expect(captureChart(runtime, namespace)).rejects.toThrow(
      "No se pudo crear el PNG",
    );

    expect(namespace.has(CHART_VARIABLE)).toBe(false);
  });
});
