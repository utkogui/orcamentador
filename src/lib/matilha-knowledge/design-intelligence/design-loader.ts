import catalogData from "./design-catalog.json";
import { DesignLibrary, BuildingBlockDesignProfile } from "./design-types";

export function getDesignLibraries(): Record<string, DesignLibrary> {
  return catalogData.libraries as Record<string, DesignLibrary>;
}

export function getDesignProfiles(): Record<string, BuildingBlockDesignProfile> {
  return catalogData.profiles as Record<string, BuildingBlockDesignProfile>;
}

export function getDesignProfile(buildingBlockId: string): BuildingBlockDesignProfile | undefined {
  const profiles = getDesignProfiles();
  return profiles[buildingBlockId];
}

export function getDesignLibrary(libraryId: string): DesignLibrary | undefined {
  const libraries = getDesignLibraries();
  return libraries[libraryId];
}
