import { describe, expect, it } from "vitest";

import { isRunnerMessage } from "@/components/station/editor/protocol";

describe("isRunnerMessage", () => {
  it("acepta el mensaje de runner preparado", () => {
    expect(
      isRunnerMessage({
        type: "python-runner-ready",
      }),
    ).toBe(true);
  });

  it("acepta el inicio de una ejecución", () => {
    expect(
      isRunnerMessage({
        type: "python-execution-started",
        requestId: "request-1",
      }),
    ).toBe(true);
  });

  it("acepta un resultado correcto", () => {
    expect(
      isRunnerMessage({
        type: "python-result",
        requestId: "request-1",
        output: "Hola\n",
        status: "success",
        validation: {
          passed: true,
          feedback: "Correcto",
        },
      }),
    ).toBe(true);
  });

  it("acepta un gráfico codificado", () => {
    expect(
      isRunnerMessage({
        type: "python-result",
        requestId: "request-1",
        output: "",
        status: "success",
        chart: "aW1hZ2Vu",
      }),
    ).toBe(true);
  });

  it.each([
    null,
    undefined,
    "mensaje",
    {},
    {
      type: "desconocido",
    },
    {
      type: "python-execution-started",
    },
    {
      type: "python-result",
      requestId: 123,
      output: "",
      status: "success",
    },
    {
      type: "python-result",
      requestId: "request-1",
      output: 123,
      status: "success",
    },
    {
      type: "python-result",
      requestId: "request-1",
      output: "",
      status: "desconocido",
    },
    {
      type: "python-result",
      requestId: "request-1",
      output: "",
      status: "success",
      validation: {
        passed: "sí",
        feedback: "Correcto",
      },
    },
  ])("rechaza un mensaje inválido: %j", (message) => {
    expect(isRunnerMessage(message)).toBe(false);
  });
});
