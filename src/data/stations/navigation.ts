import { getCollection } from "astro:content";

import type { Station } from "./registry";

export type StationNavigationItem = {
  label: string;
  href: string;
  type: "welcome" | "room" | "final";
  marker?: string;
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

function cleanNavigationLabel(title: string): string {
  return title.replace(/^Habitación\s+\d{2}:\s*/i, "");
}

function getRoomMarker(slug: string): string | undefined {
  return slug.match(/^(\d{2})-/)?.[1];
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

      const type = slug === "final" ? "final" : "room";

      return {
        label: cleanNavigationLabel(entry.data.title),
        href: `${station.href}/${slug}`,
        type,
        marker: type === "room" ? getRoomMarker(slug) : undefined,
      };
    });

  return {
    code: station.code,
    title: station.title,
    items,
  };
}
