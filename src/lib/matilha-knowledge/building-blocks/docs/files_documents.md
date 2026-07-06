# Arquivos e Documentos

Blocos de upload, gestão de arquivos, OCR, documentos e visualização.

## Upload simples de arquivo

**ID:** `file_upload_simple`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA, DevOps

### Cliente costuma chamar de

- upload
- anexar arquivo
- enviar documento
- mandar imagem

### Resumo

Permite selecionar, validar, enviar e baixar arquivos.

### Inclui

- Selecionar arquivo
- Validar tipo
- Validar tamanho
- Enviar arquivo
- Mostrar progresso
- Salvar referência
- Download

### Não inclui

- OCR
- Preview avançado
- Versionamento
- Assinatura digital

### Páginas / Fluxos

- Componente de upload
- Lista ou detalhe com arquivo

### Dependências

- Nenhum

### Normalmente acompanha

- document_management

### Perguntas para o comercial

- Quais tipos de arquivo?
- Qual tamanho máximo?
- Arquivos precisam ser privados?
- Precisa visualizar no navegador?

### Observações comerciais

- Upload simples ainda exige storage, validação, segurança e regras de acesso.

---

## Gestão de documentos

**ID:** `document_management`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA, DevOps

### Cliente costuma chamar de

- documentos
- arquivos
- biblioteca de documentos
- gestão documental

### Resumo

Área para listar, categorizar, visualizar, baixar e administrar documentos.

### Inclui

- Lista de documentos
- Upload
- Download
- Preview
- Excluir
- Categorizar
- Histórico
- Permissões

### Não inclui

- OCR
- Versionamento avançado
- Assinatura digital
- GED corporativo

### Páginas / Fluxos

- Lista de documentos
- Detalhe do documento
- Upload de documento

### Dependências

- file_upload_simple

### Normalmente acompanha

- roles_permissions
- audit_log

### Perguntas para o comercial

- Documentos são públicos ou privados?
- Precisa categorizar?
- Precisa histórico?
- Quem pode excluir?

### Observações comerciais

- Gestão de documentos é maior que upload: inclui organização, acesso e ciclo de vida do arquivo.

---

## OCR de documentos

**ID:** `ocr_document`  
**Complexidade inicial:** alta  
**Disciplinas:** UX, UI, Frontend, Backend, IA, QA

### Cliente costuma chamar de

- OCR
- ler documento
- extrair texto
- ler receita
- ler PDF

### Resumo

Extração automática de texto ou dados a partir de imagem/PDF usando serviço de OCR.

### Inclui

- Upload de documento
- Envio para OCR
- Extração de texto
- Tratamento de erro
- Revisão manual
- Armazenamento do resultado

### Não inclui

- IA de interpretação avançada
- Validação humana completa
- Treinamento de modelo próprio

### Páginas / Fluxos

- Upload
- Processando
- Resultado extraído
- Revisão manual

### Dependências

- file_upload_simple

### Normalmente acompanha

- ai_text_analysis
- form_complex

### Perguntas para o comercial

- Que tipo de documento será lido?
- O OCR precisa extrair texto livre ou campos específicos?
- Qual precisão esperada?
- Haverá revisão manual?

### Observações comerciais

- OCR nunca deve ser tratado como 'só upload'. Tem incerteza, custo de API e tratamento de erro.
