# matilha-ds — Kit para colar em outros projetos

Copie **esta pasta inteira** (`matilha-ds/`) para a raiz do seu app:

```
seu-projeto/
├── matilha-ds/          ← esta pasta (pacote + regras)
├── .cursor/rules/       ← gerado por setup-cursor.sh (opcional)
└── src/
```

## Passo a passo

### 1. Copie a pasta

```bash
cp -R matilha-ds /caminho/do/seu-projeto/
```

### 2. Instale o pacote

Na raiz do seu app:

```bash
npm install file:./matilha-ds
```

### 3. Importe os estilos

No entry point (`main.tsx`, `layout.tsx`, etc.):

```tsx
import '@matilha/design-system/styles/global.css';
```

### 4. Configure o Cursor (escolha uma)

**Automático (recomendado)** — rode uma vez:

```bash
chmod +x matilha-ds/setup-cursor.sh
./matilha-ds/setup-cursor.sh
```

**Manual** — no chat, digite `@matilha-ds` e use o prompt de `PROMPT.md`.

### 5. Visualizar componentes

No repositório do design system:

```bash
cd design-system-matilha
npm run install:all
npm run storybook
```

---

## Conteúdo desta pasta

| Arquivo | Função |
|---|---|
| `src/` | Componentes e tokens (`@matilha/design-system`) |
| `MATILHA-UI.md` | Regras de UI para o agente |
| `PROMPT.md` | Prompts prontos para o Cursor |
| `AGENTS.md` | Referência técnica completa |
| `setup-cursor.sh` | Instala regra em `.cursor/rules/` |
| `.cursor/rules/` | Template da regra (copiado pelo script) |
