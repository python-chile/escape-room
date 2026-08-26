import { test } from "@playwright/test";

import { runChallenge } from "./challenges/helpers";
import { spaceStationChallenges } from "./challenges/space-station";

test.describe("Estación espacial", () => {
  for (const challenge of spaceStationChallenges) {
    test(challenge.title, async ({ page }) => {
      await runChallenge(page, challenge);
    });
  }
});
