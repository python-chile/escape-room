export type Station = {
  id: string;
  slug: string;
  name: string;
  code: string;
  title: string;
  href: string;
  image: string;

  presentation: {
    objective: {
      lead: string;
      rest: string;
    };
    accent: string;
  };
};

export const stations: Station[] = [
  {
    id: "space-station",
    slug: "01-estacion-espacial",
    name: "Estación espacial",
    code: "ESTACIÓN 01",
    title: "Estación espacial",
    href: "/estaciones/01-estacion-espacial",
    image: "/stations/space-station/space-station.webp",

    presentation: {
      objective: {
        lead: "Repara",
        rest: "una estación fuera de órbita usando Python.",
      },
      accent: "#0879e8",
    },
  },
  {
    id: "lab-oak",
    slug: "02-laboratorio-oak",
    name: "Laboratorio Oak",
    code: "ESTACIÓN 02",
    title: "Laboratorio Pokémon",
    href: "/estaciones/02-laboratorio-oak",
    image: "/stations/lab-oak/lab-oak.webp",

    presentation: {
      objective: {
        lead: "Descubre",
        rest: "patrones ocultos en los datos de distintos Pokémones.",
      },
      accent: "#ef2b1b",
    },
  },
];

export function getStationById(id: string): Station | undefined {
  return stations.find((station) => station.id === id);
}

export function getStationBySlug(slug: string): Station | undefined {
  return stations.find((station) => station.slug === slug);
}
