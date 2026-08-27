import { withBase } from "@/lib/paths";
import { getCompletedRooms, syncProgressWithCloud } from "@/lib/progress";
import { supabase } from "@/lib/supabase";

function getElements(root: HTMLElement) {
  return {
    avatar: root.querySelector<HTMLImageElement>("[data-account-avatar]"),
    name: root.querySelector<HTMLElement>("[data-account-name]"),
    total: root.querySelector<HTMLElement>("[data-account-total]"),
    available: root.querySelector<HTMLElement>("[data-account-available]"),
    logoutButton: root.querySelector<HTMLButtonElement>(
      "[data-account-logout]",
    ),
  };
}

function renderProgress(root: HTMLElement) {
  const completedRooms = getCompletedRooms();

  let completedCount = 0;
  let availableCount = 0;

  root
    .querySelectorAll<HTMLElement>("[data-account-station]")
    .forEach((station) => {
      const rooms = JSON.parse(
        station.dataset.roomPaths ?? "[]",
      ) as string[];

      const completed = rooms.filter((room) =>
        completedRooms.has(room),
      ).length;

      const count = station.querySelector<HTMLElement>(
        "[data-station-completed]",
      );

      const bar = station.querySelector<HTMLElement>(
        "[data-station-progress]",
      );

      if (count) {
        count.textContent = String(completed);
      }

      if (bar) {
        const percentage =
          rooms.length === 0 ? 0 : (completed / rooms.length) * 100;

        bar.style.width = `${percentage}%`;
      }

      completedCount += completed;
      availableCount += rooms.length;
    });

  const { total, available } = getElements(root);

  if (total) {
    total.textContent = String(completedCount);
  }

  if (available) {
    available.textContent = String(availableCount);
  }
}

async function renderAccount(root: HTMLElement) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user) {
    window.location.replace(withBase("/"));
    return;
  }

  const { avatar, name } = getElements(root);
  const metadata = user.user_metadata;

  const userName =
    metadata.user_name ||
    metadata.preferred_username ||
    metadata.name ||
    user.email ||
    "Cuenta GitHub";

  if (avatar) {
    avatar.src = metadata.avatar_url || "";
  }

  if (name) {
    name.textContent = userName;
  }
}

function initializeAccount(root: HTMLElement) {
  const { logoutButton } = getElements(root);

  logoutButton?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.replace(withBase("/"));
  });

  window.addEventListener("pyschool-progress-change", () => {
    renderProgress(root);
  });

  renderProgress(root);
  void renderAccount(root);

  void syncProgressWithCloud().finally(() => {
    renderProgress(root);
  });
}

export function initializeAccountPages() {
  document
    .querySelectorAll<HTMLElement>("[data-account]")
    .forEach(initializeAccount);
}
