# Relatórios e Exportações

Blocos de relatórios PDF, CSV, Excel e envio agendado.

## Exportação CSV / Excel

**ID:** `report_excel_csv`  
**Complexidade inicial:** baixa  
**Disciplinas:** Frontend, Backend, QA

### Cliente costuma chamar de

- exportar Excel
- baixar CSV
- planilha
- relatório em Excel

### Resumo

Geração de arquivo tabular com dados do sistema, respeitando filtros e permissões.

### Inclui

- Selecionar dados
- Gerar arquivo
- Download
- Respeitar filtros
- Tratar volume de dados

### Não inclui

- Template visual avançado
- Relatório PDF
- Envio agendado

### Páginas / Fluxos

- Botão exportar
- Download

### Dependências

- Nenhum

### Normalmente acompanha

- table_advanced_filters

### Perguntas para o comercial

- Quais dados entram?
- Respeita filtros da tela?
- Qual volume esperado?
- Precisa de layout específico?

### Observações comerciais

- Exportar dados filtrados é diferente de exportar toda a base.

---

## Relatório PDF

**ID:** `report_pdf`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- gerar PDF
- baixar PDF
- relatório em PDF
- comprovante

### Resumo

Geração de PDF com layout, dados dinâmicos e estrutura visual.

### Inclui

- Template visual
- Dados dinâmicos
- Geração PDF
- Download
- Cabeçalho/rodapé
- Tratamento de quebra de página

### Não inclui

- Assinatura digital
- Envio automático
- Relatório agendado

### Páginas / Fluxos

- Preview opcional
- Download PDF

### Dependências

- Nenhum

### Normalmente acompanha

- transactional_email

### Perguntas para o comercial

- PDF precisa seguir identidade visual?
- É relatório, comprovante ou contrato?
- Precisa ser enviado por e-mail?

### Observações comerciais

- PDF pode variar de simples comprovante a documento complexo com múltiplas páginas e regras de layout.

---

## Relatórios agendados

**ID:** `scheduled_reports`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA, DevOps

### Cliente costuma chamar de

- relatório automático
- enviar todo mês
- agendar envio
- relatório recorrente

### Resumo

Geração e envio automático de relatórios em uma frequência definida.

### Inclui

- Escolher frequência
- Destinatários
- Geração automática
- Envio por e-mail
- Histórico de envios

### Não inclui

- BI avançado
- Data warehouse
- Aprovação de relatório

### Páginas / Fluxos

- Configuração de agendamento
- Histórico de envios

### Dependências

- transactional_email
- report_pdf

### Normalmente acompanha

- report_excel_csv

### Perguntas para o comercial

- Qual frequência?
- Quem recebe?
- Qual formato?
- Precisa log de envio?

### Observações comerciais

- Agendamento adiciona rotina de backend, filas ou cron, logs e tratamento de falhas.
