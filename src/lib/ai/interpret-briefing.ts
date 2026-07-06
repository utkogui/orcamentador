import OpenAI from "openai";
import {
  formatBuildingBlocksForPrompt,
  loadAllBuildingBlocks,
} from "@/lib/matilha-knowledge/loaders/building-blocks-loader";
import { parseBriefingInterpretationResult } from "@/lib/ai/briefing-interpretation-schema";
import {
  BRIEFING_INTERPRETER_SYSTEM_PROMPT,
  buildBriefingInterpreterUserPrompt,
} from "@/lib/ai/prompts/briefing-interpreter";
import type { BriefingInterpretationResult } from "@/types/building-blocks";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada. Adicione ao arquivo .env.");
  }
  return new OpenAI({ apiKey });
}

export async function interpretBriefing(
  briefing: string
): Promise<BriefingInterpretationResult> {
  const trimmed = briefing.trim();
  if (trimmed.length < 80) {
    throw new Error("Cole um briefing com pelo menos 80 caracteres para interpretação.");
  }

  const knowledge = await loadAllBuildingBlocks();
  const catalogText = formatBuildingBlocksForPrompt(knowledge.blocks);
  const userPrompt = buildBriefingInterpreterUserPrompt(trimmed, catalogText);
  const client = getOpenAIClient();

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: BRIEFING_INTERPRETER_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("A IA não retornou conteúdo. Tente novamente.");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new Error("Resposta da IA não é JSON válido. Tente novamente.");
  }

  return parseBriefingInterpretationResult(parsedJson);
}
