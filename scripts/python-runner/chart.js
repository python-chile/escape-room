import { readVariable } from "./runtime.js";

export async function captureChart(runtime) {
  await runtime.runPythonAsync(`
import base64
import io
import sys

__pyschool_chart = ""

if "matplotlib.pyplot" in sys.modules:
    import matplotlib.pyplot as plt

    if plt.get_fignums():
        buffer = io.BytesIO()
        plt.savefig(buffer, format="png", bbox_inches="tight")
        __pyschool_chart = base64.b64encode(
            buffer.getvalue()
        ).decode("ascii")
        plt.close("all")
`);

  return String(
    readVariable(runtime, "__pyschool_chart").value ?? "",
  );
}
