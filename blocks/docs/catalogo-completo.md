# Matilha Building Blocks v0.1 — Catálogo Completo


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

---


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

---


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

---


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

---


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

---


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

---


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

---


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

---


# Integrações

Blocos de APIs externas, webhooks, sincronização e troca de dados.

## Integração com API externa simples

**ID:** `api_integration_simple`  
**Complexidade inicial:** média  
**Disciplinas:** Backend, QA, DevOps

### Cliente costuma chamar de

- integrar API
- conectar com sistema
- buscar dados externos
- enviar dados

### Resumo

Integração pontual com API externa para enviar ou receber dados em fluxo simples.

### Inclui

- Configurar credenciais
- Enviar dados
- Receber resposta
- Tratar erro
- Log básico

### Não inclui

- Webhooks
- Sincronização recorrente
- Retentativas avançadas
- Mapeamento complexo

### Páginas / Fluxos

- Configuração opcional
- Resultado da integração

### Dependências

- Nenhum

### Normalmente acompanha

- api_webhook

### Perguntas para o comercial

- Existe documentação da API?
- A API já está disponível?
- É envio, consulta ou ambos?
- Quem fornece credenciais?

### Observações comerciais

- Integração simples depende muito da qualidade da API externa.

---

## Integração com API externa complexa

**ID:** `api_integration_complex`  
**Complexidade inicial:** alta  
**Disciplinas:** Backend, QA, DevOps, PM

### Cliente costuma chamar de

- sincronizar sistemas
- integrar ERP
- integração complexa
- conectar legado

### Resumo

Integração robusta com autenticação, webhooks, sincronização, mapeamento e tratamento de inconsistências.

### Inclui

- Autenticação
- Webhooks
- Sincronização
- Retentativas
- Logs
- Mapeamento de dados
- Tratamento de inconsistência

### Não inclui

- Construção da API do terceiro
- Correção de sistema legado
- ETL corporativo completo

### Páginas / Fluxos

- Configuração
- Logs de integração
- Status de sincronização

### Dependências

- Nenhum

### Normalmente acompanha

- api_webhook
- audit_log

### Perguntas para o comercial

- Qual sistema será integrado?
- Existe ambiente sandbox?
- Existe documentação?
- A integração é em tempo real ou lote?

### Observações comerciais

- Integração complexa é uma das maiores fontes de risco e deve ter margem/contingência.

---

## Webhook

**ID:** `api_webhook`  
**Complexidade inicial:** média  
**Disciplinas:** Backend, QA, DevOps

### Cliente costuma chamar de

- webhook
- receber evento
- notificação de API
- callback

### Resumo

Endpoint para receber eventos externos de outro sistema.

### Inclui

- Criar endpoint
- Validar origem
- Receber evento
- Processar evento
- Registrar log
- Retornar status

### Não inclui

- Fila avançada
- Retentativas externas
- Painel completo de integração

### Páginas / Fluxos

- Logs de webhook opcional

### Dependências

- Nenhum

### Normalmente acompanha

- api_integration_complex

### Perguntas para o comercial

- Quais eventos serão recebidos?
- A origem assina os eventos?
- Precisa retry?
- Precisa log visível?

### Observações comerciais

- Webhook exige cuidado com segurança, idempotência e falhas.

---


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

---


# Landing Pages e Sites Institucionais

Blocos de páginas públicas, conteúdo, SEO, formulários e CMS.

## Hero / Chamada principal

**ID:** `lp_hero`  
**Complexidade inicial:** baixa  
**Disciplinas:** Estratégia, UX, UI, Frontend, Conteúdo, QA

### Cliente costuma chamar de

- hero
- primeira dobra
- chamada principal
- banner principal

### Resumo

Primeira seção da página com promessa, apoio visual e CTA.

### Inclui

- Título principal
- Subtítulo
- Imagem ou vídeo
- CTA
- Responsividade

### Não inclui

- Animação complexa
- Vídeo produzido
- Teste A/B

### Páginas / Fluxos

- Landing Page ou Home

### Dependências

- Nenhum

### Normalmente acompanha

- lp_benefits
- lp_lead_form

### Perguntas para o comercial

- Existe copy pronta?
- Existe imagem/vídeo?
- Qual CTA principal?

### Observações comerciais

- Hero parece simples, mas define narrativa, direção visual e conversão.

---

## Seção de benefícios

**ID:** `lp_benefits`  
**Complexidade inicial:** baixa  
**Disciplinas:** Estratégia, UX, UI, Frontend, Conteúdo

### Cliente costuma chamar de

- benefícios
- diferenciais
- vantagens
- por que escolher

### Resumo

Seção com cards explicando benefícios ou diferenciais da oferta.

### Inclui

- Cards
- Ícones
- Títulos
- Textos curtos

### Não inclui

- Ilustrações customizadas
- Animação avançada
- Pesquisa de posicionamento

### Páginas / Fluxos

- Landing Page ou Home

### Dependências

- Nenhum

### Normalmente acompanha

- lp_hero
- lp_faq

### Perguntas para o comercial

- Os benefícios já estão definidos?
- Precisa de ícones ou ilustrações?
- Quantos cards?

### Observações comerciais

- Depende mais de conteúdo/estratégia do que de desenvolvimento.

---

## Formulário de lead

**ID:** `lp_lead_form`  
**Complexidade inicial:** baixa  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- formulário
- capturar lead
- contato
- conversão

### Resumo

Formulário público para captar interessados e enviar dados ao cliente ou CRM.

### Inclui

- Nome
- E-mail
- Telefone
- Empresa
- Mensagem
- Validação
- Envio
- Mensagem de sucesso

### Não inclui

- CRM avançado
- Automação de marketing
- Qualificação complexa

### Páginas / Fluxos

- Seção de formulário
- Sucesso opcional

### Dependências

- Nenhum

### Normalmente acompanha

- crm_integration_simple
- recaptcha_lgpd

### Perguntas para o comercial

- Para onde o lead vai?
- Precisa integrar RD/HubSpot/Pipedrive?
- Precisa reCAPTCHA?
- Precisa consentimento LGPD?

### Observações comerciais

- Formulário sem integração é simples; formulário com CRM, LGPD e regras já vira outro escopo.

---

## Página Home institucional

**ID:** `site_home`  
**Complexidade inicial:** média  
**Disciplinas:** Estratégia, UX, UI, Frontend, Conteúdo, QA

### Cliente costuma chamar de

- home
- página inicial
- site institucional
- site da empresa

### Resumo

Página inicial de site institucional com principais seções de apresentação.

### Inclui

- Hero
- Serviços
- Diferenciais
- Cases
- Clientes
- CTA
- Rodapé

### Não inclui

- CMS
- Blog
- Área logada
- Multiidioma

### Páginas / Fluxos

- Home

### Dependências

- Nenhum

### Normalmente acompanha

- site_about
- site_services
- lp_lead_form

### Perguntas para o comercial

- Quantas seções?
- Conteúdo está pronto?
- Precisa CMS?
- Precisa SEO avançado?

### Observações comerciais

- Home institucional é composição de blocos de conteúdo, não apenas uma página visual.

---

## CMS simples

**ID:** `cms_simple`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- editar conteúdo
- painel admin do site
- CMS
- gerenciar páginas

### Resumo

Área administrativa básica para criar e editar conteúdos do site.

### Inclui

- Login admin
- Criar conteúdo
- Editar conteúdo
- Publicar/despublicar
- Upload de imagem
- Preview básico

### Não inclui

- Workflow editorial
- Versionamento avançado
- Permissões granulares
- Page builder

### Páginas / Fluxos

- Login admin
- Lista de conteúdos
- Novo conteúdo
- Editar conteúdo

### Dependências

- auth_basic_login

### Normalmente acompanha

- blog_news

### Perguntas para o comercial

- Quais conteúdos serão editáveis?
- Precisa preview?
- Precisa agendamento?
- Haverá perfis editoriais?

### Observações comerciais

- CMS pode ir de edição simples a produto completo. Definir claramente o que será editável.

---

## Blog / Notícias

**ID:** `blog_news`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, Conteúdo, QA

### Cliente costuma chamar de

- blog
- notícias
- artigos
- conteúdo

### Resumo

Estrutura pública e administrativa para publicar artigos, notícias ou conteúdos.

### Inclui

- Lista de posts
- Página de post
- Categorias
- Tags
- Busca
- SEO
- CMS

### Não inclui

- Newsletter
- Comentários públicos
- Workflow editorial avançado

### Páginas / Fluxos

- Lista de posts
- Post individual
- Categoria
- Admin de posts

### Dependências

- cms_simple

### Normalmente acompanha

- seo_basic

### Perguntas para o comercial

- Quem publica?
- Precisa categorias e tags?
- Precisa busca?
- Vai ter migração de posts antigos?

### Observações comerciais

- Blog com CMS é maior que páginas estáticas. Considerar SEO, URLs, categorias e edição.

---


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

---


# Financeiro e Pagamentos

Blocos de gateway, PIX, cartão, faturas, cupons e checkout.

## Gateway de pagamento

**ID:** `payment_gateway`  
**Complexidade inicial:** alta  
**Disciplinas:** UX, UI, Frontend, Backend, QA, DevOps

### Cliente costuma chamar de

- pagamento
- cartão
- PIX
- checkout
- cobrar cliente

### Resumo

Integração com gateway para processar pagamentos.

### Inclui

- Configuração de gateway
- Checkout
- Pagamento cartão/PIX conforme provedor
- Retorno de status
- Tratamento de falha
- Logs básicos

### Não inclui

- Split
- Marketplace financeiro
- Antifraude avançado
- Nota fiscal

### Páginas / Fluxos

- Checkout
- Pagamento aprovado
- Pagamento recusado

### Dependências

- Nenhum

### Normalmente acompanha

- transactional_email
- api_webhook

### Perguntas para o comercial

- Qual gateway será usado?
- Precisa PIX, cartão ou boleto?
- Pagamento único ou recorrente?
- Precisa emitir nota?

### Observações comerciais

- Pagamento envolve regra de negócio, webhook, status, conciliação e erro.

---

## Faturas / Cobranças

**ID:** `invoice_billing`  
**Complexidade inicial:** média  
**Disciplinas:** UX, UI, Frontend, Backend, QA

### Cliente costuma chamar de

- fatura
- cobrança
- segunda via
- recibo

### Resumo

Área para listar cobranças, emitir segunda via e visualizar status financeiro.

### Inclui

- Lista de faturas
- Status
- Download/segunda via
- Detalhe da cobrança
- E-mail de cobrança opcional

### Não inclui

- Nota fiscal
- Contabilidade
- Split
- ERP financeiro

### Páginas / Fluxos

- Lista de faturas
- Detalhe da fatura

### Dependências

- payment_gateway

### Normalmente acompanha

- transactional_email

### Perguntas para o comercial

- Fatura vem do gateway ou do sistema?
- Precisa segunda via?
- Precisa enviar por e-mail?

### Observações comerciais

- Fatura pode ser apenas visualização ou módulo financeiro com regras próprias.

---

