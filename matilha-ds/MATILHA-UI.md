# Matilha UI — Regras deste projeto

Este projeto usa a pasta **`matilha-ds`** (`@matilha/design-system`). Leia isto antes de criar qualquer interface.

## Obrigatório

- Importar componentes do pacote — **nunca recriar** UI que já existe no design system
- Usar tokens CSS: `var(--matilha-primary-300)`, `var(--matilha-neutral-800)`, etc.
- Importar estilos globais no entry point:

```tsx
import '@matilha/design-system/styles/global.css';
```

## Tailwind (preset de marca + UI Kit)

Importe o CSS global (já inclui fontes, tokens e Tailwind):

```tsx
import '@matilha/design-system/styles/global.css';
```

No `tailwind.config.ts` do seu app:

```ts
import matilhaPreset from '@matilha/design-system/tailwind';

export default {
  presets: [matilhaPreset],
  content: ['./src/**/*.{ts,tsx}', './matilha-ds/src/**/*.{ts,tsx}'],
};
```

### Classes de marca (brandbook)

| Classe | Uso |
|---|---|
| `.matilha-brand-canvas` | Fundo preto + texto branco + Moderat |
| `.matilha-btn-primary` | Botão amarelo `#FBD951` — **identidade Matilha** |
| `.matilha-btn-secondary` | Outline amarelo em fundo claro |
| `.matilha-btn-brand-outline` | Outline branco sobre preto |
| `.matilha-btn-ui` | Botão azul UI Kit `#2B63E3` (dashboards) |
| `.matilha-card-brand` | Card escuro de marca |

### Fontes oficiais (self-hosted em `fonts/`)

- **Moderat** — marca, display, headings (`font-brand`)
- **Roboto Slab** — corpo (`font-body`)
- **Roboto Mono** — mono (`font-mono`)

## Componentes disponíveis

```tsx
import {
  Button,
  Input,
  TextArea,
  Radio,
  Checkbox,
  Switch,
  Typography,
  TipBox,
  Logo,
  BrandElement,
  Tagline,
  Badge,
  ColorDots,
} from '@matilha/design-system';
```

| Componente | Uso principal |
|---|---|
| `Button` | `variant`: **primary** (amarelo marca) · **secondary** (outline amarelo) · **secondary-inverted** (outline branco) · **ui** (azul dashboard) · `size`: large · medium |
| `Input` / `TextArea` | Formulários com label, helper, error |
| `Radio` / `Checkbox` / `Switch` | Seleção |
| `Typography` | h1–h6, paragraph-*, caption, overline, link, label |
| `TipBox` | Dicas: info, warning, success, danger |
| `Logo` | matilha, m, craftedby, badge |
| `Tagline` | "Um só não faz uma matilha." |
| `Badge` | Labels uppercase estilo blog |
| `ColorDots` | Paleta de 7 cores da marca |
| `BrandElement` | Elementos visuais (Dawn, Asterisk, Grid…) |

## Tokens mais usados

```css
/* Identidade — interação padrão (substitui azul em focus/checked) */
var(--matilha-interactive)           /* #FBD951 — amarelo marca */
var(--matilha-interactive-on)        /* preto — ícone/texto sobre amarelo */
var(--matilha-focus-ring-brand)

/* UI Kit (apps internos — variant="ui" no Button) */
var(--matilha-primary-300)    /* #2B63E3 */
var(--matilha-neutral-100)    /* fundo */
var(--matilha-neutral-900)    /* texto */
var(--matilha-neutral-300)    /* borda input */
var(--matilha-shadow-200)
var(--matilha-radius-sm)      /* 4px — button, input */
var(--matilha-focus-ring)

/* Branding */
var(--matilha-brand-yellow)
var(--matilha-brand-blue)
var(--matilha-brand-dark-orange)
var(--matilha-font-brand)     /* Moderat */
```

## Tipografia

```tsx
<Typography variant="h4">Título</Typography>
<Typography variant="paragraph-medium">Corpo</Typography>
<Typography variant="overline">Seção</Typography>
```

## Exemplo de formulário

```tsx
import { Typography, Input, Checkbox, Button } from '@matilha/design-system';

export function LoginForm() {
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
      <Typography variant="h5">Entrar</Typography>
      <Input label="E-mail" type="email" placeholder="seu@email.com" />
      <Input label="Senha" type="password" />
      <Checkbox label="Lembrar-me" />
      <Button variant="primary" size="large">Entrar</Button>
    </form>
  );
}
```

## Figma (referência visual)

- UI Kit Styleguide: `JCPqaAjUdsx23SgfkLMCj2` → node `1535:819`
- Branding: `NdXU8DZIy1CTIABGRPXiI5` → node `4064:5297`

## Documentação completa

- `matilha-ds/AGENTS.md` — referência técnica de todos os exports
- Storybook (preview visual): repositório `design-system-matilha` → `npm run storybook`
