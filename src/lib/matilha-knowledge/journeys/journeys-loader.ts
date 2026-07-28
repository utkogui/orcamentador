import { readFile, writeFile } from "fs/promises";
import path from "path";
import catalogData from "./journeys-catalog.json";
import type { BuildingBlockJourney, JourneysCatalog } from "./journeys-types";

export const JOURNEYS_CATALOG_PATH = path.join(
  process.cwd(),
  "src/lib/matilha-knowledge/journeys/journeys-catalog.json"
);

let cachedCatalog: JourneysCatalog | null = catalogData as JourneysCatalog;

export function loadJourneysCatalog(): JourneysCatalog {
  return cachedCatalog ?? (catalogData as JourneysCatalog);
}

export function getJourneys(): BuildingBlockJourney[] {
  return loadJourneysCatalog().journeys;
}

export function getJourneyById(id: string): BuildingBlockJourney | undefined {
  return getJourneys().find((j) => j.id === id);
}

export function indexJourneys(): Map<string, BuildingBlockJourney> {
  return new Map(getJourneys().map((j) => [j.id, j]));
}

export function getJourneysForBlock(blockId: string): BuildingBlockJourney[] {
  return getJourneys().filter((j) => j.blockIds.includes(blockId));
}

/** Relê o JSON do disco (após escrita pela API). */
export async function reloadJourneysCatalogFromDisk(): Promise<JourneysCatalog> {
  const raw = await readFile(JOURNEYS_CATALOG_PATH, "utf8");
  cachedCatalog = JSON.parse(raw) as JourneysCatalog;
  return cachedCatalog;
}

export async function saveJourneysCatalog(catalog: JourneysCatalog): Promise<void> {
  const next: JourneysCatalog = {
    ...catalog,
    lastReviewed: new Date().toISOString().slice(0, 10),
  };
  await writeFile(JOURNEYS_CATALOG_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  cachedCatalog = next;
}

export function upsertJourney(
  catalog: JourneysCatalog,
  journey: BuildingBlockJourney
): JourneysCatalog {
  const idx = catalog.journeys.findIndex((j) => j.id === journey.id);
  const journeys = [...catalog.journeys];
  if (idx >= 0) {
    journeys[idx] = journey;
  } else {
    journeys.push(journey);
  }
  return { ...catalog, journeys };
}

export function removeJourney(catalog: JourneysCatalog, id: string): JourneysCatalog {
  return {
    ...catalog,
    journeys: catalog.journeys.filter((j) => j.id !== id),
  };
}
