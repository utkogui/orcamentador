export interface BuildingBlockCategory {
  id: string;
  name: string;
  description: string;
  block_count?: number;
}

export interface BuildingBlock {
  id: string;
  name: string;
  client_terms: string[];
  summary: string;
  includes: string[];
  excludes: string[];
  pages: string[];
  dependencies: string[];
  usually_with: string[];
  commercial_questions: string[];
  commercial_notes: string[];
  disciplines: string[];
  complexity: string;
  category_id: string;
  category_name: string;
}

export interface BuildingBlockCatalog {
  version: string;
  name: string;
  description: string;
  language: string;
  intended_uses: string[];
  categories: BuildingBlockCategory[];
  total_blocks: number;
}

export interface BriefingBlockMatch {
  blockId: string;
  blockName: string;
  categoryId?: string;
  categoryName?: string;
  reason?: string;
  confidence?: "high" | "medium" | "low";
}

export interface CommercialQuestion {
  question: string;
  context?: string;
  relatedBlockId?: string;
}

export interface OutOfScopeRisk {
  title: string;
  description: string;
  suggestion?: string;
}

export interface NeedsConfirmationItem {
  topic: string;
  reason: string;
  relatedBlockIds?: string[];
}

export interface BriefingInterpretationResult {
  summary: string;
  explicitlyRequested: BriefingBlockMatch[];
  likelyNeeded: BriefingBlockMatch[];
  optional: BriefingBlockMatch[];
  needsConfirmation: NeedsConfirmationItem[];
  outOfScopeRisks: OutOfScopeRisk[];
  commercialQuestions: CommercialQuestion[];
  notesForSalesTeam: string[];
}

export interface BuildingBlocksKnowledge {
  catalog: BuildingBlockCatalog;
  categories: BuildingBlockCategory[];
  blocks: BuildingBlock[];
}
