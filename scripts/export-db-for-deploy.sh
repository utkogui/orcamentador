#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB="$ROOT/prisma/dev.db"
OUT_DIR="$ROOT/deploy"
OUT_FILE="$OUT_DIR/local-data.sql"

if [[ ! -f "$DB" ]]; then
  echo "❌ Banco não encontrado: $DB"
  echo "   Rode o app local ou: npm run db:push && npm run db:seed"
  exit 1
fi

mkdir -p "$OUT_DIR"
sqlite3 "$DB" .dump > "$OUT_FILE"

ESTIMATES="$(sqlite3 "$DB" "SELECT count(*) FROM Estimate;")"
MODULES="$(sqlite3 "$DB" "SELECT count(*) FROM Module;")"

echo "✅ Dump gerado: $OUT_FILE"
echo "   Estimates: $ESTIMATES | Modules (catálogo): $MODULES"
echo ""
echo "Próximo passo (Turso):"
echo "  turso db shell estimador-matilha < deploy/local-data.sql"
echo ""
echo "Ver guia: docs/DEPLOY-NETLIFY.md"
