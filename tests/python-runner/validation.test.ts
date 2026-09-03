import { describe, expect, it } from "vitest";

import { validateChallenge } from "../../scripts/python-runner/validation.js";

type NamespaceValue = unknown;

class FakeNamespace {
  readonly values = new Map<string, NamespaceValue>();

  has(name: string): boolean {
    return this.values.has(name);
  }

  get(name: string): NamespaceValue {
    return this.values.get(name);
  }

  set(name: string, value: NamespaceValue): void {
    this.values.set(name, value);
  }

  delete(name: string): boolean {
    return this.values.delete(name);
  }
}

function createNamespace(
  values: Record<string, NamespaceValue> = {},
): FakeNamespace {
  const namespace = new FakeNamespace();

  Object.entries(values).forEach(([name, value]) => {
    namespace.set(name, value);
  });

  return namespace;
}

const messages = {
  successMessage: "Respuesta correcta",
  errorMessage: "Respuesta incorrecta",
};

describe("validateChallenge", () => {
  it("retorna null cuando no existe desafío", async () => {
    const result = await validateChallenge({}, createNamespace(), undefined);

    expect(result).toBeNull();
  });

  it("acepta un valor exactamente igual", async () => {
    const namespace = createNamespace({
      respuesta: "Cerrar",
    });

    const result = await validateChallenge({}, namespace, {
      ...messages,
      type: "equals",
      variable: "respuesta",
      expected: "Cerrar",
    });

    expect(result).toEqual({
      passed: true,
      feedback: messages.successMessage,
    });
  });

  it("respeta el tipo del valor esperado", async () => {
    const namespace = createNamespace({
      respuesta: "10",
    });

    const result = await validateChallenge({}, namespace, {
      ...messages,
      type: "equals",
      variable: "respuesta",
      expected: 10,
    });

    expect(result).toEqual({
      passed: false,
      feedback: messages.errorMessage,
    });
  });

  it("informa cuando falta una variable", async () => {
    const result = await validateChallenge({}, createNamespace(), {
      ...messages,
      type: "equals",
      variable: "respuesta",
      expected: "Cerrar",
    });

    expect(result).toEqual({
      passed: false,
      feedback: 'Define la variable "respuesta" e inténtalo nuevamente.',
    });
  });

  it("utiliza el mensaje incompleto personalizado", async () => {
    const result = await validateChallenge({}, createNamespace(), {
      ...messages,
      type: "number",
      variable: "total",
      expected: 10,
      incompleteMessage: "Todavía falta total.",
    });

    expect(result).toEqual({
      passed: false,
      feedback: "Todavía falta total.",
    });
  });

  it("acepta una diferencia igual a la tolerancia", async () => {
    const namespace = createNamespace({
      resultado: 10.1,
    });

    const result = await validateChallenge({}, namespace, {
      ...messages,
      type: "number",
      variable: "resultado",
      expected: 10,
      tolerance: 0.1,
    });

    expect(result).toEqual({
      passed: true,
      feedback: messages.successMessage,
    });
  });

  it("acepta igualdad exacta con tolerancia cero", async () => {
    const namespace = createNamespace({
      resultado: 10,
    });

    const result = await validateChallenge({}, namespace, {
      ...messages,
      type: "number",
      variable: "resultado",
      expected: 10,
      tolerance: 0,
    });

    expect(result?.passed).toBe(true);
  });

  it("rechaza valores numéricos no finitos", async () => {
    const namespace = createNamespace({
      resultado: Number.POSITIVE_INFINITY,
    });

    const result = await validateChallenge({}, namespace, {
      ...messages,
      type: "number",
      variable: "resultado",
      expected: 10,
    });

    expect(result?.passed).toBe(false);
  });

  it("rechaza una tolerancia negativa", async () => {
    const namespace = createNamespace({
      resultado: 10,
    });

    await expect(
      validateChallenge({}, namespace, {
        ...messages,
        type: "number",
        variable: "resultado",
        expected: 10,
        tolerance: -1,
      }),
    ).rejects.toThrow("La tolerancia del desafío no es válida.");
  });

  it("ejecuta un validador Python personalizado", async () => {
    const namespace = createNamespace();

    const runtime = {
      async runPythonAsync() {
        namespace.set("__pyschool_validated", true);

        namespace.set("__pyschool_feedback", "Validación personalizada");
      },
    };

    const result = await validateChallenge(runtime, namespace, {
      ...messages,
      type: "python",
      validator: "validar()",
    });

    expect(result).toEqual({
      passed: true,
      feedback: "Validación personalizada",
    });

    expect(namespace.has("__pyschool_validated")).toBe(false);

    expect(namespace.has("__pyschool_feedback")).toBe(false);
  });

  it("limpia variables internas si el validador falla", async () => {
    const namespace = createNamespace();

    const runtime = {
      async runPythonAsync() {
        throw new Error("Validador roto");
      },
    };

    await expect(
      validateChallenge(runtime, namespace, {
        ...messages,
        type: "python",
        validator: "código inválido",
      }),
    ).rejects.toThrow("Validador roto");

    expect(namespace.has("__pyschool_validated")).toBe(false);

    expect(namespace.has("__pyschool_feedback")).toBe(false);
  });
});
