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
        try:
            with io.BytesIO() as buffer:
                plt.savefig(
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

export async function captureChart(runtime) {
  await runtime.runPythonAsync(CAPTURE_CHART_SCRIPT);

  try {
    const chart = readVariable(runtime, CHART_VARIABLE);

    return String(chart.value ?? "");
  } finally {
    runtime.globals.delete(CHART_VARIABLE);
  }
}
