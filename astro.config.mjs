import { fileURLToPath } from "node:url";

import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

export default defineConfig({
  site: isGitHubPages ? "https://ale0aranda.github.io" : undefined,
  base: isGitHubPages ? "/scape-room" : undefined,

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
