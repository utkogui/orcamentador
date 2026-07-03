# Workflow

Blocos de status, aprovação, comentários, revisão e auditoria.

## Status simples

**ID:** `workflow_status_simple`  
**Complexidade inicial:** baixa  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- status
- etapas
- andamento
- situação

### Resumo

Controle simples de status de um registro, como rascunho, enviado, aprovado ou reprovado.

### Inclui

- Status do registro
- Alterar status
- Histórico básico
- Filtro por status

### Não inclui

- Aprovação com permissões
- Notificação
- Workflow configurável

### Páginas / Fluxos

- Detalhe com status
- Filtro por status

### Dependências

- crud_simple

### Normalmente acompanha

- workflow_approval

### Perguntas para o comercial

- Quais são os status?
- Quem pode mudar cada status?
- Precisa histórico?

### Observações comerciais

- Status simples pode virar workflow completo se houver regras por etapa.

---

## Aprovação / Revisão

**ID:** `workflow_approval`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- aprovar
- reprovar
- fluxo de aprovação
- revisão

### Resumo

Fluxo para enviar um item para aprovação, aprovar, reprovar e registrar justificativa.

### Inclui

- Enviar para aprovação
- Aprovar
- Reprovar
- Justificativa
- Histórico
- Notificação
- Permissões por etapa

### Não inclui

- Workflow configurável pelo usuário
- Assinatura digital
- SLA avançado

### Páginas / Fluxos

- Detalhe em revisão
- Modal de aprovação
- Histórico de aprovação

### Dependências

- workflow_status_simple
- roles_permissions

### Normalmente acompanha

- internal_notifications
- comments
- audit_log

### Perguntas para o comercial

- Quem aprova?
- Existe mais de uma etapa?
- Reprovação exige justificativa?
- Precisa notificar alguém?

### Observações comerciais

- Aprovação simples pode crescer muito quando há múltiplos perfis e etapas.

---

## Comentários

**ID:** `comments`  
**Complexidade inicial:** baixa  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- comentários
- observações
- conversa no item
- anotações

### Resumo

Permite registrar comentários associados a um item ou processo.

### Inclui

- Comentar
- Listar comentários
- Autor
- Data/hora
- Excluir comentário
- Notificação opcional

### Não inclui

- Chat em tempo real
- Menções
- Anexos em comentário

### Páginas / Fluxos

- Área de comentários

### Dependências

- auth_basic_login

### Normalmente acompanha

- workflow_approval
- internal_notifications

### Perguntas para o comercial

- Comentário é interno ou visível ao cliente?
- Pode excluir?
- Precisa notificar?
- Precisa anexar arquivo?

### Observações comerciais

- Comentário simples é diferente de chat, menções ou colaboração em tempo real.

---

## Histórico / Auditoria

**ID:** `audit_log`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- histórico
- log
- auditoria
- quem alterou

### Resumo

Registro de eventos importantes do sistema, indicando ação, usuário e data/hora.

### Inclui

- Registro de alterações
- Quem alterou
- Quando alterou
- Evento
- Filtro por evento

### Não inclui

- Auditoria compliance avançada
- Antes/depois completo
- Retenção legal

### Páginas / Fluxos

- Histórico do item
- Lista de logs opcional

### Dependências

- auth_basic_login

### Normalmente acompanha

- roles_permissions
- workflow_approval

### Perguntas para o comercial

- Quais eventos precisam ser auditados?
- Precisa ver antes/depois?
- Por quanto tempo os logs ficam salvos?

### Observações comerciais

- Auditoria pode ser básica ou requisito crítico de segurança/compliance.
