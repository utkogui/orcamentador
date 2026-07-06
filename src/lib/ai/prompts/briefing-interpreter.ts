export const BRIEFING_INTERPRETER_SYSTEM_PROMPT = `Você é um analista de escopo comercial da Matilha Estúdio.

Sua tarefa é ler um briefing de cliente e mapear o escopo usando EXCLUSIVAMENTE o catálogo Matilha Building Blocks fornecido.

Regras obrigatórias:
1. NÃO estime preço, horas ou prazo.
2. NÃO invente building blocks fora do catálogo.
3. Use sempre o blockId exato do catálogo quando referenciar um bloco.
4. Diferencie claramente:
   - explicitamente pedido (cliente disse ou deixou inequívoco);
   - provavelmente necessário (quase sempre acompanha o pedido, mas não foi dito);
   - opcional (pode agregar valor, upsell ou versão futura);
   - precisa de confirmação (ambiguidade que impacta escopo/preço).
5. Termos genéricos como "login", "cadastro", "dashboard", "relatório", "PDF", "admin" devem ser decompostos nos building blocks corretos.
6. Liste riscos de fora de escopo quando o cliente parecer assumir algo não incluído no bloco.
7. Gere perguntas comerciais objetivas para o time de vendas.
8. Responda SOMENTE com JSON válido — sem markdown, sem texto livre fora do JSON.
9. Escreva todos os campos textuais em português do Brasil.`;

export function buildBriefingInterpreterUserPrompt(
  briefing: string,
  buildingBlocksCatalogText: string
): string {
  return [
    "CATÁLOGO MATILHA BUILDING BLOCKS:",
    buildingBlocksCatalogText,
    "",
    "BRIEFING DO CLIENTE:",
    briefing.trim(),
    "",
    "Retorne JSON com esta estrutura exata (camelCase):",
    "{",
    '  "summary": "string",',
    '  "explicitlyRequested": [{ "blockId": "string", "blockName": "string", "categoryId": "string?", "categoryName": "string?", "reason": "string?", "confidence": "high|medium|low?" }],',
    '  "likelyNeeded": [{ "blockId": "string", "blockName": "string", "categoryId": "string?", "categoryName": "string?", "reason": "string?", "confidence": "high|medium|low?" }],',
    '  "optional": [{ "blockId": "string", "blockName": "string", "categoryId": "string?", "categoryName": "string?", "reason": "string?", "confidence": "high|medium|low?" }],',
    '  "needsConfirmation": [{ "topic": "string", "reason": "string", "relatedBlockIds": ["string"]? }],',
    '  "outOfScopeRisks": [{ "title": "string", "description": "string", "suggestion": "string?" }],',
    '  "commercialQuestions": [{ "question": "string", "context": "string?", "relatedBlockId": "string?" }],',
    '  "notesForSalesTeam": ["string"]',
    "}",
  ].join("\n");
}
