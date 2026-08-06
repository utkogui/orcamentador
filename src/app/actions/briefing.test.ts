import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/ai/create-from-briefing", () => ({
  createEstimateFromBriefing: vi.fn(),
}));

vi.mock("@/lib/ai/interpret-briefing-modules", () => ({
  interpretBriefingModules: vi.fn(),
}));

vi.mock("@/lib/ai/preview-briefing", () => ({
  previewBriefingEstimate: vi.fn(),
}));

import { redirect } from "next/navigation";
import { createEstimateFromBriefing } from "@/lib/ai/create-from-briefing";
import { createEstimateFromBriefingAction } from "./briefing";

const createEstimate = createEstimateFromBriefing as ReturnType<typeof vi.fn>;

describe("createEstimateFromBriefingAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita JSON inválido", async () => {
    await expect(createEstimateFromBriefingAction("{bad")).rejects.toThrow(
      /inválidos/
    );
  });

  it("rejeita schema inválido", async () => {
    await expect(createEstimateFromBriefingAction(JSON.stringify({}))).rejects.toThrow();
  });

  it("cria e redireciona", async () => {
    createEstimate.mockResolvedValue({ id: "e1" });
    const payload = {
      projectName: "Demo",
      summary: "ok",
      marginPct: 30,
      items: [
        {
          moduleId: "m1",
          moduleName: "Login",
          instanceLabel: "Auth",
          instanceIndex: 1,
          complexity: "MEDIUM",
        },
      ],
      multiplierIds: [],
      disabledDisciplineIds: [],
      warnings: [],
    };

    await createEstimateFromBriefingAction(JSON.stringify(payload));
    expect(createEstimate).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/estimates/e1");
  });
});
