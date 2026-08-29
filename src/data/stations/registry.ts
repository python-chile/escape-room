export type Station = {
  id: string;
  slug: string;
  name: string;
  code: string;
  title: string;
  href: string;
  image: string;
};

export const stations: Station[] = [
  {
    id: "space-station",
    slug: "01-estacion-espacial",
    name: "Estación espacial",
    code: "ESTACIÓN 01",
    title: "Estación espacial",
    href: "/estaciones/01-estacion-espacial",
    image: "/stations/space-station/space-station.png",
  },
  {
    id: "lab-oak",
    slug: "02-laboratorio-oak",
    name: "Laboratorio Oak",
    code: "ESTACIÓN 02",
    title: "El laboratorio del profesor Oak",
    href: "/estaciones/02-laboratorio-oak",
    image: "/stations/lab-oak/lab-oak.png",
  },
];

export function getStationById(id: string): Station | undefined {
  return stations.find((station) => station.id === id);
}

export function getStationBySlug(slug: string): Station | undefined {
  return stations.find((station) => station.slug === slug);
}
