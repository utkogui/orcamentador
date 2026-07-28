export interface DesignLibrary {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface DesignPattern {
  id: string;
  library: string;
  type: string;
  reference: string;
  complexityReduction: number;
  frontendReduction: number;
  uiReduction: number;
  description: string;
}

export interface BuildingBlockDesignProfile {
  id: string;
  patterns: DesignPattern[];
}

export interface DesignRecommendation {
  buildingBlockId: string;
  buildingBlockName?: string;
  pattern: DesignPattern;
  library: DesignLibrary;
}
