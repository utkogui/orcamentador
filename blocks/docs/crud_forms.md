# CRUD, Cadastros e Formulários

Blocos de cadastro, listagem, detalhe, edição, filtros e formulários complexos.

## CRUD simples

**ID:** `crud_simple`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- cadastro
- cadastrar
- gerenciar itens
- lista e edição

### Resumo

Conjunto básico para criar, listar, editar, visualizar e excluir um tipo de registro.

### Inclui

- Listagem
- Criar
- Editar
- Excluir
- Visualizar detalhe
- Validação
- Mensagens de erro
- Estado vazio

### Não inclui

- Filtros avançados
- Ações em massa
- Workflow
- Importação
- Exportação

### Páginas / Fluxos

- Lista
- Novo
- Editar
- Detalhe

### Dependências

- auth_basic_login

### Normalmente acompanha

- table_basic
- form_basic

### Perguntas para o comercial

- Que entidade será cadastrada?
- Quais campos existem?
- Quem pode criar, editar ou excluir?

### Observações comerciais

- 'Cadastro' pode significar CRUD simples, formulário complexo ou fluxo de inscrição. Sempre confirmar.

---

## Tabela avançada com filtros

**ID:** `table_advanced_filters`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- tabela
- filtros
- busca avançada
- ordenar
- paginação

### Resumo

Tabela robusta para listar dados com busca, filtros, ordenação, paginação e ações.

### Inclui

- Busca
- Filtros
- Ordenação
- Paginação
- Seleção múltipla
- Ações em massa
- Colunas configuráveis

### Não inclui

- BI
- Exportação complexa
- Edição inline avançada

### Páginas / Fluxos

- Listagem avançada

### Dependências

- crud_simple

### Normalmente acompanha

- report_excel_csv

### Perguntas para o comercial

- Quais filtros são necessários?
- A tabela precisa exportar?
- Terá ações em massa?

### Observações comerciais

- Tabela avançada pode consumir mais esforço que o cadastro em si.

---

## Formulário complexo

**ID:** `form_complex`  
**Complexidade inicial:** alta  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- formulário grande
- várias etapas
- muitos campos
- questionário

### Resumo

Formulário com muitos campos, regras condicionais, validações, etapas ou rascunho.

### Inclui

- Muitos campos
- Campos condicionais
- Máscaras
- Validações
- Etapas
- Salvar rascunho
- Revisão antes de enviar

### Não inclui

- Workflow de aprovação
- Assinatura digital
- OCR
- Pagamento

### Páginas / Fluxos

- Formulário etapa 1
- Formulário etapa 2
- Revisão
- Confirmação

### Dependências

- Nenhum

### Normalmente acompanha

- file_upload_simple
- workflow_status_simple

### Perguntas para o comercial

- Quantos campos existem?
- Existem regras condicionais?
- Precisa salvar rascunho?
- Há validação externa?

### Observações comerciais

- Formulário complexo deve ser tratado como bloco próprio, não como 'uma tela'.
