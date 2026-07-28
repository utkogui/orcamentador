import { DesignRecommendation } from "./design-types";
import { getDesignProfile, getDesignLibrary } from "./design-loader";

export function recommendDesignPatterns(buildingBlockIds: string[]): DesignRecommendation[] {
  const recommendations: DesignRecommendation[] = [];

  for (const id of buildingBlockIds) {
    const profile = getDesignProfile(id);
    if (!profile || !profile.patterns || profile.patterns.length === 0) {
      continue;
    }

    // Por enquanto, pegamos o primeiro padrão como recomendação principal
    const pattern = profile.patterns[0];
    const library = getDesignLibrary(pattern.library);

    if (library) {
      recommendations.push({
        buildingBlockId: id,
        pattern,
        library,
      });
    }
  }

  return recommendations;
}
