# Comunicação

Blocos de e-mail, notificações, WhatsApp, SMS e mensagens internas.

## E-mail transacional

**ID:** `transactional_email`  
**Complexidade inicial:** baixa  
**Disciplinas:** UI, Frontend, Backend, QA

### Cliente costuma chamar de

- enviar e-mail
- e-mail automático
- notificação por e-mail
- template de e-mail

### Resumo

Envio automático de e-mails disparados por ações do sistema.

### Inclui

- Configuração de provedor
- Template de e-mail
- Variáveis dinâmicas
- Envio
- Tratamento de erro
- Logs básicos

### Não inclui

- Campanhas de marketing
- Newsletter
- Automação CRM avançada

### Páginas / Fluxos

- Template de e-mail
- Logs básicos opcional

### Dependências

- Nenhum

### Normalmente acompanha

- auth_forgot_password
- auth_email_confirmation
- member_invite

### Perguntas para o comercial

- Qual provedor será usado?
- Quais eventos enviam e-mail?
- O cliente já tem domínio configurado?

### Observações comerciais

- Muitos fluxos dependem deste bloco: recuperação de senha, convite, confirmação e comprovantes.

---

## Notificações internas

**ID:** `internal_notifications`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- notificações
- sininho
- alertas internos
- avisos no sistema

### Resumo

Central interna para exibir notificações dentro do sistema.

### Inclui

- Ícone de notificações
- Lista de notificações
- Contador
- Marcar como lida
- Link para item relacionado

### Não inclui

- Push mobile
- Tempo real com websocket
- E-mail/SMS

### Páginas / Fluxos

- Central de notificações
- Dropdown de notificações

### Dependências

- auth_basic_login

### Normalmente acompanha

- workflow_approval
- comments

### Perguntas para o comercial

- Notificações precisam ser em tempo real?
- Quais eventos geram notificação?
- Precisa enviar e-mail junto?

### Observações comerciais

- Notificação interna pode ser simples ou virar sistema de comunicação complexo.

---

## WhatsApp / SMS

**ID:** `whatsapp_sms`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Backend, QA

### Cliente costuma chamar de

- WhatsApp
- SMS
- mandar mensagem
- notificar no celular

### Resumo

Envio de mensagens via WhatsApp ou SMS usando provedor externo.

### Inclui

- Integração com provedor
- Templates
- Envio
- Logs
- Tratamento de falha

### Não inclui

- Chat bidirecional completo
- Atendimento humano
- CRM WhatsApp

### Páginas / Fluxos

- Configuração de templates
- Logs de envio opcional

### Dependências

- Nenhum

### Normalmente acompanha

- workflow_approval
- transactional_email

### Perguntas para o comercial

- Será WhatsApp, SMS ou ambos?
- Já existe provedor?
- Precisa aprovar template?
- É envio único ou conversa?

### Observações comerciais

- Depende de provedor, aprovação de template e regras externas.
