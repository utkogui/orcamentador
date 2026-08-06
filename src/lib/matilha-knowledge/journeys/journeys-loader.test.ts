import { describe, expect, it } from "vitest";
import type { BuildingBlockJourney, JourneysCatalog } from "./journeys-types";
import {
  getJourneyById,
  getJourneysForBlock,
  removeJourney,
  upsertJourney,
} from "./journeys-loader";

function catalog(journeys: BuildingBlockJourney[]): JourneysCatalog {
  return {
    version: "1",
    name: "test",
    description: "",
    lastReviewed: "2026-01-01",
    journeys,
  };
}

const journeyA: BuildingBlockJourney = {
  id: "j1",
  name: "A",
  description: "desc",
  blockIds: ["auth_basic_login", "dashboard_charts"],
  commercialBundle: true,
};

describe("journeys-loader (puro)", () => {
  it("upsert cria e atualiza", () => {
    const created = upsertJourney(catalog([]), journeyA);
    expect(created.journeys).toHaveLength(1);

    const updated = upsertJourney(created, { ...journeyA, name: "A2" });
    expect(updated.journeys).toHaveLength(1);
    expect(updated.journeys[0]?.name).toBe("A2");
  });

  it("remove por id", () => {
    const next = removeJourney(catalog([journeyA]), "j1");
    expect(next.journeys).toEqual([]);
  });

  it("consulta catálogo seed por bloco", () => {
    expect(getJourneyById("journey_saas_content")?.blockIds).toContain("auth_basic_login");
    expect(getJourneysForBlock("auth_basic_login").length).toBeGreaterThan(0);
  });
});
