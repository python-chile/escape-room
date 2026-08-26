import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const stations = defineCollection({
  loader: glob({
    base: "./src/content/stations",
    pattern: "**/*.mdx",
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    station: z.string(),
    order: z.number().int().nonnegative(),
  }),
});

export const collections = {
  stations,
};
