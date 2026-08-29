export const MAX_OUTPUT_LENGTH = 12_000;

const TRUNCATION_NOTICE = "… salida truncada";

export function send(message) {
  globalThis.postMessage(message);
}

export function appendOutput(current, value) {
  const nextOutput = `${current}${value}\n`;

  if (nextOutput.length <= MAX_OUTPUT_LENGTH) {
    return nextOutput;
  }

  const truncatedOutput = nextOutput.slice(0, MAX_OUTPUT_LENGTH);

  return `${truncatedOutput}\n${TRUNCATION_NOTICE}`;
}
