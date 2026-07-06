# Autenticação

Blocos relacionados a acesso, identidade, recuperação de senha e segurança inicial.

## Login / Autenticação básica

**ID:** `auth_basic_login`  
**Complexidade inicial:** baixa  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- login
- entrar
- área restrita
- área do cliente
- acesso com senha

### Resumo

Fluxo responsável por permitir que um usuário acesse uma área privada usando e-mail e senha.

### Inclui

- Tela de login
- Campo de e-mail
- Campo de senha
- Validação de campos
- Mensagens de erro
- Sessão do usuário
- Logout
- Proteção de rotas privadas
- Redirecionamento pós-login

### Não inclui

- Cadastro público
- Recuperação de senha
- Confirmação de e-mail
- Login social
- MFA / 2FA
- Permissões avançadas

### Páginas / Fluxos

- Login

### Dependências

- Nenhum

### Normalmente acompanha

- auth_forgot_password
- user_profile
- roles_permissions

### Perguntas para o comercial

- O usuário se cadastra sozinho ou é criado por um administrador?
- Existem diferentes perfis de acesso?
- O login será por e-mail e senha ou também Google/Microsoft?
- Existe necessidade de MFA / 2FA?

### Observações comerciais

- Cliente normalmente fala apenas 'login', mas pode estar imaginando cadastro, recuperação de senha e área do usuário.
- Login não deve incluir automaticamente multiempresa, permissões avançadas ou login social.

---

## Esqueci minha senha / Recuperação de senha

**ID:** `auth_forgot_password`  
**Complexidade inicial:** baixa  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- esqueci minha senha
- recuperar senha
- resetar senha
- nova senha

### Resumo

Fluxo para permitir que um usuário redefina sua senha por e-mail.

### Inclui

- Link 'esqueci minha senha' na tela de login
- Tela para solicitar recuperação
- Campo de e-mail
- E-mail transacional de recuperação
- Token/link seguro
- Tela para criar nova senha
- Validação de senha
- Mensagem de sucesso
- Retorno para login

### Não inclui

- Recuperação por SMS
- Recuperação por WhatsApp
- MFA
- Atendimento manual de suporte

### Páginas / Fluxos

- Login
- Solicitar nova senha
- E-mail de recuperação
- Redefinir senha
- Senha alterada
- Retorno ao login

### Dependências

- auth_basic_login
- transactional_email

### Normalmente acompanha

- transactional_email

### Perguntas para o comercial

- A recuperação será por e-mail?
- Existe regra de expiração do link?
- O cliente já possui provedor de e-mail transacional?

### Observações comerciais

- Recuperação de senha quase sempre acompanha login, mas deve estar explícita no escopo.
- Depende de envio de e-mail transacional.

---

## Cadastro público de usuário

**ID:** `auth_user_signup`  
**Complexidade inicial:** baixa  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- cadastro
- criar conta
- registro
- sign up
- abrir conta

### Resumo

Fluxo para um novo usuário criar sua própria conta no sistema.

### Inclui

- Tela de cadastro
- Campos principais
- Validação dos dados
- Criação de usuário
- Aceite de termos
- Mensagem de sucesso
- Redirecionamento pós-cadastro

### Não inclui

- Confirmação de e-mail
- Aprovação manual
- Cadastro por convite
- Cadastro com CNPJ complexo
- Onboarding completo

### Páginas / Fluxos

- Cadastro
- Sucesso do cadastro
- Login ou Dashboard

### Dependências

- Nenhum

### Normalmente acompanha

- auth_basic_login
- auth_email_confirmation
- onboarding_first_access

### Perguntas para o comercial

- O usuário se cadastra sozinho?
- Precisa confirmar e-mail?
- O cadastro precisa de CPF, CNPJ ou validações externas?
- Existe aprovação manual antes do acesso?

### Observações comerciais

- Cliente costuma chamar qualquer formulário de 'cadastro'. É preciso diferenciar cadastro de conta, cadastro de entidade e CRUD administrativo.

---

## Confirmação de e-mail

**ID:** `auth_email_confirmation`  
**Complexidade inicial:** baixa  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- confirmar e-mail
- validar e-mail
- ativar conta
- e-mail de confirmação

### Resumo

Fluxo para validar que o usuário possui acesso ao e-mail informado.

### Inclui

- Envio de e-mail de confirmação
- Template de e-mail
- Link/token de confirmação
- Tela de confirmação bem-sucedida
- Tela de link inválido ou expirado
- Reenvio de confirmação

### Não inclui

- MFA
- Verificação por SMS
- Aprovação manual

### Páginas / Fluxos

- E-mail de confirmação
- Conta confirmada
- Link inválido/expirado

### Dependências

- transactional_email

### Normalmente acompanha

- auth_user_signup

### Perguntas para o comercial

- O usuário poderá acessar antes de confirmar o e-mail?
- O link expira em quanto tempo?
- Precisa reenviar confirmação?

### Observações comerciais

- Confirmação de e-mail parece detalhe, mas adiciona telas, e-mail, token e regras de acesso.

---

## Login social / OAuth

**ID:** `auth_social_login`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- login com Google
- login com Microsoft
- entrar com Google
- SSO simples

### Resumo

Permite autenticação usando provedores externos como Google ou Microsoft.

### Inclui

- Botão de login social
- Configuração OAuth
- Callback de autenticação
- Associação com usuário existente
- Criação automática de conta
- Tratamento de erros

### Não inclui

- SSO corporativo avançado
- SAML
- Provisionamento automático
- MFA corporativo

### Páginas / Fluxos

- Login
- Callback OAuth
- Tratamento de erro

### Dependências

- auth_basic_login

### Normalmente acompanha

- auth_user_signup

### Perguntas para o comercial

- Quais provedores serão usados?
- O domínio do e-mail precisa ser limitado?
- O login social cria conta automaticamente?

### Observações comerciais

- Login social envolve configuração externa, chaves, callback e regras para conta duplicada.
