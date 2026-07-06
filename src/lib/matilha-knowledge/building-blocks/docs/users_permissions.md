# Usuários e Permissões

Blocos de perfis, papéis, gestão de usuários, organizações e isolamento de dados.

## Perfil do usuário

**ID:** `user_profile`  
**Complexidade inicial:** baixa  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- meu perfil
- editar perfil
- dados do usuário
- minha conta

### Resumo

Área onde o usuário visualiza e edita informações básicas da própria conta.

### Inclui

- Página Meu Perfil
- Editar nome
- Editar telefone
- Editar avatar
- Alterar senha
- Mensagens de sucesso/erro

### Não inclui

- Gestão de usuários
- Permissões
- Preferências avançadas
- Billing

### Páginas / Fluxos

- Meu Perfil
- Alterar senha

### Dependências

- auth_basic_login

### Normalmente acompanha

- auth_basic_login

### Perguntas para o comercial

- Quais dados do usuário serão editáveis?
- Precisa de foto/avatar?
- O usuário pode alterar e-mail?

### Observações comerciais

- Perfil do usuário é comum em sistemas logados e costuma ser esquecido no briefing.

---

## Gestão de usuários

**ID:** `user_management`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- admin cadastra usuários
- gerenciar usuários
- lista de usuários
- usuários do sistema

### Resumo

Painel administrativo para criar, editar, ativar, desativar e pesquisar usuários.

### Inclui

- Listagem de usuários
- Criar usuário
- Editar usuário
- Ativar/desativar
- Excluir ou arquivar
- Busca
- Filtros
- Definir perfil

### Não inclui

- Permissões granulares
- Multiempresa
- Convite por e-mail
- SSO

### Páginas / Fluxos

- Lista de usuários
- Novo usuário
- Editar usuário
- Detalhe do usuário

### Dependências

- auth_basic_login

### Normalmente acompanha

- roles_permissions
- transactional_email

### Perguntas para o comercial

- Quem pode criar usuários?
- Usuário recebe e-mail de convite?
- Existem perfis diferentes?

### Observações comerciais

- Gestão de usuários pode parecer apenas uma tabela, mas afeta segurança, permissões e operações administrativas.

---

## Perfis e permissões

**ID:** `roles_permissions`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- admin e usuário comum
- níveis de acesso
- permissões
- perfil de acesso

### Resumo

Controle do que cada tipo de usuário pode ver e fazer dentro do sistema.

### Inclui

- Papéis de acesso
- Bloqueio de telas
- Bloqueio de ações
- Regras no backend
- Permissões por área

### Não inclui

- Permissões customizadas por usuário
- Multiempresa
- RBAC avançado
- ABAC

### Páginas / Fluxos

- Configuração de perfis
- Atribuição de perfil

### Dependências

- auth_basic_login

### Normalmente acompanha

- user_management

### Perguntas para o comercial

- Quais perfis existem?
- Cada perfil pode ver quais áreas?
- As permissões são fixas ou configuráveis?

### Observações comerciais

- Mesmo 'só dois perfis' já muda o desenho do sistema inteiro.

---

## Multiempresa / Organizações

**ID:** `multi_organization`  
**Complexidade inicial:** alta  
**Disciplinas:** UX, UI, Frontend, Backend, QA, DevOps

### Cliente costuma chamar de

- cada cliente vê seus dados
- multiempresa
- tenant
- organização
- empresa

### Resumo

Estrutura para separar dados e usuários por empresa/organização dentro do mesmo sistema.

### Inclui

- Cadastro de organização
- Usuários vinculados
- Isolamento de dados
- Admin por empresa
- Regras por organização
- Troca de organização

### Não inclui

- Cobrança por organização
- White label
- Infraestrutura dedicada por cliente

### Páginas / Fluxos

- Lista de organizações
- Detalhe da organização
- Usuários da organização
- Configurações da organização

### Dependências

- auth_basic_login
- roles_permissions

### Normalmente acompanha

- user_management
- member_invite

### Perguntas para o comercial

- Cada empresa tem seus próprios usuários?
- Um usuário pode pertencer a mais de uma empresa?
- Existe admin por empresa?

### Observações comerciais

- Multiempresa é um dos maiores multiplicadores de complexidade em SaaS.

---

## Convite de membros

**ID:** `member_invite`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- convidar usuário
- convite por e-mail
- adicionar membro
- enviar convite

### Resumo

Fluxo para convidar pessoas por e-mail para entrar em uma conta, time ou organização.

### Inclui

- Enviar convite
- E-mail de convite
- Aceitar convite
- Definir perfil
- Expiração de convite
- Reenviar convite

### Não inclui

- SSO
- Provisionamento automático
- Importação em massa

### Páginas / Fluxos

- Convidar membro
- E-mail de convite
- Aceitar convite
- Convite expirado

### Dependências

- auth_basic_login
- transactional_email

### Normalmente acompanha

- multi_organization
- roles_permissions

### Perguntas para o comercial

- Quem pode convidar?
- O convite define perfil?
- Convite expira?
- Pode reenviar convite?

### Observações comerciais

- Convite de membros combina autenticação, e-mail transacional e permissões.
