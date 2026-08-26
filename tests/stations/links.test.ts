import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  getMdxFiles,
  getRoomPath,
  getStationFilePath,
  stations,
} from "./helpers";

describe("enlaces entre habitaciones", () => {
  for (const station of stations) {
    describe(station.name, () => {
      it("no deja enlaces successHref que conduzcan a un 404", () => {
        const files = getMdxFiles(station);

        const validPaths = new Set(
          files.map((fileName) => getRoomPath(station, fileName)),
        );

        for (const fileName of files) {
          const filePath = getStationFilePath(station, fileName);
          const content = readFileSync(filePath, "utf8");

          const successLinks = [
            ...content.matchAll(/successHref:\s*"([^"]+)"/g),
          ].map((match) => match[1]);

          for (const successHref of successLinks) {
            expect(
              validPaths,
              `${fileName} apunta a una ruta inexistente: ${successHref}`,
            ).toContain(successHref);
          }
        }
      });
    });
  }
});
