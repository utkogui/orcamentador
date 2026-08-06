#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB="$ROOT/prisma/dev.db"
OUT_DIR="$ROOT/deploy"
OUT_FILE="$OUT_DIR/local-data.sql"
TURSO_FILE="$OUT_DIR/local-data.turso.sql"

if [[ ! -f "$DB" ]]; then
  echo "❌ Banco não encontrado: $DB"
  echo "   Rode o app local ou: npm run db:push && npm run db:seed"
  exit 1
fi

mkdir -p "$OUT_DIR"
sqlite3 "$DB" .dump > "$OUT_FILE"

# Turso/libSQL não tem unistr(); converte para strings SQL compatíveis
python3 - <<'PY' "$OUT_FILE" "$TURSO_FILE"
import codecs, pathlib, re, sys
src, dst = map(pathlib.Path, sys.argv[1:3])
text = src.read_text(encoding="utf-8")
pattern = re.compile(r"unistr\('((?:\\'|\\\\|[^'])*)'\)")

def repl(m: re.Match) -> str:
    decoded = codecs.decode(m.group(1), "unicode_escape")
    return "'" + decoded.replace("'", "''") + "'"

new_text, n = pattern.subn(repl, text)
dst.write_text(new_text, encoding="utf-8")
print(f"   Turso dump: {dst.name} (unistr convertidos: {n})")
PY

ESTIMATES="$(sqlite3 "$DB" "SELECT count(*) FROM Estimate;")"
MODULES="$(sqlite3 "$DB" "SELECT count(*) FROM Module;")"

echo "✅ Dump gerado: $OUT_FILE"
echo "   Estimates: $ESTIMATES | Modules (catálogo): $MODULES"
echo ""
echo "Próximo passo (Turso):"
echo "  turso db shell estimador-matilha < deploy/local-data.turso.sql"
echo ""
echo "Ver guia: docs/DEPLOY-NETLIFY.md"
