import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/ai/interpret-briefing", () => ({
  interpretBriefing: vi.fn(),
}));

vi.mock("@/lib/ai/create-estimate-from-knowledge", () => ({
  createEstimateFromKnowledgeInterpretation: vi.fn(),
}));

import { redirect } from "next/navigation";
import { interpretBriefing } from "@/lib/ai/interpret-briefing";
import { createEstimateFromKnowledgeInterpretation } from "@/lib/ai/create-estimate-from-knowledge";
import {
  createEstimateFromKnowledgeAction,
  interpretBriefingKnowledgeAction,
} from "./interpret-briefing";

const interpret = interpretBriefing as ReturnType<typeof vi.fn>;
const createFromKnowledge = createEstimateFromKnowledgeInterpretation as ReturnType<
  typeof vi.fn
>;

describe("interpretBriefingKnowledgeAction", () => {
  it("delega para interpretBriefing", async () => {
    interpret.mockResolvedValue({ summary: "ok" });
    await expect(interpretBriefingKnowledgeAction("brief")).resolves.toEqual({
      summary: "ok",
    });
  });
});

describe("createEstimateFromKnowledgeAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita JSON inválido", async () => {
    await expect(createEstimateFromKnowledgeAction("{bad")).rejects.toThrow(/inválidos/);
  });

  it("cria e redireciona", async () => {
    createFromKnowledge.mockResolvedValue({ estimate: { id: "e1" }, mappedItemsCount: 1 });
    await createEstimateFromKnowledgeAction(
      JSON.stringify({
        summary: "Portal",
        explicitlyRequested: [],
        likelyNeeded: [],
        optional: [],
        needsConfirmation: [],
        outOfScopeRisks: [],
        commercialQuestions: [],
        notesForSalesTeam: [],
      })
    );
    expect(createFromKnowledge).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/estimates/e1");
  });
});
