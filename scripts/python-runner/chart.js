import { readVariable } from "./runtime.js";

const CHART_VARIABLE = "__pyschool_chart";

const CAPTURE_CHART_SCRIPT = `
import base64
import io
import sys

${CHART_VARIABLE} = ""

if "matplotlib.pyplot" in sys.modules:
    import matplotlib.pyplot as plt

    if plt.get_fignums():
        figure = plt.gcf()

        try:
            with io.BytesIO() as buffer:
                figure.savefig(
                    buffer,
                    format="png",
                    bbox_inches="tight",
                )

                ${CHART_VARIABLE} = base64.b64encode(
                    buffer.getvalue()
                ).decode("ascii")
        finally:
            plt.close("all")
`;

export async function captureChart(runtime, namespace) {
  await runtime.runPythonAsync(CAPTURE_CHART_SCRIPT, {
    globals: namespace,
  });

  try {
    const chart = readVariable(namespace, CHART_VARIABLE);

    return String(chart.value ?? "");
  } finally {
    namespace.delete(CHART_VARIABLE);
  }
}
