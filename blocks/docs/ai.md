# Inteligência Artificial

Blocos de IA generativa, classificação, OCR com IA, chat e geração de documentos.

## IA: análise de texto

**ID:** `ai_text_analysis`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, IA, QA

### Cliente costuma chamar de

- analisar texto
- IA analisa
- parecer automático
- interpretação por IA

### Resumo

Envia texto para modelo de IA e retorna análise estruturada ou explicação.

### Inclui

- Campo de entrada
- Envio para API
- Prompt estruturado
- Resposta formatada
- Tratamento de erro
- Logs básicos

### Não inclui

- Treinamento de modelo próprio
- RAG
- Chat completo
- Classificação em lote

### Páginas / Fluxos

- Entrada de dados
- Resultado da análise

### Dependências

- Nenhum

### Normalmente acompanha

- ocr_document
- ai_document_generation

### Perguntas para o comercial

- Qual texto será analisado?
- Qual formato de saída?
- A resposta precisa ser revisada por humano?
- Há dados sensíveis?

### Observações comerciais

- IA exige definição clara de entrada, saída, limite de erro e responsabilidade.

---

## IA: classificação automática

**ID:** `ai_classification`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, IA, QA

### Cliente costuma chamar de

- classificar automaticamente
- categorizar com IA
- triagem automática

### Resumo

Classifica entradas em categorias predefinidas usando IA.

### Inclui

- Entrada de dados
- Prompt de classificação
- Categorias
- Confiança
- Revisão manual
- Ajuste de resultado

### Não inclui

- Treinamento supervisionado próprio
- Modelo customizado
- MLOps

### Páginas / Fluxos

- Resultado da classificação
- Revisão manual

### Dependências

- Nenhum

### Normalmente acompanha

- ai_text_analysis
- workflow_approval

### Perguntas para o comercial

- Quais categorias existem?
- Qual taxa de erro aceitável?
- Haverá revisão humana?
- A classificação altera algum processo crítico?

### Observações comerciais

- Classificação automática precisa de exemplos, fallback e revisão quando o risco for alto.

---

## IA: geração de documento

**ID:** `ai_document_generation`  
**Complexidade inicial:** alta  
**Disciplinas:** UX, UI, Frontend, Backend, IA, QA

### Cliente costuma chamar de

- gerar documento
- gerar proposta
- gerar relatório com IA
- texto automático

### Resumo

Gera textos ou documentos estruturados a partir de dados informados.

### Inclui

- Coleta de dados
- Prompt estruturado
- Geração de texto
- Revisão
- Exportação
- Versionamento opcional

### Não inclui

- Assinatura digital
- Workflow jurídico
- Editor colaborativo avançado

### Páginas / Fluxos

- Formulário de entrada
- Documento gerado
- Revisão/edição

### Dependências

- Nenhum

### Normalmente acompanha

- report_pdf
- ai_text_analysis

### Perguntas para o comercial

- Qual documento será gerado?
- Existe modelo/base?
- Precisa edição manual?
- Precisa exportar em PDF/DOCX?

### Observações comerciais

- Geração de documento deve diferenciar rascunho assistido e documento final aprovado.

---

## Chat com IA

**ID:** `ai_chat`  
**Complexidade inicial:** alta  
**Disciplinas:** UX, UI, Frontend, Backend, IA, QA

### Cliente costuma chamar de

- chatbot
- chat com IA
- assistente
- perguntar para IA

### Resumo

Interface conversacional para interação com modelo de IA.

### Inclui

- Interface de chat
- Histórico
- Envio de mensagens
- Resposta simples ou streaming
- Contexto
- Limite de uso
- Tratamento de erro

### Não inclui

- RAG com base documental
- Agentes autônomos
- Atendimento humano integrado

### Páginas / Fluxos

- Chat
- Histórico de conversa

### Dependências

- Nenhum

### Normalmente acompanha

- ai_text_analysis

### Perguntas para o comercial

- O chat usa quais dados?
- Precisa histórico?
- Precisa limitar uso?
- Responde com base em documentos?

### Observações comerciais

- Chat simples é diferente de chatbot treinado com base de conhecimento ou agente com ações.
