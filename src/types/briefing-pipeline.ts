export type ScopePhase = "mvp" | "future" | "unclear";

export interface ProductActor {
  name: string;
  description?: string;
  responsibilities?: string[];
}

export interface ProductMajorModule {
  name: string;
  description: string;
  scope: ScopePhase;
}

export interface ProductDiscoveryResult {
  summary: string;
  productType: string;
  problemStatement: string;
  platforms: string[];
  actors: ProductActor[];
  majorModules: ProductMajorModule[];
  mvpScope: string[];
  futureScope: string[];
  technicalRequirements: string[];
  integrations: string[];
  nonFunctionalRequirements: string[];
}

export type ArchitectureComplexityHint = "low" | "medium" | "high" | "very_high";

export interface ArchitecturalModule {
  id: string;
  name: string;
  description: string;
  parentMajorModule: string;
  platform: string;
  businessPurpose: string;
  functionalAreas: string[];
  complexityHint: ArchitectureComplexityHint;
  assumptions: string[];
  openQuestions: string[];
  /** @deprecated compatibilidade — use parentMajorModule */
  parentId?: string;
  /** @deprecated compatibilidade — espelha parentMajorModule */
  sourceMajorModule?: string;
}

export interface ArchitectureResult {
  summary: string;
  modules: ArchitecturalModule[];
}

export type ExpandedBlockCategory =
  | "explicit"
  | "implicit"
  | "dependency"
  | "required_flow"
  | "optional_flow";

export interface ExpandedBlock {
  blockId: string;
  blockName: string;
  architecturalModuleId: string;
  category: ExpandedBlockCategory;
  reason?: string;
}

export interface BlockDependency {
  fromBlockId: string;
  toBlockId: string;
  reason?: string;
}

export interface ExpandedBuildingBlocksResult {
  summary: string;
  blocks: ExpandedBlock[];
  dependencies: BlockDependency[];
}

export interface CommercialAmbiguity {
  topic: string;
  reason: string;
  relatedModuleIds?: string[];
}

export interface PipelineCommercialQuestion {
  question: string;
  context?: string;
  relatedBlockId?: string;
}

export interface PipelineScopeRisk {
  title: string;
  description: string;
  suggestion?: string;
}

export interface MissingButCommonFeature {
  feature: string;
  reason: string;
}

export interface CommercialDiscoveryResult {
  ambiguities: CommercialAmbiguity[];
  commercialQuestions: PipelineCommercialQuestion[];
  scopeRisks: PipelineScopeRisk[];
  outOfScope: string[];
  missingButCommon: MissingButCommonFeature[];
}

export type SuggestedComplexity = "SIMPLE" | "MEDIUM" | "COMPLEX" | "VERY_COMPLEX";

export interface EstimationModuleCandidate {
  name: string;
  instanceLabel: string;
  suggestedComplexity: SuggestedComplexity;
  buildingBlockIds: string[];
  disciplines: string[];
  dependencies: string[];
  notes?: string;
}

export interface EstimationPreparationResult {
  summary: string;
  modules: EstimationModuleCandidate[];
  notesForEstimator: string[];
}

export type PipelineLayerName =
  | "productDiscovery"
  | "architecture"
  | "buildingBlockExpansion"
  | "commercialDiscovery"
  | "estimationPreparation";

export interface PipelineLayerMeta {
  layer: PipelineLayerName;
  status: "implemented" | "stub";
  note?: string;
}

export interface BriefingPipelineResult {
  briefing: string;
  productDiscovery: ProductDiscoveryResult;
  architecture: ArchitectureResult;
  expandedBlocks: ExpandedBuildingBlocksResult;
  commercialDiscovery: CommercialDiscoveryResult;
  estimationPrep: EstimationPreparationResult;
  layerMeta: PipelineLayerMeta[];
  completedAt: string;
}

export interface BriefingPipelineOptions {
  /** Executa apenas até a camada indicada (inclusive). Padrão: todas. */
  stopAfterLayer?: PipelineLayerName;
}
