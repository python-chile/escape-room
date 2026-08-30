import process from "node:process";
import { fileURLToPath, URL } from "node:url";

import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

const deploymentConfig = isGitHubPages
  ? {
      site: "https://python-chile.github.io",
      base: "/escape-room",
    }
  : {};

export default defineConfig({
  ...deploymentConfig,
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
