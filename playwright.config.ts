import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),

  use: {
    baseURL: "http://127.0.0.1:4321",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  webServer: {
    command: "pnpm dev --host 127.0.0.1",
    url: "http://127.0.0.1:4321",
    timeout: 30_000,
    reuseExistingServer: !process.env.CI,
  },
});
