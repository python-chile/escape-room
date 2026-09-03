export const MAX_OUTPUT_LENGTH = 12_000;

const TRUNCATION_NOTICE = "\n… salida truncada";

export function send(message) {
  globalThis.postMessage(message);
}

export function appendOutput(current, value) {
  if (current.endsWith(TRUNCATION_NOTICE)) {
    return current;
  }

  const availableLength = MAX_OUTPUT_LENGTH - current.length;

  if (availableLength <= 0) {
    return `${current.slice(0, MAX_OUTPUT_LENGTH)}${TRUNCATION_NOTICE}`;
  }

  const normalizedValue = `${String(value)}\n`;

  if (normalizedValue.length <= availableLength) {
    return current + normalizedValue;
  }

  return (
    current + normalizedValue.slice(0, availableLength) + TRUNCATION_NOTICE
  );
}
