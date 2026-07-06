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
