import { test } from "@playwright/test";

import { runChallenge } from "./challenges/helpers";
import { oakChallenges } from "./challenges/lab-oak";

test.describe("Laboratorio Oak", () => {
  for (const challenge of oakChallenges) {
    test(challenge.title, async ({ page }) => {
      await runChallenge(page, challenge);
    });
  }
});
