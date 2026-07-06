#!/bin/sh
# Copia a regra Cursor para a raiz do projeto consumidor.
# Uso: na raiz do seu app, onde matilha-ds/ está:
#   ./matilha-ds/setup-cursor.sh

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RULE_SRC="$(dirname "$0")/.cursor/rules/matilha-ui.mdc"
RULE_DEST="$ROOT/.cursor/rules/matilha-ui.mdc"

if [ ! -f "$RULE_SRC" ]; then
  echo "Erro: regra não encontrada em $RULE_SRC"
  exit 1
fi

mkdir -p "$ROOT/.cursor/rules"
cp "$RULE_SRC" "$RULE_DEST"
echo "Regra instalada em $RULE_DEST"
echo "O Cursor passará a aplicar as regras Matilha UI automaticamente."
