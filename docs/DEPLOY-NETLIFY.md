# Deploy no Netlify — Estimador Matilha

Guia para publicar o Estimador no Netlify **com os dados já criados localmente** (estimativas, módulos, disciplinas, etc.).

## Por que não dá para só subir o `dev.db`

O app usa **SQLite** (`prisma/dev.db`). No Netlify as funções serverless têm filesystem **efêmero**: o `.db` local não persiste entre requests e não é compartilhado entre instâncias.

**Solução recomendada:** [Turso](https://turso.tech) (SQLite na nuvem, compatível com Prisma). Você migra o banco local uma vez e o Netlify aponta para ele.

---

## O que você já tem localmente (snapshot)

Snapshot atual do `prisma/dev.db` local (ao rodar `npm run db:export`):

| Tabela | Qtd. / conteúdo |
|--------|-----------------|
| `Estimate` | **25** (ex.: Website project / Benn, Venn, AECUS, Maiara, etc.) |
| `EstimateModule` | **167** |
| `Module` | **9** (catálogo) |
| `Discipline` | **5** |
| Knowledge JSON | Building blocks, engineering, journeys (vão no código, não no SQLite) |

Links públicos depois do deploy:

```text
https://SEU-SITE.netlify.app/p/<estimateId>
```

Exemplo com o ID da Venn/Benn:

```text
https://SEU-SITE.netlify.app/p/cmshjwauv00003kpbbqdglpl9
```

---

## Visão geral do fluxo

```text
1. Exportar prisma/dev.db → deploy/local-data.sql
2. Criar banco Turso e importar o SQL
3. Ajustar Prisma client (adapter LibSQL) — já previsto no código
4. Configurar variáveis no Netlify
5. Conectar o Git e fazer o deploy
6. Validar /estimates e /p/<id>
```

---

## 1. Pré-requisitos

- Conta [Netlify](https://app.netlify.com)
- Conta [Turso](https://turso.tech) + CLI (`curl -sSfL https://get.tur.so/install.sh | bash`)
- Repo no GitHub/GitLab/Bitbucket
- Node **20+** no Netlify (Site settings → Build → Environment)
- `OPENAI_API_KEY` se for usar IA / briefing

---

## 2. Exportar os dados locais

Na raiz do projeto (com o app parado ou ok se o SQLite não estiver locked):

```bash
npm run db:export
```

Isso gera:

```text
deploy/local-data.sql
```

Esse arquivo **não deve ir para o Git** (já está no `.gitignore`) — ele pode conter nomes de clientes. Use só para importar no Turso.

Conferir:

```bash
wc -l deploy/local-data.sql
grep -c "INSERT INTO Estimate" deploy/local-data.sql || true
```

---

## 3. Criar banco Turso e importar

```bash
# Login
turso auth login

# Criar DB (escolha a região mais próxima)
turso db create estimador-matilha

# URL do banco
turso db show estimador-matilha --url

# Token
turso db tokens create estimador-matilha
```

Importar o dump:

```bash
turso db shell estimador-matilha < deploy/local-data.sql
```

Validar:

```bash
turso db shell estimador-matilha "SELECT id, name, clientName FROM Estimate ORDER BY updatedAt DESC LIMIT 5;"
```

Anote:

- `TURSO_DATABASE_URL` → `libsql://estimador-matilha-....turso.io`
- `TURSO_AUTH_TOKEN` → token gerado

---

## 4. Variáveis de ambiente

### Local (`.env`)

```env
# Desenvolvimento continua no SQLite local
DATABASE_URL="file:./dev.db"

# Opcional: apontar local para Turso (testar antes do Netlify)
# TURSO_DATABASE_URL="libsql://estimador-matilha-XXXX.turso.io"
# TURSO_AUTH_TOKEN="eyJ..."

OPENAI_API_KEY="sk-..."
```

### Netlify (Site settings → Environment variables)

| Variável | Valor |
|----------|--------|
| `TURSO_DATABASE_URL` | `libsql://...turso.io` |
| `TURSO_AUTH_TOKEN` | token Turso |
| `DATABASE_URL` | `file:./prisma/dev.db` (só para o `prisma generate` no build; runtime usa Turso) |
| `OPENAI_API_KEY` | chave OpenAI |
| `NODE_VERSION` | `20` |

Scopes: **Builds** + **Functions** (runtime).

---

## 5. Configuração Netlify

Arquivo [`netlify.toml`](../netlify.toml) na raiz:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NEXT_TELEMETRY_DISABLED = "1"
```

O runtime Next.js no Netlify (OpenNext) é aplicado automaticamente para Next 13.5+.

### Dashboard

1. **Add new site → Import an existing project**
2. Escolher o repositório
3. Build command: `npm run build`
4. Publish directory: `.next` (ou deixe a detecção automática)
5. Colar as env vars da tabela acima
6. Deploy

### CLI (alternativa)

```bash
npm i -g netlify-cli
netlify login
netlify init
netlify env:set TURSO_DATABASE_URL "libsql://..."
netlify env:set TURSO_AUTH_TOKEN "..."
netlify env:set DATABASE_URL "file:./prisma/dev.db"
netlify env:set OPENAI_API_KEY "sk-..."
netlify env:set NODE_VERSION "20"
netlify deploy --prod
```

---

## 6. Como o app escolhe o banco

Em [`src/lib/prisma.ts`](../src/lib/prisma.ts):

- Se existirem `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` → conecta no Turso (LibSQL)
- Senão → SQLite local (`DATABASE_URL` / `file:./dev.db`)

Assim o desenvolvimento local não muda.

---

## 7. Checklist pós-deploy

- [ ] `https://SEU-SITE.netlify.app/` abre
- [ ] `/estimates` lista as estimativas importadas
- [ ] `/p/cmshjwauv00003kpbbqdglpl9` abre a proposta compartilhada (sem menu interno)
- [ ] Criar uma estimativa nova e ver se persiste após refresh
- [ ] Briefing IA funciona (se `OPENAI_API_KEY` estiver setada)
- [ ] Knowledge (`/knowledge`) carrega (JSON no repo, não depende do SQLite)

---

## 8. Atualizar dados depois do go-live

### Do local → Turso de novo

```bash
npm run db:export
turso db shell estimador-matilha < deploy/local-data.sql
```

> Atenção: reimportar um dump completo pode conflitar com dados novos já criados em produção. Prefira migrar só o que falta ou usar Turso como fonte da verdade após o go-live.

### Só catálogo (seed Prisma)

```bash
# Com TURSO_* no .env apontando para produção:
npx prisma db push
npm run db:seed
```

O seed **não** recria as estimativas manuais/IA — só módulos/disciplinas/multiplicadores do `prisma/seed.ts`.

---

## 9. Links úteis para o comercial

Depois do deploy, compartilhe sempre a rota pública:

```text
https://SEU-SITE.netlify.app/p/<estimateId>
```

Na tela da estimativa (`/estimates/<id>`) use **Copiar link do comercial**.

---

## 10. Problemas comuns

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| Build ok, `/estimates` vazio | Turso sem import ou env errada | Conferir `TURSO_*` e rodar o `db shell < dump` |
| Erro Prisma adapter | Pacotes LibSQL ausentes | `npm i @libsql/client @prisma/adapter-libsql` |
| IA falha | Sem `OPENAI_API_KEY` no Netlify | Setar na UI do Netlify e redeploy |
| Mudanças no DB “somem” | Ainda usando SQLite file no runtime | Garantir `TURSO_*` nas Functions |
| `/p/...` 404 | ID errado ou estimate não importada | Conferir `SELECT id FROM Estimate` no Turso |

---

## 11. Segurança (importante)

- A rota `/p/[id]` é **pública** (cuid dificulta adivinhação, mas não é autenticação).
- Não commitar `.env`, `deploy/local-data.sql` nem `prisma/dev.db`.
- Tokens Turso e OpenAI só nas env vars do Netlify.
- Para clientes externos sensíveis, considere autenticação ou tokens de share no futuro.

---

## 12. Comandos rápidos

```bash
# Exportar dados locais
npm run db:export

# Build igual ao Netlify
npm run build

# Testes
npm test
npm run test:e2e
```
