import { describe, expect, it } from "vitest";

import {
  getFrontmatter,
  getFrontmatterValue,
  getMdxFiles,
  getStationFilePath,
  stations,
} from "./helpers";

describe("contenido de estaciones", () => {
  for (const station of stations) {
    describe(station.name, () => {
      it("tiene frontmatter completo y órdenes únicos", () => {
        const orders: number[] = [];
        const files = getMdxFiles(station);

        for (const fileName of files) {
          const filePath = getStationFilePath(station, fileName);
          const frontmatter = getFrontmatter(filePath);

          const title = getFrontmatterValue(frontmatter, "title");
          const stationName = getFrontmatterValue(frontmatter, "station");
          const order = Number(getFrontmatterValue(frontmatter, "order"));

          expect(title, `${fileName} no tiene title`).toBeTruthy();

          expect(
            stationName,
            `${fileName} no tiene station correcto`,
          ).toBe(station.name);

          expect(
            Number.isFinite(order),
            `${fileName} no tiene order válido`,
          ).toBe(true);

          orders.push(order);
        }

        expect(
          new Set(orders).size,
          `${station.name} tiene habitaciones con order repetido`,
        ).toBe(orders.length);
      });
    });
  }
});
