import { describe, expect, it } from "vitest";

import { getMdxFiles, getRoomPath, stations } from "./helpers";

describe("navegación de estaciones", () => {
  for (const station of stations) {
    describe(station.name, () => {
      const files = getMdxFiles(station);

      it("incluye una bienvenida", () => {
        expect(files).toContain("welcome.mdx");
      });

      it("no tiene rutas del menú sin habitación", () => {
        const availablePaths = files.map((fileName) =>
          getRoomPath(station, fileName),
        );

        for (const item of station.navigation) {
          if (!item.href) {
            continue;
          }

          expect(
            availablePaths,
            `${item.label} apunta a una habitación inexistente: ${item.href}`,
          ).toContain(item.href);
        }
      });

      it("incluye todas las habitaciones dentro del menú", () => {
        const navigationPaths = station.navigation
          .map((item) => item.href)
          .filter((href): href is string => Boolean(href));

        for (const fileName of files) {
          const roomPath = getRoomPath(station, fileName);

          expect(
            navigationPaths,
            `${fileName} existe, pero no aparece en la navegación`,
          ).toContain(roomPath);
        }
      });
    });
  }
});
