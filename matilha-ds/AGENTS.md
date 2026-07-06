# Matilha Design System — Documentação do pacote

> Documentação técnica da biblioteca. Para **projetos consumidores**, copie a pasta `matilha-ds/` na raiz do app.

> **Fonte de verdade Figma:** [UI Kit Styleguide](https://www.figma.com/design/JCPqaAjUdsx23SgfkLMCj2/UI-Kit--base-?node-id=1535-819) · [Branding](https://www.figma.com/design/NdXU8DZIy1CTIABGRPXiI5/Branding?node-id=4064-5297)

**Preview visual:** `npm run storybook` → http://localhost:6006

## Regras obrigatórias

1. **Nunca hardcode cores** — use tokens CSS (`var(--matilha-primary-300)`) ou imports de `@matilha/design-system/tokens`
2. **Nunca recrie componentes** que já existem neste pacote
3. **Tipografia** — use `<Typography variant="h1">` ou classes `.matilha-h1`
4. **Ícones** — consulte `iconRegistry`; prefira `@heroicons/react/24/outline` com nomes do registry
5. **Estados interativos** — Button, Input, Radio, Checkbox e Switch já implementam hover, focus, disabled e error

## Catálogo de componentes

| Componente | Import | Variantes / Props principais |
|---|---|---|
| `Button` | `@matilha/design-system` | `variant`: **primary** (amarelo marca), **secondary**, **secondary-inverted**, **ui** (azul) · `size`: large, medium · `loading` |
| `Input` | `@matilha/design-system` | `label`, `helperText`, `error`, `startIcon`, `endIcon` |
| `TextArea` | `@matilha/design-system` | `label`, `helperText`, `error`, `rows` |
| `Radio` | `@matilha/design-system` | `label`, `name` (agrupar com mesmo name) |
| `Checkbox` | `@matilha/design-system` | `label`, `indeterminate` |
| `Switch` | `@matilha/design-system` | `label`, `checked` |
| `Typography` | `@matilha/design-system` | `variant`: h1–h6, paragraph-*, caption, overline, link, label |
| `TipBox` | `@matilha/design-system` | `variant`: info, warning, success, danger |

## Tokens disponíveis

### Cores
- **Neutral:** 100–1000 (grey scale)
- **Brand Primary:** 100–300 (base `#2B63E3`), 400–500
- **Brand Secondary:** 100–300 (`#8247FF`), 400–500
- **System:** success, warning, danger (100–300)
- **Alpha:** light/dark 100–300

### Tipografia
- **Marca / headings:** Moderat (self-hosted em `fonts/Moderat/`)
- **Corpo UI:** Roboto Slab (`fonts/Roboto/`)
- **Mono:** Roboto Mono
- **Display/Heading (legado UI Kit):** Moderat substitui Anybody/Roboto Flex
- **Body (legado):** Roboto Slab substitui Inter
- **Interactive:** Moderat (buttons, labels)

### Sombras
- `shadow-100` até `shadow-500` — CSS: `var(--matilha-shadow-100)`

### Espaçamento & Radius
- `--matilha-space-1` (4px) até `--matilha-space-8` (56px)
- `--matilha-radius-sm` (4px) — padrão de inputs e buttons

## Seções do Styleguide mapeadas

| Seção Figma | Implementação |
|---|---|
| Color | `src/tokens/colors.ts` + `src/styles/tokens.css` |
| Typography | `Typography` + `typography.css` |
| Effect (Shadow) | `src/tokens/shadows.ts` |
| Icons | `iconRegistry` (Heroicons + Custom + Logos) |
| Button | `Button` (Primary, Secondary, Secondary Inverted) |
| Inputs | `Input`, `TextArea` |
| Selection | `Radio`, `Checkbox`, `Switch` |
| Utilities | `TipBox`, focus ring (`.matilha-focus-ring`) |

## Exemplo completo

```tsx
import {
  Button,
  Input,
  Checkbox,
  Switch,
  Typography,
  TipBox,
} from '@matilha/design-system';
import { PlusIcon } from '@heroicons/react/24/outline';

export function ExampleForm() {
  return (
    <form>
      <Typography variant="h4">Cadastro</Typography>
      <Input label="E-mail" type="email" placeholder="seu@email.com" />
      <Checkbox label="Aceito os termos" />
      <Switch label="Receber novidades" />
      <TipBox title="Dica" variant="info">
        Use sempre componentes Matilha neste projeto.
      </TipBox>
      <Button variant="primary" size="large" startIcon={<PlusIcon className="w-6 h-6" />}>
        Salvar
      </Button>
    </form>
  );
}
```

## Figma fileKey para referência

- **UI Kit Styleguide:** `JCPqaAjUdsx23SgfkLMCj2` → node `1535:819`
- **Branding:** `NdXU8DZIy1CTIABGRPXiI5` → node `4064:5297`

## Camada Brand (Figma Branding)

Componentes e tokens de identidade visual Matilha:

| Componente | Import | Uso |
|---|---|---|
| `Logo` | `@matilha/design-system` | `variant`: matilha, m, craftedby, badge |
| `BrandElement` | `@matilha/design-system` | `name`: Dawn, Asterisk, Grid, Portal… (33 elementos) |
| `Tagline` | `@matilha/design-system` | "Um só não faz uma matilha." |
| `Badge` | `@matilha/design-system` | Labels estilo "NOVO POST NO BLOG" |
| `ColorDots` | `@matilha/design-system` | Paleta vertical de 7 cores da marca |

### Cores de marca (CSS)

```css
var(--matilha-brand-yellow)      /* #FBD951 */
var(--matilha-brand-dark-orange) /* #EB6239 */
var(--matilha-brand-blue)        /* #3CA8FB */
var(--matilha-brand-purple)      /* #BC83F3 */
var(--matilha-brand-pink)        /* #FEA0FB */
```

### Tipografia de marca

Fontes self-hosted em `fonts/`: **Moderat** (marca) + **Roboto Slab** (corpo) + **Roboto Mono** (mono).

```tsx
import { Logo, Tagline, ColorDots, BrandElement } from '@matilha/design-system';

<Logo variant="matilha" />
<Tagline />
<ColorDots count={7} />
<BrandElement name="Dawn" />
```

### Tailwind preset

```ts
import matilhaPreset from '@matilha/design-system/tailwind';
```

Classes: `.matilha-brand-canvas`, `.matilha-btn-primary`, `.matilha-btn-ui`, `bg-brand-yellow`, `font-brand`.
