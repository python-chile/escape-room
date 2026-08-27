import type { User } from "@supabase/supabase-js";

import { withBase } from "@/lib/paths";
import { syncProgressWithCloud } from "@/lib/progress";
import { supabase } from "@/lib/supabase";

type AuthElements = {
  loginButton: HTMLButtonElement | null;
  accountLink: HTMLAnchorElement | null;
  avatar: HTMLImageElement | null;
  name: HTMLElement | null;
};

function getCallbackUrl() {
  return new URL(withBase("/auth/callback"), window.location.origin).toString();
}

function getElements(root: HTMLElement): AuthElements {
  return {
    loginButton: root.querySelector<HTMLButtonElement>("[data-github-login]"),
    accountLink: root.querySelector<HTMLAnchorElement>("[data-github-account]"),
    avatar: root.querySelector<HTMLImageElement>("[data-github-avatar]"),
    name: root.querySelector<HTMLElement>("[data-github-name]"),
  };
}

function getUserName(user: User) {
  const { user_name, preferred_username, name } = user.user_metadata;

  return (
    [user_name, preferred_username, name, user.email].find(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    ) ?? "Cuenta GitHub"
  );
}

function renderUser(root: HTMLElement, user?: User) {
  const { loginButton, accountLink, avatar, name } = getElements(root);

  if (!loginButton || !accountLink || !avatar || !name) {
    return;
  }

  loginButton.hidden = Boolean(user);
  accountLink.hidden = !user;

  if (!user) {
    return;
  }

  const avatarUrl = user.user_metadata.avatar_url;

  if (typeof avatarUrl === "string") {
    avatar.src = avatarUrl;
  }

  name.textContent = getUserName(user);
}

async function renderSession(root: HTMLElement) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  renderUser(root, session?.user);
}

async function signIn() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: getCallbackUrl(),
    },
  });

  if (error) {
    console.error("No fue posible iniciar sesión con GitHub:", error.message);
  }
}

export function initializeGitHubAuth() {
  const authRoots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-github-auth]"),
  );

  if (authRoots.length === 0) {
    return;
  }

  authRoots.forEach((root) => {
    const { loginButton } = getElements(root);

    loginButton?.addEventListener("click", () => {
      void signIn();
    });

    void renderSession(root);
  });

  supabase.auth.onAuthStateChange((event, session) => {
    authRoots.forEach((root) => {
      renderUser(root, session?.user);
    });

    if (event === "SIGNED_IN") {
      void syncProgressWithCloud();
    }
  });

  void syncProgressWithCloud();
}
