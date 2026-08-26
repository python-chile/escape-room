export const MAX_OUTPUT_LENGTH = 12_000;

export function send(message) {
  window.parent.postMessage(message, "*");
}

export function appendOutput(current, value) {
  const next = `${current}${value}\n`;

  if (next.length <= MAX_OUTPUT_LENGTH) {
    return next;
  }

  return `${next.slice(0, MAX_OUTPUT_LENGTH)}\n… salida truncada`;
}
