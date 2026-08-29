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
          const orderValue = getFrontmatterValue(frontmatter, "order");
          const order = Number(orderValue);

          expect(title, `${fileName} no tiene title`).toBeTruthy();

          expect(
            orderValue,
            `${fileName} no tiene el campo order`,
          ).toBeTruthy();

          expect(
            Number.isInteger(order) && order >= 0,
            `${fileName} no tiene un order entero no negativo`,
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
