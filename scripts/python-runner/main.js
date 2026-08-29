/* global Blob, URL, Worker, document, window */

const workerSourceElement = document.querySelector(
  "[data-python-worker-source]",
);

if (!workerSourceElement || workerSourceElement.tagName !== "SCRIPT") {
  throw new Error("No se encontró el código del Python Worker.");
}

const workerBlob = new Blob([workerSourceElement.textContent ?? ""], {
  type: "text/javascript",
});

const workerUrl = URL.createObjectURL(workerBlob);
const worker = new Worker(workerUrl);

let activeRequestId;
let workerReady = false;
let workerUrlRevoked = false;

function revokeWorkerUrl() {
  if (workerUrlRevoked) {
    return;
  }

  URL.revokeObjectURL(workerUrl);
  workerUrlRevoked = true;
}

function sendToParent(message) {
  window.parent.postMessage(message, "*");
}

function isParentMessage(message) {
  return (
    typeof message === "object" &&
    message !== null &&
    typeof message.type === "string"
  );
}

function isRunPythonMessage(message) {
  return (
    isParentMessage(message) &&
    message.type === "run-python" &&
    typeof message.requestId === "string" &&
    typeof message.code === "string"
  );
}

function isWorkerMessage(message) {
  if (!isParentMessage(message)) {
    return false;
  }

  if (message.type === "python-runner-ready") {
    return true;
  }

  if (
    message.type === "python-execution-started" &&
    typeof message.requestId === "string"
  ) {
    return true;
  }

  return (
    message.type === "python-result" &&
    typeof message.requestId === "string" &&
    typeof message.output === "string" &&
    (message.status === "success" || message.status === "error")
  );
}

function handleParentMessage(event) {
  if (event.source !== window.parent || !isParentMessage(event.data)) {
    return;
  }

  const message = event.data;

  if (message.type === "python-parent-ready") {
    if (workerReady) {
      sendToParent({
        type: "python-runner-ready",
      });
    }

    return;
  }

  if (!isRunPythonMessage(message) || activeRequestId) {
    return;
  }

  activeRequestId = message.requestId;
  worker.postMessage(message);
}

function handleWorkerMessage(event) {
  if (!isWorkerMessage(event.data)) {
    return;
  }

  const message = event.data;

  if (message.type === "python-runner-ready") {
    workerReady = true;
    revokeWorkerUrl();
    sendToParent(message);

    return;
  }

  if (message.requestId !== activeRequestId) {
    return;
  }

  if (message.type === "python-result") {
    activeRequestId = undefined;
  }

  sendToParent(message);
}

function handleWorkerError() {
  revokeWorkerUrl();

  if (!activeRequestId) {
    return;
  }

  sendToParent({
    type: "python-result",
    requestId: activeRequestId,
    output: "El entorno Python se detuvo inesperadamente.",
    status: "error",
  });

  activeRequestId = undefined;
}

window.addEventListener("message", handleParentMessage);
worker.addEventListener("message", handleWorkerMessage);
worker.addEventListener("error", handleWorkerError);
worker.addEventListener("messageerror", handleWorkerError);

window.addEventListener(
  "pagehide",
  () => {
    worker.terminate();
    revokeWorkerUrl();
  },
  {
    once: true,
  },
);
