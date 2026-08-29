import { describe, expect, it } from "vitest";

import { getMdxFiles, getRoomPath, stations } from "./helpers";

describe("navegación de estaciones", () => {
  for (const station of stations) {
    describe(station.name, () => {
      const files = getMdxFiles(station);

      it("incluye una bienvenida", () => {
        expect(files).toContain("welcome.mdx");
      });

      it("incluye una habitación final", () => {
        expect(files).toContain("final.mdx");
      });

      it("genera rutas públicas únicas", () => {
        const paths = files.map((fileName) => getRoomPath(station, fileName));

        expect(new Set(paths).size).toBe(paths.length);
      });

      it("usa la ruta base para la bienvenida", () => {
        expect(getRoomPath(station, "welcome.mdx")).toBe(station.basePath);
      });

      it("genera las habitaciones bajo la ruta de la estación", () => {
        for (const fileName of files) {
          const roomPath = getRoomPath(station, fileName);

          expect(roomPath.startsWith(station.basePath)).toBe(true);
        }
      });
    });
  }
});
