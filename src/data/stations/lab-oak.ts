import type { StationNavigationItem } from "./spaceStation";

export const LAB_OAK_PATH = "/estaciones/02-laboratorio-oak";

export const labOakNavigation: StationNavigationItem[] = [
  {
    label: "Bienvenida",
    href: LAB_OAK_PATH,
  },
  {
    label: "Habitación 00: Inicio",
    href: `${LAB_OAK_PATH}/00-inicio`,
  },
  {
    label: "Habitación 01: Explorador de datos",
    href: `${LAB_OAK_PATH}/01-explorador-de-datos`,
  },
  {
    label: "Habitación 02: Tipos de Pokémon",
    href: `${LAB_OAK_PATH}/02-tipos-de-pokemon`,
  },
  {
    label: "Habitación 03: Estadísticas de combate",
    href: `${LAB_OAK_PATH}/03-estadisticas-de-combate`,
  },
  {
    label: "Habitación 04: Visualización de combate",
    href: `${LAB_OAK_PATH}/04-visualizacion-de-combate`,
  },
  {
    label: "Habitación final",
    href: `${LAB_OAK_PATH}/final`,
  },
];
