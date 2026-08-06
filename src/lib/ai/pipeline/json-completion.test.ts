import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/ai/openai-client", () => ({
  DEFAULT_OPENAI_MODEL: "gpt-test",
  DEFAULT_OPENAI_TEMPERATURE: 0,
  getOpenAIClient: vi.fn(),
}));

import { getOpenAIClient } from "@/lib/ai/openai-client";
import { callJsonCompletion } from "./json-completion";

const getClient = getOpenAIClient as ReturnType<typeof vi.fn>;

describe("callJsonCompletion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parseia JSON da resposta", async () => {
    getClient.mockReturnValue({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: '{"ok":true}' } }],
          }),
        },
      },
    });

    await expect(
      callJsonCompletion({ systemPrompt: "sys", userPrompt: "user" })
    ).resolves.toEqual({ ok: true });
  });

  it("falha sem conteúdo", async () => {
    getClient.mockReturnValue({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({ choices: [{ message: {} }] }),
        },
      },
    });

    await expect(
      callJsonCompletion({ systemPrompt: "sys", userPrompt: "user" })
    ).rejects.toThrow(/não retornou conteúdo/);
  });

  it("falha com JSON inválido", async () => {
    getClient.mockReturnValue({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: "not-json" } }],
          }),
        },
      },
    });

    await expect(
      callJsonCompletion({ systemPrompt: "sys", userPrompt: "user" })
    ).rejects.toThrow(/não é JSON válido/);
  });
});
