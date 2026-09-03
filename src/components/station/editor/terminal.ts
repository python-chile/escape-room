import type { PythonEditorElements } from "./dom";
import type { PythonEditorUi } from "./ui";

const TERMINAL_TABS = ["output", "chart", "logs", "hints"] as const;

export type PythonTerminalTab = (typeof TERMINAL_TABS)[number];

type PythonTerminalOptions = {
  onLayoutChange?: () => void;
};

export type PythonTerminalController = {
  destroy: () => void;
};

function isPythonTerminalTab(
  value: string | undefined,
): value is PythonTerminalTab {
  return value !== undefined && TERMINAL_TABS.some((tab) => tab === value);
}

function getTerminalTab(tab: HTMLButtonElement): PythonTerminalTab {
  const value = tab.dataset.pythonTerminalTab;

  if (!isPythonTerminalTab(value)) {
    throw new Error(`Pestaña de terminal desconocida: ${String(value)}`);
  }

  return value;
}

export function selectPythonTerminalTab(
  elements: PythonEditorElements,
  selectedTab: PythonTerminalTab,
): void {
  elements.terminalTabs.forEach((tab) => {
    const isSelected = getTerminalTab(tab) === selectedTab;

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
  { onLayoutChange }: PythonTerminalOptions = {},
): PythonTerminalController {
  const listeners = new AbortController();

  let previousDocumentOverflow = "";
  let editorExpanded = false;

  function notifyLayoutChange(): void {
    if (!onLayoutChange) {
      return;
    }

    window.requestAnimationFrame(() => {
      onLayoutChange();
    });
  }

  function setTerminalCollapsed(collapsed: boolean): void {
    elements.results.dataset.collapsed = String(collapsed);

    elements.terminalContent.hidden = collapsed;

    elements.terminalToggle.setAttribute("aria-expanded", String(!collapsed));

    const label = collapsed
      ? "Expandir contenido de la terminal"
      : "Contraer terminal";

    elements.terminalToggle.setAttribute("aria-label", label);

    elements.terminalToggle.title = label;

    notifyLayoutChange();
  }

  function restoreDocumentOverflow(): void {
    document.documentElement.style.overflow = previousDocumentOverflow;
  }

  function setEditorExpanded(expanded: boolean): void {
    if (expanded === editorExpanded) {
      return;
    }

    if (expanded) {
      previousDocumentOverflow = document.documentElement.style.overflow;

      document.documentElement.style.overflow = "hidden";
    } else {
      restoreDocumentOverflow();
    }

    editorExpanded = expanded;

    elements.editorShell.dataset.expanded = String(expanded);

    elements.editorExpand.removeAttribute("aria-pressed");

    elements.editorExpand.setAttribute("aria-expanded", String(expanded));

    const label = expanded ? "Restaurar editor" : "Ampliar editor";

    elements.editorExpand.setAttribute("aria-label", label);

    elements.editorExpand.title = label;

    if (expanded) {
      setTerminalCollapsed(false);
    }

    notifyLayoutChange();
  }

  function getVisibleTerminalTabs(): HTMLButtonElement[] {
    return elements.terminalTabs.filter((tab) => !tab.hidden);
  }

  function handleTerminalTabKeydown(
    event: KeyboardEvent,
    currentTab: HTMLButtonElement,
  ): void {
    const visibleTabs = getVisibleTerminalTabs();

    if (visibleTabs.length === 0) {
      return;
    }

    const currentIndex = visibleTabs.indexOf(currentTab);

    if (currentIndex === -1) {
      return;
    }

    let nextIndex: number | undefined;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % visibleTabs.length;
        break;

      case "ArrowLeft":
        nextIndex =
          (currentIndex - 1 + visibleTabs.length) % visibleTabs.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = visibleTabs.length - 1;
        break;

      default:
        return;
    }

    const nextTab = visibleTabs[nextIndex];

    if (!nextTab) {
      return;
    }

    event.preventDefault();

    selectPythonTerminalTab(elements, getTerminalTab(nextTab));

    nextTab.focus();
  }

  elements.terminalTabs.forEach((tab) => {
    tab.addEventListener(
      "click",
      () => {
        selectPythonTerminalTab(elements, getTerminalTab(tab));
      },
      {
        signal: listeners.signal,
      },
    );

    tab.addEventListener(
      "keydown",
      (event) => {
        handleTerminalTabKeydown(event, tab);
      },
      {
        signal: listeners.signal,
      },
    );
  });

  elements.terminalToggle.addEventListener(
    "click",
    () => {
      const collapsed = elements.results.dataset.collapsed === "true";

      setTerminalCollapsed(!collapsed);
    },
    {
      signal: listeners.signal,
    },
  );

  elements.editorExpand.addEventListener(
    "click",
    () => {
      setEditorExpanded(!editorExpanded);
    },
    {
      signal: listeners.signal,
    },
  );

  elements.clearTerminal.addEventListener(
    "click",
    () => {
      ui.clearTerminal();
    },
    {
      signal: listeners.signal,
    },
  );

  elements.errorHelpClose.addEventListener(
    "click",
    () => {
      elements.errorHelp.hidden = true;
    },
    {
      signal: listeners.signal,
    },
  );

  elements.chartExpand.addEventListener(
    "click",
    () => {
      if (
        !elements.chart.hasAttribute("src") ||
        typeof elements.chartDialog.showModal !== "function"
      ) {
        return;
      }

      elements.chartDialog.showModal();
    },
    {
      signal: listeners.signal,
    },
  );

  elements.chartDialogClose.addEventListener(
    "click",
    () => {
      elements.chartDialog.close();
    },
    {
      signal: listeners.signal,
    },
  );

  elements.chartDialog.addEventListener(
    "click",
    (event) => {
      if (event.target === elements.chartDialog) {
        elements.chartDialog.close();
      }
    },
    {
      signal: listeners.signal,
    },
  );

  elements.chartDownload.addEventListener(
    "click",
    () => {
      if (!elements.chart.hasAttribute("src")) {
        return;
      }

      const link = document.createElement("a");

      link.href = elements.chart.src;
      link.download = "grafico-pyschool.png";

      link.click();
    },
    {
      signal: listeners.signal,
    },
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key !== "Escape" ||
        !editorExpanded ||
        elements.chartDialog.open
      ) {
        return;
      }

      setEditorExpanded(false);
      elements.editorExpand.focus();
    },
    {
      signal: listeners.signal,
    },
  );

  selectPythonTerminalTab(elements, "output");
  setTerminalCollapsed(false);

  elements.editorShell.dataset.expanded = "false";

  elements.editorExpand.removeAttribute("aria-pressed");

  elements.editorExpand.setAttribute("aria-expanded", "false");

  return {
    destroy() {
      listeners.abort();

      if (elements.chartDialog.open) {
        elements.chartDialog.close();
      }

      if (editorExpanded) {
        editorExpanded = false;
        restoreDocumentOverflow();
      }
    },
  };
}
