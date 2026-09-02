const SWITCHER_SELECTOR = "[data-mission-switcher]";
const CLOSE_SELECTOR = "[data-mission-close]";

let isInitialized = false;

function getSwitchers() {
  return Array.from(
    document.querySelectorAll<HTMLDetailsElement>(SWITCHER_SELECTOR),
  );
}

function closeSwitcher(switcher: HTMLDetailsElement, restoreFocus = false) {
  if (!switcher.open) {
    return;
  }

  switcher.open = false;

  if (restoreFocus) {
    switcher.querySelector<HTMLElement>("summary")?.focus();
  }
}

function closeOtherSwitchers(currentSwitcher: HTMLDetailsElement) {
  getSwitchers().forEach((switcher) => {
    if (switcher !== currentSwitcher) {
      closeSwitcher(switcher);
    }
  });
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const closeButton = target.closest(CLOSE_SELECTOR);

  if (closeButton) {
    const switcher = closeButton.closest<HTMLDetailsElement>(SWITCHER_SELECTOR);

    if (switcher) {
      closeSwitcher(switcher, true);
    }

    return;
  }

  getSwitchers().forEach((switcher) => {
    if (!switcher.contains(target)) {
      closeSwitcher(switcher);
    }
  });
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape") {
    return;
  }

  const openSwitcher = getSwitchers().find((switcher) => switcher.open);

  if (openSwitcher) {
    closeSwitcher(openSwitcher, true);
  }
}

function handleSwitcherToggle(event: Event) {
  const switcher = event.target;

  if (
    !(switcher instanceof HTMLDetailsElement) ||
    !switcher.matches(SWITCHER_SELECTOR) ||
    !switcher.open
  ) {
    return;
  }

  closeOtherSwitchers(switcher);
}

export function initializeMissionSwitchers() {
  if (isInitialized) {
    return;
  }

  isInitialized = true;

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleDocumentKeydown);

  document.addEventListener("toggle", handleSwitcherToggle, true);
}
