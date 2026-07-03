# Dashboards e Analytics

Blocos de painéis, indicadores, gráficos, filtros, BI e visualização de dados.

## Dashboard simples

**ID:** `dashboard_simple`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- dashboard
- painel
- home logada
- visão geral

### Resumo

Página inicial logada com indicadores simples, atalhos e últimos registros.

### Inclui

- Cards de indicadores
- Atalhos principais
- Últimos registros
- Estado vazio
- Loading
- Erro

### Não inclui

- Gráficos complexos
- BI
- Tempo real
- Exportação
- Drill-down

### Páginas / Fluxos

- Dashboard

### Dependências

- auth_basic_login

### Normalmente acompanha

- crud_simple
- report_basic_export

### Perguntas para o comercial

- Quais indicadores aparecem?
- Os dados já existem?
- Precisa filtrar por período?

### Observações comerciais

- Cliente costuma chamar tudo de dashboard. Separar painel simples, gráficos e BI.

---

## Dashboard com gráficos

**ID:** `dashboard_charts`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- gráficos
- dashboard com gráficos
- indicadores visuais
- KPI

### Resumo

Dashboard com visualização gráfica de dados e filtros básicos.

### Inclui

- Gráfico de linha
- Gráfico de barra
- Gráfico de pizza/donut
- Filtros por período
- Cards de KPI
- Dados agregados

### Não inclui

- BI avançado
- Drill-down
- Exportação complexa
- Tempo real

### Páginas / Fluxos

- Dashboard com gráficos

### Dependências

- dashboard_simple

### Normalmente acompanha

- table_advanced_filters
- report_basic_export

### Perguntas para o comercial

- Quais métricas serão calculadas?
- Qual fonte dos dados?
- Precisa comparar períodos?

### Observações comerciais

- Gráfico não é só visual: precisa dado confiável, regra de cálculo e consulta.

---

## Dashboard executivo / BI

**ID:** `dashboard_bi`  
**Complexidade inicial:** alta  
**Disciplinas:** Estratégia, UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- BI
- dashboard executivo
- painel gerencial
- relatórios gerenciais

### Resumo

Painel avançado com filtros, segmentações, comparativos e exploração de dados.

### Inclui

- Múltiplos filtros
- Comparativos
- Períodos
- Segmentações
- Exportação
- Drill-down
- Permissões por visão

### Não inclui

- Data warehouse
- ETL complexo
- Modelagem BI corporativa
- Power BI externo

### Páginas / Fluxos

- Painel BI
- Visões filtradas
- Detalhamento de indicador

### Dependências

- dashboard_charts

### Normalmente acompanha

- report_pdf
- report_excel_csv
- audit_log

### Perguntas para o comercial

- Quais decisões o painel precisa apoiar?
- Dados vêm de quais sistemas?
- Quem pode ver quais indicadores?

### Observações comerciais

- Dashboard executivo deve ter peso alto. Normalmente exige descoberta, modelagem e validação de regra de negócio.
