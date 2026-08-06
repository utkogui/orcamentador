# Matilha Building Blocks v0.1

Este pacote contém a primeira versão do catálogo de Building Blocks da Matilha.

## Objetivo

Criar uma base de conhecimento para:

- interpretar briefings;
- treinar o time comercial;
- padronizar escopo;
- alimentar a API da OpenAI;
- reduzir erros de estimativa;
- separar o que está incluso, opcional e fora de escopo.

## Estrutura

```text
data/
  catalog.json
  all-building-blocks.json
  authentication.json
  users_permissions.json
  dashboard_analytics.json
  crud_forms.json
  files_documents.json
  communication.json
  reports_exports.json
  workflow.json
  integrations.json
  ai.json
  landing_institutional.json
  saas_essentials.json
  finance_payments.json
```

A fonte de verdade é o JSON em `data/`. O app carrega `all-building-blocks.json`.

## Total da v0.1

- Categorias: 13
- Building Blocks: 48

## Como usar na API

Use `data/all-building-blocks.json` como fonte principal para o modelo.

O modelo deve receber:
1. o briefing do cliente;
2. o catálogo de building blocks;
3. a instrução de classificar itens em:
   - explicitamente pedido;
   - provavelmente necessário;
   - opcional;
   - precisa de confirmação;
   - fora de escopo.

## Próximos passos sugeridos

1. Validar os nomes dos blocos com o time comercial.
2. Adicionar horas-base por disciplina.
3. Adicionar dependências e sinergias mais refinadas.
4. Criar blocos para e-commerce, mobile, marketplace, CRM, ERP e infraestrutura.
5. Cadastrar projetos históricos da Matilha para calibrar estimativas.
