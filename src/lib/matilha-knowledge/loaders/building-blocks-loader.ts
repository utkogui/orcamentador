import { readFile } from "fs/promises";
import path from "path";
import type {
  BuildingBlock,
  BuildingBlockCatalog,
  BuildingBlockCategory,
  BuildingBlocksKnowledge,
} from "@/types/building-blocks";
import { BUILDING_BLOCKS_PATH } from "@/lib/matilha-knowledge";

const DATA_DIR = path.join(process.cwd(), BUILDING_BLOCKS_PATH, "data");

type AllBuildingBlocksFile = {
  catalog: BuildingBlockCatalog;
  blocks: BuildingBlock[];
};

type CategoryFile = {
  category: BuildingBlockCategory;
  blocks: BuildingBlock[];
};

let cachedKnowledge: BuildingBlocksKnowledge | null = null;

function dedupeBlocks(blocks: BuildingBlock[]): BuildingBlock[] {
  const map = new Map<string, BuildingBlock>();
  for (const block of blocks) {
    map.set(block.id, block);
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

async function loadJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function loadAllBuildingBlocks(): Promise<BuildingBlocksKnowledge> {
  if (cachedKnowledge) return cachedKnowledge;

  const all = await loadJsonFile<AllBuildingBlocksFile>("all-building-blocks.json");
  const unified = dedupeBlocks([...all.blocks]);

  cachedKnowledge = {
    catalog: all.catalog,
    categories: all.catalog.categories,
    blocks: unified,
  };

  return cachedKnowledge;
}

export async function loadBuildingBlocksByCategory(
  categoryId: string
): Promise<{ category: BuildingBlockCategory; blocks: BuildingBlock[] }> {
  const filename = `${categoryId}.json`;
  const data = await loadJsonFile<CategoryFile>(filename);
  return {
    category: data.category,
    blocks: data.blocks,
  };
}

export function formatBuildingBlocksForPrompt(blocks: BuildingBlock[]): string {
  return blocks
    .map((block) => {
      const terms = block.client_terms.slice(0, 6).join(", ");
      return [
        `- id: "${block.id}"`,
        `  nome: "${block.name}"`,
        `  categoria: ${block.category_name} (${block.category_id})`,
        `  termos do cliente: ${terms}`,
        `  resumo: ${block.summary}`,
        `  inclui: ${block.includes.slice(0, 5).join("; ")}`,
        `  não inclui: ${block.excludes.slice(0, 4).join("; ")}`,
      ].join("\n");
    })
    .join("\n\n");
}

export function findBuildingBlockById(
  blocks: BuildingBlock[],
  blockId: string
): BuildingBlock | undefined {
  return blocks.find((block) => block.id === blockId);
}
