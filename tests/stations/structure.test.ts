import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  getMdxFiles,
  getStationFilePath,
  stations,
  type StationDefinition,
} from "./helpers";

type SectionId = "imagen" | "narrativa" | "ejemplo" | "ayuda" | "editor";

type Section = {
  id: SectionId;
  label: string;
  /** Posición de la sección dentro del archivo, o -1 si no existe. */
  find: (source: string) => number;
  /** Si es false, solo se exige que exista (no que siga un orden). */
  ordered?: boolean;
};

const imageWithAlt = /<img\b[^>]*\balt="[^"]+"/;

// El ejemplo debe estar a la vista: los bloques dentro de la pista
// (StationDisclosure) y del editor no cuentan como ejemplo.
function withoutHintAndEditor(source: string) {
  return source
    .replace(/<StationDisclosure[\s\S]*?<\/StationDisclosure>/g, "")
    .replace(/<PythonEditor[\s\S]*$/, "");
}

// Orden pedagógico esperado de una habitación jugable.
const sections: Section[] = [
  {
    id: "imagen",
    label: "imagen con texto alternativo",
    find: (source) => source.search(imageWithAlt),
  },
  {
    id: "narrativa",
    label: "narrativa (StationCallout)",
    find: (source) => source.indexOf("<StationCallout"),
  },
  {
    id: "ejemplo",
    label: "ejemplo de código fuera de la pista",
    find: (source) => withoutHintAndEditor(source).indexOf("```python"),
    ordered: false,
  },
  {
    id: "ayuda",
    label: "ayuda (StationDisclosure)",
    find: (source) => source.indexOf("<StationDisclosure"),
  },
  {
    id: "editor",
    label: "editor de código (PythonEditor)",
    find: (source) => source.indexOf("<PythonEditor"),
  },
];

// Brechas que existen hoy en el contenido. Mantenerlas aquí permite que la
// validación proteja las salas nuevas sin bloquear las actuales. Si corriges
// una, el test te pedirá quitarla de la lista.
const knownGaps: Record<string, SectionId[]> = {
  "lab-oak/00-inicio.mdx": ["imagen"],
  "lab-oak/01-explorador-de-datos.mdx": ["imagen"],
  "lab-oak/02-tipos-de-pokemon.mdx": ["imagen"],
  "lab-oak/03-estadisticas-de-combate.mdx": ["imagen"],
  "lab-oak/04-visualizacion-de-combate.mdx": ["imagen"],
  "space-station/00-inicio.mdx": ["ejemplo"],
  "space-station/14-decodificacion-diccionario.mdx": ["ejemplo"],
  "space-station/17-operacion-matematica-funciones.mdx": ["ejemplo"],
};

function readRoom(station: StationDefinition, fileName: string) {
  return readFileSync(getStationFilePath(station, fileName), "utf8");
}

function isPlayableRoom(source: string) {
  return source.includes("<PythonEditor");
}

describe("estructura de las habitaciones", () => {
  for (const station of stations) {
    describe(station.name, () => {
      const rooms = getMdxFiles(station).filter((fileName) =>
        isPlayableRoom(readRoom(station, fileName)),
      );

      it("tiene habitaciones jugables que validar", () => {
        expect(
          rooms.length,
          `${station.name} no tiene habitaciones con PythonEditor`,
        ).toBeGreaterThan(0);
      });

      for (const fileName of rooms) {
        it(`${fileName} tiene las secciones obligatorias en orden`, () => {
          const source = readRoom(station, fileName);
          const roomKey = `${station.contentDirectory}/${fileName}`;
          const gaps = knownGaps[roomKey] ?? [];

          const found = sections.map((section) => ({
            section,
            position: section.find(source),
          }));

          for (const { section, position } of found) {
            if (gaps.includes(section.id)) {
              expect(
                position,
                `${fileName}: ya incluye "${section.label}", quítala de knownGaps`,
              ).toBe(-1);
              continue;
            }

            expect(
              position,
              `${fileName}: falta la sección "${section.label}"`,
            ).toBeGreaterThanOrEqual(0);
          }

          const present = found.filter(
            ({ section, position }) =>
              section.ordered !== false && position >= 0,
          );

          for (let index = 1; index < present.length; index += 1) {
            const previous = present[index - 1];
            const current = present[index];

            expect(
              current.position,
              `${fileName}: "${current.section.label}" debe ir después de "${previous.section.label}"`,
            ).toBeGreaterThan(previous.position);
          }
        });
      }
    });
  }
});
