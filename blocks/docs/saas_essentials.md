# SaaS Essencial

Blocos comuns a produtos SaaS, como onboarding, configurações, assinatura e conta.

## Onboarding inicial

**ID:** `onboarding_first_access`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- onboarding
- primeiro acesso
- passo a passo
- configuração inicial

### Resumo

Fluxo guiado para configurar conta ou coletar informações no primeiro acesso.

### Inclui

- Primeira tela após cadastro
- Coleta de informações iniciais
- Passo a passo
- Progresso
- Finalização

### Não inclui

- Tour interativo avançado
- Gamificação
- Personalização por IA

### Páginas / Fluxos

- Boas-vindas
- Etapa 1
- Etapa 2
- Finalização

### Dependências

- auth_user_signup

### Normalmente acompanha

- account_settings

### Perguntas para o comercial

- Quais informações são obrigatórias?
- Pode pular?
- O onboarding muda conforme perfil?

### Observações comerciais

- Onboarding reduz fricção, mas adiciona fluxo, estado e regras.

---

## Configurações da conta

**ID:** `account_settings`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- configurações
- preferências
- dados da empresa
- minha conta

### Resumo

Área para editar dados e preferências gerais da conta ou empresa.

### Inclui

- Dados da empresa
- Preferências
- Notificações
- Segurança
- Integrações

### Não inclui

- Billing
- Multiempresa
- Permissões avançadas

### Páginas / Fluxos

- Configurações gerais
- Segurança
- Preferências

### Dependências

- auth_basic_login

### Normalmente acompanha

- user_profile
- multi_organization

### Perguntas para o comercial

- Quais configurações existem?
- São por usuário ou por empresa?
- Quem pode alterar?

### Observações comerciais

- Configurações costumam surgir no fim, mas impactam arquitetura e permissões.

---

## Billing / Assinatura

**ID:** `billing_subscription`  
**Complexidade inicial:** alta  
**Disciplinas:** UX, UI, Frontend, Backend, QA, DevOps

### Cliente costuma chamar de

- assinatura
- planos
- pagamento recorrente
- cobrança

### Resumo

Gestão de plano, pagamento, faturas e cancelamento em produto SaaS.

### Inclui

- Plano atual
- Trocar plano
- Pagamento
- Faturas
- Cancelamento
- Integração com gateway

### Não inclui

- Split de pagamento
- Nota fiscal automática
- Cobrança enterprise customizada

### Páginas / Fluxos

- Planos
- Checkout
- Faturas
- Gerenciar assinatura

### Dependências

- auth_basic_login
- payment_gateway

### Normalmente acompanha

- multi_organization

### Perguntas para o comercial

- Qual gateway?
- Planos são simples ou customizados?
- Precisa trial?
- Precisa nota fiscal?

### Observações comerciais

- Billing é crítico e deve considerar regras de cobrança, gateway, faturas e suporte.

---

## Logs administrativos

**ID:** `admin_logs`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- logs
- registro de ações
- admin logs
- auditoria admin

### Resumo

Área administrativa para visualizar eventos e ações relevantes do sistema.

### Inclui

- Lista de eventos
- Usuário
- Ação
- Data/hora
- Filtros
- Exportação opcional

### Não inclui

- Observabilidade técnica
- Logs de servidor
- Compliance avançado

### Páginas / Fluxos

- Lista de logs
- Detalhe do evento

### Dependências

- audit_log

### Normalmente acompanha

- roles_permissions

### Perguntas para o comercial

- Quais ações precisam aparecer?
- Quem pode ver logs?
- Precisa exportar?
- Por quanto tempo reter?

### Observações comerciais

- Logs administrativos são diferentes de logs técnicos de infraestrutura.
