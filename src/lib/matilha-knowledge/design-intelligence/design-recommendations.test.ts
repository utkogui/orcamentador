import { describe, expect, it } from "vitest";
import { recommendDesignPatterns } from "./design-recommendations";
import { getDesignProfiles } from "./design-loader";

describe("recommendDesignPatterns", () => {
  it("retorna recomendações só para blocos com profile", () => {
    const profileIds = Object.keys(getDesignProfiles());
    if (profileIds.length === 0) {
      expect(recommendDesignPatterns(["nao_existe"])).toEqual([]);
      return;
    }

    const withProfile = recommendDesignPatterns([profileIds[0]!, "bloco_sem_profile"]);
    expect(withProfile.length).toBeGreaterThanOrEqual(1);
    expect(withProfile.every((r) => r.buildingBlockId === profileIds[0])).toBe(true);
  });
});
