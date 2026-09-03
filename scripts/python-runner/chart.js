import { readVariable } from "./runtime.js";

const CHART_VARIABLE = "__pyschool_chart";

const MAX_CHART_BASE64_LENGTH = 4_000_000;

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
            figure.set_size_inches(10, 6, forward=True)

            with io.BytesIO() as buffer:
                figure.savefig(
                    buffer,
                    format="png",
                    dpi=100,
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

    const encodedChart = String(chart.value ?? "");

    if (!encodedChart) {
      return undefined;
    }

    if (encodedChart.length > MAX_CHART_BASE64_LENGTH) {
      throw new Error("El gráfico generado supera el tamaño máximo permitido.");
    }

    return encodedChart;
  } finally {
    namespace.delete(CHART_VARIABLE);
  }
}
