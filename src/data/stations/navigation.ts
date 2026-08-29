import { getCollection } from "astro:content";

import type { Station } from "./registry";

export type StationNavigationItem = {
  label: string;
  href: string;
  type: "welcome" | "room" | "final";
};

export type StationNavigation = {
  code: string;
  title: string;
  items: StationNavigationItem[];
};

function getEntrySlug(entryId: string): string {
  const slug = entryId.split("/").at(-1);

  if (!slug) {
    throw new Error(`La entrada "${entryId}" no tiene una ruta válida.`);
  }

  return slug;
}

export async function getStationNavigation(
  station: Station,
): Promise<StationNavigation> {
  const entries = await getCollection("stations", ({ id }) =>
    id.startsWith(`${station.id}/`),
  );

  const items = entries
    .sort((first, second) => first.data.order - second.data.order)
    .map((entry): StationNavigationItem => {
      const slug = getEntrySlug(entry.id);

      if (slug === "welcome") {
        return {
          label: entry.data.title,
          href: station.href,
          type: "welcome",
        };
      }

      return {
        label: entry.data.title,
        href: `${station.href}/${slug}`,
        type: slug === "final" ? "final" : "room",
      };
    });

  return {
    code: station.code,
    title: station.title,
    items,
  };
}
