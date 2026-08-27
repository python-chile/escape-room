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

async function renderSession(root: HTMLElement) {
  const { loginButton, accountLink, avatar, name } = getElements(root);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user || !loginButton || !accountLink || !avatar || !name) {
    loginButton?.removeAttribute("hidden");
    accountLink?.setAttribute("hidden", "");
    return;
  }

  const metadata = user.user_metadata;

  const userName =
    metadata.user_name ||
    metadata.preferred_username ||
    metadata.name ||
    user.email ||
    "Cuenta GitHub";

  avatar.src = metadata.avatar_url || "";
  name.textContent = userName;

  loginButton.hidden = true;
  accountLink.hidden = false;
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
  const authRoots = [
    ...document.querySelectorAll<HTMLElement>("[data-github-auth]"),
  ];

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

  supabase.auth.onAuthStateChange((event) => {
    authRoots.forEach((root) => {
      void renderSession(root);
    });

    if (event === "SIGNED_IN") {
      void syncProgressWithCloud();
    }
  });

  void syncProgressWithCloud();
}
