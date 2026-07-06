# Prompt para o Cursor

## Opção A — uma linha (recomendada)

Digite `@matilha-ds` no chat (selecione a pasta) e cole:

> Use **matilha-ds** como única fonte de UI. Leia `MATILHA-UI.md` e `AGENTS.md` dentro dela. Importe só de `@matilha/design-system`. Não recrie componentes.

O `@matilha-ds` anexa a pasta ao contexto do agente — ele lê os arquivos de regras automaticamente.

---

## Opção B — automático (sem prompt)

Rode **uma vez** na raiz do seu projeto (onde `matilha-ds/` está):

```bash
./matilha-ds/setup-cursor.sh
```

Isso copia a regra para `.cursor/rules/`. Depois, o Cursor aplica as regras em **toda** conversa — não precisa colar prompt.

---

## Opção C — prompt completo

Cole isto no chat ao iniciar um projeto ou antes de criar telas:

---

**Use o design system Matilha como única fonte de UI.**

1. Leia `matilha-ds/MATILHA-UI.md` antes de criar qualquer interface.
2. Importe componentes de `@matilha/design-system` — **não recrie** Button, Input, TextArea, Radio, Checkbox, Switch, Typography, TipBox, Logo, Badge, Tagline, ColorDots ou BrandElement.
3. Use tokens CSS `var(--matilha-*)` para cores, sombras e espaçamentos. Proibido hardcode de hex.
4. Tipografia: `<Typography variant="...">` ou classes `.matilha-h1` etc.
5. Ícones: `@heroicons/react/24/outline` conforme `iconRegistry` do pacote.

O CSS global já deve estar importado em `main.tsx` / `layout.tsx`:

```tsx
import '@matilha/design-system/styles/global.css';
```

---

## Por que só citar a pasta no prompt não basta?

O Cursor **não** carrega arquivos só porque você menciona o nome `matilha-ds` em texto livre. Você precisa de **um** destes gatilhos:

| Método | Como funciona |
|---|---|
| `@matilha-ds` | Anexa a pasta ao contexto da mensagem |
| `.cursor/rules/` | Regra com `alwaysApply: true` na raiz do projeto |
| Caminho explícito | "Leia `matilha-ds/MATILHA-UI.md`" + agente abre o arquivo |

A combinação **setup-cursor.sh + @matilha-ds** é a mais confiável.
