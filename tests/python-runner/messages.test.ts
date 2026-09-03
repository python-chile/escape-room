import { describe, expect, it } from "vitest";

import {
  appendOutput,
  MAX_OUTPUT_LENGTH,
} from "../../scripts/python-runner/messages.js";

describe("appendOutput", () => {
  it("agrega un salto de línea a cada mensaje", () => {
    expect(appendOutput("", "Hola")).toBe("Hola\n");
  });

  it("acumula distintos mensajes", () => {
    let output = "";

    output = appendOutput(output, "primero");
    output = appendOutput(output, "segundo");

    expect(output).toBe("primero\nsegundo\n");
  });

  it("conserva una salida dentro del límite", () => {
    const value = "a".repeat(MAX_OUTPUT_LENGTH - 1);

    const output = appendOutput("", value);

    expect(output).toHaveLength(MAX_OUTPUT_LENGTH);
    expect(output).not.toContain("… salida truncada");
  });

  it("trunca una salida que supera el límite", () => {
    const value = "a".repeat(MAX_OUTPUT_LENGTH + 1_000);

    const output = appendOutput("", value);

    expect(output).toContain("… salida truncada");
    expect(output.startsWith("a")).toBe(true);
  });

  it("no continúa creciendo después de truncarse", () => {
    const truncated = appendOutput("", "a".repeat(MAX_OUTPUT_LENGTH + 1_000));

    const nextOutput = appendOutput(truncated, "este texto no debe agregarse");

    expect(nextOutput).toBe(truncated);
    expect(nextOutput).not.toContain("este texto no debe agregarse");
  });

  it("trunca una salida previamente acumulada", () => {
    let output = appendOutput("", "a".repeat(MAX_OUTPUT_LENGTH - 10));

    output = appendOutput(output, "contenido adicional");

    expect(output).toContain("… salida truncada");
    expect(output).not.toContain("contenido adicional");
  });
});
