import {
  DEFAULT_OPENAI_MODEL,
  DEFAULT_OPENAI_TEMPERATURE,
  getOpenAIClient,
} from "@/lib/ai/openai-client";

type JsonCompletionOptions = {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
};

export async function callJsonCompletion({
  systemPrompt,
  userPrompt,
  model = DEFAULT_OPENAI_MODEL,
  temperature = DEFAULT_OPENAI_TEMPERATURE,
}: JsonCompletionOptions): Promise<unknown> {
  const client = getOpenAIClient();

  const completion = await client.chat.completions.create({
    model,
    temperature,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("A IA não retornou conteúdo. Tente novamente.");
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Resposta da IA não é JSON válido. Tente novamente.");
  }
}
