export type StationNavigationItem = {
  label: string;
  href?: string;
};

export const SPACE_STATION_PATH = "/estaciones/01-estacion-espacial";

export const spaceStationNavigation: StationNavigationItem[] = [
  {
    label: "Bienvenida",
    href: SPACE_STATION_PATH,
  },
  {
    label: "Habitación 00: Inicio",
    href: `${SPACE_STATION_PATH}/00-inicio`,
  },
  {
    label: "Habitación 01: Variable String",
    href: `${SPACE_STATION_PATH}/01-variable-string`,
  },
  {
    label: "Habitación 02: Operación numérica simple",
    href: `${SPACE_STATION_PATH}/02-operacion-numerica-simple`,
  },
  {
    label: "Habitación 03: Operación numérica compleja",
    href: `${SPACE_STATION_PATH}/03-operacion-numerica-compleja`,
  },
  {
    label: "Habitación 04: Promedio de números",
    href: `${SPACE_STATION_PATH}/04-promedio-de-numeros`,
  },
  {
    label: "Habitación 05: Bucle for",
    href: `${SPACE_STATION_PATH}/05-bucle-for`,
  },
  {
    label: "Habitación 06: Índices en lista",
    href: `${SPACE_STATION_PATH}/06-indices-en-lista`,
  },
  {
    label: "Habitación 07: Ordenar números de lista",
    href: `${SPACE_STATION_PATH}/07-ordenar-lista`,
  },
  {
    label: "Habitación 08: Condicionales",
    href: `${SPACE_STATION_PATH}/08-condicionales`,
  },
  {
    label: "Habitación 09: Bucle for y condicionales",
    href: `${SPACE_STATION_PATH}/09-bucle-for-condicionales`,
  },
  {
    label: "Habitación 10: Condicionales y string",
    href: `${SPACE_STATION_PATH}/10-condicionales-string`,
  },
  {
    label: "Habitación 11: Concatenación",
    href: `${SPACE_STATION_PATH}/11-concatenacion`,
  },
  {
    label: "Habitación 12: Crear diccionario",
    href: `${SPACE_STATION_PATH}/12-crear-diccionario`,
  },
  {
    label: "Habitación 13: Manejo de elementos de una lista",
    href: `${SPACE_STATION_PATH}/13-manejo-de-lista`,
  },
  {
    label: "Habitación 14: Decodificación con diccionario",
    href: `${SPACE_STATION_PATH}/14-decodificacion-diccionario`,
  },
  {
    label: "Habitación 15: Bucle for anidado",
    href: `${SPACE_STATION_PATH}/15-bucle-for-anidado`,
  },
  {
    label: "Habitación 16: Bucle for y condicionales",
    href: `${SPACE_STATION_PATH}/16-bucle-for-condicionales`,
  },
  {
    label: "Habitación 17: Operación matemática y funciones",
    href: `${SPACE_STATION_PATH}/17-operacion-matematica-funciones`,
  },
  {
    label: "Habitación final",
    href: `${SPACE_STATION_PATH}/final`,
  },
];
