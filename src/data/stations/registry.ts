import {
  spaceStationNavigation,
  type StationNavigationItem,
} from "./spaceStation";
import { labOakNavigation } from "./lab-oak";

export type Station = {
  name: string;
  code: string;
  title: string;
  href: string;
  image: string;
  items: StationNavigationItem[];
};

export const stations: Station[] = [
  {
    name: "Estación espacial",
    code: "ESTACIÓN 01",
    title: "Estación espacial",
    href: "/estaciones/01-estacion-espacial",
    image: "/stations/space-station/space-station.png",
    items: spaceStationNavigation,
  },
  {
    name: "Laboratorio Oak",
    code: "ESTACIÓN 02",
    title: "El laboratorio del profesor Oak",
    href: "/estaciones/02-laboratorio-oak",
    image: "/stations/lab-oak/lab-oak.png",
    items: labOakNavigation,
  },
];

export const stationNavigations = Object.fromEntries(
  stations.map((station) => [
    station.name,
    {
      code: station.code,
      title: station.title,
      items: station.items,
    },
  ]),
);
