#!/bin/sh
# Configura @matilha/design-system no projeto consumidor.
#
# Pré-requisito: pasta matilha-ds/ na raiz do app.
# Uso (na raiz do seu projeto):
#   chmod +x matilha-ds/setup-project.sh
#   ./matilha-ds/setup-project.sh

set -e

MATILHA_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$MATILHA_DIR/.." && pwd)"
CSS_IMPORT="import '@matilha/design-system/styles/global.css';"

cd "$PROJECT_ROOT"

# --- validação ---
if [ ! -f "$MATILHA_DIR/package.json" ]; then
  echo "Erro: matilha-ds/package.json não encontrado."
  exit 1
fi

if [ ! -f "$PROJECT_ROOT/package.json" ]; then
  echo "Erro: rode na raiz do projeto (onde está matilha-ds/ e package.json)."
  exit 1
fi

echo "═══════════════════════════════════════════"
echo "  Matilha DS — setup em: $PROJECT_ROOT"
echo "═══════════════════════════════════════════"
echo ""

# --- 1. npm install ---
echo "→ Instalando @matilha/design-system..."
npm install "file:./matilha-ds"
echo ""

# --- 2. detectar entry point ---
ENTRY=""
for candidate in \
  "app/layout.tsx" "app/layout.jsx" "app/layout.ts" \
  "src/app/layout.tsx" "src/app/layout.jsx" "src/app/layout.ts" \
  "src/main.tsx" "src/main.ts" "src/main.jsx" \
  "src/index.tsx" "src/index.ts" "src/index.jsx" \
  "pages/_app.tsx" "pages/_app.jsx" \
  "src/App.tsx" "src/App.jsx" "src/App.ts"
do
  if [ -f "$candidate" ]; then
    ENTRY="$candidate"
    break
  fi
done

# --- 3. importar CSS global ---
if [ -n "$ENTRY" ]; then
  if grep -q "@matilha/design-system/styles/global.css" "$ENTRY"; then
    echo "→ CSS global já importado em $ENTRY"
  else
    echo "→ Adicionando CSS global em $ENTRY"
    tmp="${ENTRY}.matilha-tmp"
    printf '%s\n' "$CSS_IMPORT" > "$tmp"
    cat "$ENTRY" >> "$tmp"
    mv "$tmp" "$ENTRY"
    echo "   OK: import adicionado na primeira linha"
  fi
else
  echo "⚠ Não encontrei entry point automático (layout.tsx, main.tsx, App.tsx…)"
  echo "  Adicione manualmente no arquivo de entrada do app:"
  echo "  $CSS_IMPORT"
  echo ""
  echo "  Arquivos .tsx/.ts na raiz e em src/:"
  find . -maxdepth 3 \( -name 'layout.tsx' -o -name 'main.tsx' -o -name 'App.tsx' -o -name '_app.tsx' \) \
    -not -path './matilha-ds/*' -not -path './node_modules/*' 2>/dev/null | head -10 || true
fi
echo ""

# --- 4. Tailwind (necessário — global.css inclui @tailwind) ---
HAS_TW_CONFIG=false
for f in tailwind.config.ts tailwind.config.js tailwind.config.mjs tailwind.config.cjs; do
  if [ -f "$f" ]; then
    HAS_TW_CONFIG=true
    TW_CONFIG="$f"
    break
  fi
done

HAS_TW_DEPS=false
if grep -q '"tailwindcss"' package.json 2>/dev/null; then
  HAS_TW_DEPS=true
fi

if [ "$HAS_TW_CONFIG" = false ] && [ "$HAS_TW_DEPS" = false ]; then
  echo "→ Tailwind não detectado — instalando (obrigatório para os estilos Matilha)..."
  npm install -D tailwindcss postcss autoprefixer
  HAS_TW_DEPS=true
fi

if [ "$HAS_TW_CONFIG" = false ]; then
  echo "→ Criando tailwind.config.ts com preset Matilha..."
  cat > tailwind.config.ts << 'TWEOF'
import type { Config } from 'tailwindcss';
import matilhaPreset from '@matilha/design-system/tailwind';

export default {
  presets: [matilhaPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './matilha-ds/src/**/*.{js,ts,jsx,tsx}',
  ],
} satisfies Config;
TWEOF
  TW_CONFIG="tailwind.config.ts"
  echo "   OK: tailwind.config.ts criado"
else
  echo "→ Tailwind já configurado ($TW_CONFIG)"
  if grep -q "@matilha/design-system/tailwind" "$TW_CONFIG" 2>/dev/null; then
    echo "   Preset Matilha já referenciado"
  else
    echo "   ⚠ Adicione manualmente ao $TW_CONFIG:"
    echo ""
    echo "   import matilhaPreset from '@matilha/design-system/tailwind';"
    echo "   export default { presets: [matilhaPreset], content: [...] };"
    echo ""
  fi
fi

if [ ! -f postcss.config.js ] && [ ! -f postcss.config.mjs ] && [ ! -f postcss.config.cjs ]; then
  echo "→ Criando postcss.config.js..."
  cat > postcss.config.js << 'PCEOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
PCEOF
  echo "   OK: postcss.config.js criado"
fi
echo ""

# --- 5. Next.js — transpilePackages ---
IS_NEXT=false
if grep -q '"next"' package.json 2>/dev/null; then
  IS_NEXT=true
  echo "→ Next.js detectado"

  NEXT_CFG=""
  for f in next.config.ts next.config.js next.config.mjs; do
    if [ -f "$f" ]; then NEXT_CFG="$f"; break; fi
  done

  if [ -n "$NEXT_CFG" ]; then
    if grep -q "transpilePackages" "$NEXT_CFG" 2>/dev/null; then
      if grep -q "@matilha/design-system" "$NEXT_CFG" 2>/dev/null; then
        echo "   transpilePackages já inclui @matilha/design-system"
      else
        echo "   ⚠ Adicione '@matilha/design-system' em transpilePackages no $NEXT_CFG"
      fi
    else
      echo "   ⚠ Adicione ao $NEXT_CFG:"
      echo "   transpilePackages: ['@matilha/design-system'],"
    fi
  else
    echo "→ Criando next.config.ts..."
    cat > next.config.ts << 'NCEOF'
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@matilha/design-system'],
};

export default nextConfig;
NCEOF
    echo "   OK: next.config.ts criado"
  fi
  echo ""
fi

# --- 6. regra Cursor ---
echo "→ Instalando regra Cursor..."
sh "$MATILHA_DIR/setup-cursor.sh"
echo ""

# --- resumo ---
echo "═══════════════════════════════════════════"
echo "  Setup concluído"
echo "═══════════════════════════════════════════"
echo ""
echo "Próximos passos:"
echo ""
echo "  1. Reinicie o dev server (npm run dev)"
if [ -n "$ENTRY" ]; then
  echo "  2. CSS importado em: $ENTRY"
else
  echo "  2. Importe o CSS manualmente (veja aviso acima)"
fi
echo "  3. No Cursor, digite @matilha-ds e cole:"
echo ""
echo "     Use matilha-ds como única fonte de UI."
echo "     Leia MATILHA-UI.md. Importe só de @matilha/design-system."
echo "     Primary = amarelo marca. Não recrie componentes."
echo ""
if [ "$IS_NEXT" = true ]; then
  echo "  4. Confira transpilePackages no next.config (se ainda não existia)"
  echo ""
fi
echo "Teste rápido no código:"
echo ""
echo "  import { Button } from '@matilha/design-system';"
echo "  <Button variant=\"primary\">Teste</Button>"
echo ""
