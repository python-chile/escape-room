import type { PythonEditorElements } from "./dom";
import type { PythonEditorUi } from "./ui";

export function selectPythonTerminalTab(
  elements: PythonEditorElements,
  selectedTab: string,
) {
  elements.terminalTabs.forEach((tab) => {
    const isSelected = tab.dataset.pythonTerminalTab === selectedTab;

    tab.dataset.active = String(isSelected);

    tab.setAttribute("aria-selected", String(isSelected));

    tab.tabIndex = isSelected ? 0 : -1;
  });

  elements.terminalPanels.forEach((panel) => {
    panel.hidden = panel.dataset.pythonTerminalPanel !== selectedTab;
  });
}

export function initializePythonTerminal(
  elements: PythonEditorElements,
  ui: PythonEditorUi,
) {
  let previousDocumentOverflow = "";

  function setTerminalCollapsed(collapsed: boolean) {
    elements.results.dataset.collapsed = String(collapsed);

    elements.terminalContent.hidden = collapsed;

    elements.terminalToggle.setAttribute("aria-expanded", String(!collapsed));

    const label = collapsed
      ? "Expandir contenido de la terminal"
      : "Contraer terminal";

    elements.terminalToggle.setAttribute("aria-label", label);

    elements.terminalToggle.title = label;
  }

  function setEditorExpanded(expanded: boolean) {
    elements.editorShell.dataset.expanded = String(expanded);

    elements.editorExpand.setAttribute("aria-pressed", String(expanded));

    const label = expanded ? "Restaurar editor" : "Ampliar editor";

    elements.editorExpand.setAttribute("aria-label", label);

    elements.editorExpand.title = label;

    if (expanded) {
      previousDocumentOverflow = document.documentElement.style.overflow;

      document.documentElement.style.overflow = "hidden";

      setTerminalCollapsed(false);
    } else {
      document.documentElement.style.overflow = previousDocumentOverflow;
    }

    window.dispatchEvent(new Event("resize"));
  }

  elements.terminalTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      selectPythonTerminalTab(
        elements,
        tab.dataset.pythonTerminalTab ?? "output",
      );
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      const visibleTabs = elements.terminalTabs.filter(
        (terminalTab) => !terminalTab.hidden,
      );

      const currentIndex = visibleTabs.indexOf(tab);

      if (currentIndex === -1) {
        return;
      }

      const direction = event.key === "ArrowRight" ? 1 : -1;

      const nextIndex =
        (currentIndex + direction + visibleTabs.length) % visibleTabs.length;

      const nextTab = visibleTabs[nextIndex];

      if (!nextTab) {
        return;
      }

      event.preventDefault();

      selectPythonTerminalTab(
        elements,
        nextTab.dataset.pythonTerminalTab ?? "output",
      );

      nextTab.focus();
    });
  });

  elements.terminalToggle.addEventListener("click", () => {
    const collapsed = elements.results.dataset.collapsed === "true";

    setTerminalCollapsed(!collapsed);
  });

  elements.editorExpand.addEventListener("click", () => {
    const expanded = elements.editorShell.dataset.expanded === "true";

    setEditorExpanded(!expanded);
  });

  elements.clearTerminal.addEventListener("click", () => {
    ui.clearTerminal();
  });

  elements.errorHelpClose.addEventListener("click", () => {
    elements.errorHelp.hidden = true;
  });

  elements.chartExpand.addEventListener("click", () => {
    if (typeof elements.chartDialog.showModal === "function") {
      elements.chartDialog.showModal();
    }
  });

  elements.chartDialogClose.addEventListener("click", () => {
    elements.chartDialog.close();
  });

  elements.chartDialog.addEventListener("click", (event) => {
    if (event.target === elements.chartDialog) {
      elements.chartDialog.close();
    }
  });

  elements.chartDownload.addEventListener("click", () => {
    if (!elements.chart.src) {
      return;
    }

    const link = document.createElement("a");

    link.href = elements.chart.src;
    link.download = "grafico-pyschool.png";
    link.click();
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key !== "Escape" ||
      elements.editorShell.dataset.expanded !== "true" ||
      elements.chartDialog.open
    ) {
      return;
    }

    setEditorExpanded(false);
    elements.editorExpand.focus();
  });

  selectPythonTerminalTab(elements, "output");
  setTerminalCollapsed(false);
  setEditorExpanded(false);
}
