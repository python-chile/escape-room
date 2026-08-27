import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  SPACE_STATION_PATH,
  spaceStationNavigation,
  type StationNavigationItem,
} from "../../src/data/stations/spaceStation";
import { LAB_OAK_PATH, labOakNavigation } from "@/data/stations/lab-oak";

export type StationDefinition = {
  name: string;
  contentDirectory: string;
  basePath: string;
  navigation: StationNavigationItem[];
};

export const projectRoot = process.cwd();

export const stations: StationDefinition[] = [
  {
    name: "Estación espacial",
    contentDirectory: "space-station",
    basePath: SPACE_STATION_PATH,
    navigation: spaceStationNavigation,
  },
  {
    name: "Laboratorio Oak",
    contentDirectory: "lab-oak",
    basePath: LAB_OAK_PATH,
    navigation: labOakNavigation,
  },
];

export function getStationDirectory(station: StationDefinition) {
  return join(
    projectRoot,
    "src",
    "content",
    "stations",
    station.contentDirectory,
  );
}

export function getStationFilePath(
  station: StationDefinition,
  fileName: string,
) {
  return join(getStationDirectory(station), fileName);
}

export function getMdxFiles(station: StationDefinition) {
  return readdirSync(getStationDirectory(station))
    .filter((fileName) => fileName.endsWith(".mdx"))
    .sort();
}

export function getRoomPath(station: StationDefinition, fileName: string) {
  const roomId = fileName.replace(/\.mdx$/, "");

  if (roomId === "welcome") {
    return station.basePath;
  }

  return `${station.basePath}/${roomId}`;
}

export function getFrontmatter(filePath: string) {
  const content = readFileSync(filePath, "utf8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    throw new Error(`El archivo no tiene frontmatter válido: ${filePath}`);
  }

  return match[1];
}

export function getFrontmatterValue(frontmatter: string, field: string) {
  const match = frontmatter.match(
    new RegExp(`^${field}:\\s*"?(.+?)"?\\s*$`, "m"),
  );

  return match?.[1];
}
