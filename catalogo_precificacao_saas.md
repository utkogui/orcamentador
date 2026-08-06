# Catálogo de módulos, páginas e building blocks para orçamento de SaaS

## 1. Objetivo

Este documento define uma estrutura padronizada para cadastrar, estimar e precificar produtos SaaS.

O catálogo separa o projeto em cinco níveis:

1. **Produto:** o sistema completo a ser desenvolvido.
2. **Módulo:** uma área funcional do produto.
3. **Página:** uma tela ou rota utilizada pelo usuário.
4. **Building block:** uma unidade funcional presente em uma página.
5. **Complexidade:** multiplicador aplicado conforme o esforço necessário.

Essa estrutura evita que o orçamento seja calculado apenas pela quantidade de telas. Duas páginas visualmente parecidas podem exigir esforços muito diferentes por causa de regras de negócio, permissões, integrações, processamento ou volume de dados.

---

## 2. Estrutura recomendada dos dados

### 2.1 Produto

| Campo | Tipo sugerido | Descrição |
|---|---|---|
| `product_id` | string | Identificador único do produto |
| `name` | string | Nome do produto |
| `description` | text | Descrição geral |
| `product_type` | enum | SaaS, marketplace, e-commerce, portal, sistema interno ou outro |
| `platforms` | lista | Web, mobile, desktop ou API |
| `modules` | lista | Módulos selecionados |
| `global_requirements` | lista | Requisitos compartilhados pelo produto |
| `subtotal` | decimal | Soma dos itens estimados |
| `contingency_percentage` | decimal | Margem de risco |
| `total` | decimal | Valor final estimado |

### 2.2 Módulo

| Campo | Tipo sugerido | Descrição |
|---|---|---|
| `module_id` | string | Código único do módulo |
| `name` | string | Nome do módulo |
| `description` | text | Objetivo do módulo |
| `required` | boolean | Indica se é obrigatório |
| `pages` | lista | Páginas pertencentes ao módulo |
| `shared_features` | lista | Funcionalidades compartilhadas |
| `dependencies` | lista | Outros módulos necessários |

### 2.3 Página

| Campo | Tipo sugerido | Descrição |
|---|---|---|
| `page_id` | string | Código único da página |
| `module_id` | string | Módulo ao qual pertence |
| `name` | string | Nome da página |
| `description` | text | Objetivo e comportamento esperado |
| `page_type` | enum | Estática, formulário, listagem, detalhe, dashboard, wizard ou editor |
| `quantity` | integer | Quantidade de variações ou ocorrências |
| `complexity` | enum | 1x, 2x ou 3x |
| `building_blocks` | lista | Blocos usados na página |
| `business_rules` | lista | Regras de negócio |
| `states` | lista | Estados de interface necessários |
| `dependencies` | lista | Integrações ou páginas relacionadas |

### 2.4 Building block

| Campo | Tipo sugerido | Descrição |
|---|---|---|
| `block_id` | string | Código único do bloco |
| `name` | string | Nome do building block |
| `category` | enum | Interface, dados, fluxo, integração, comunicação ou infraestrutura |
| `base_points` | decimal | Pontuação ou valor-base |
| `quantity` | integer | Quantidade usada |
| `complexity` | enum | 1x, 2x ou 3x |
| `reusability` | enum | Novo, parcialmente reutilizado ou reutilizado |
| `notes` | text | Observações da estimativa |

### 2.5 Item de orçamento

| Campo | Tipo sugerido | Descrição |
|---|---|---|
| `estimate_item_id` | string | Identificador do item |
| `source_type` | enum | Módulo, página, bloco, requisito global ou serviço |
| `source_id` | string | ID do item catalogado |
| `quantity` | decimal | Quantidade |
| `base_value` | decimal | Valor-base ou pontos |
| `complexity_multiplier` | decimal | Multiplicador de dificuldade |
| `reuse_multiplier` | decimal | Multiplicador de reutilização |
| `risk_multiplier` | decimal | Multiplicador de risco |
| `calculated_value` | decimal | Total calculado |

---

## 3. Catálogo de módulos e páginas

## MOD-001 — Autenticação e acesso

Gerencia a identidade do usuário, a entrada no sistema e a recuperação de acesso.

| ID | Página | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `AUTH-001` | Login | Formulário | 1x |
| `AUTH-002` | Cadastro | Formulário | 1x |
| `AUTH-003` | Esqueci minha senha | Formulário | 1x |
| `AUTH-004` | Redefinir senha | Formulário | 1x |
| `AUTH-005` | Verificação de e-mail | Fluxo | 1x |
| `AUTH-006` | Autenticação em dois fatores | Fluxo | 2x |
| `AUTH-007` | Login social | Integração | 2x |
| `AUTH-008` | Aceite de convite | Fluxo | 2x |
| `AUTH-009` | Sessão expirada | Estado de sistema | 1x |
| `AUTH-010` | Conta bloqueada | Estado de sistema | 1x |
| `AUTH-011` | Seleção de organização ou workspace | Seleção | 2x |
| `AUTH-012` | Gestão de dispositivos e sessões | Listagem | 2x |

Requisitos possíveis:

- Login por e-mail e senha
- Login por telefone
- Login social
- Single Sign-On
- Autenticação em dois fatores
- Política de senha
- CAPTCHA
- Bloqueio por tentativas
- Expiração e renovação de sessão
- Registro de dispositivos

---

## MOD-002 — Onboarding

Conduz o usuário da criação da conta até a primeira utilização bem-sucedida.

| ID | Página | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `ONB-001` | Boas-vindas | Estática | 1x |
| `ONB-002` | Configuração inicial | Formulário | 2x |
| `ONB-003` | Wizard de configuração | Wizard | 2x |
| `ONB-004` | Escolha de plano | Seleção | 2x |
| `ONB-005` | Criação de empresa ou workspace | Formulário | 2x |
| `ONB-006` | Convite de equipe | Formulário | 2x |
| `ONB-007` | Importação inicial de dados | Importação | 3x |
| `ONB-008` | Tutorial do produto | Fluxo guiado | 2x |
| `ONB-009` | Checklist de primeiros passos | Checklist | 2x |
| `ONB-010` | Confirmação de configuração | Resumo | 1x |

---

## MOD-003 — Dashboard

Apresenta indicadores, informações recentes e atalhos para as ações principais.

| ID | Página | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `DSH-001` | Dashboard resumido | Dashboard | 1x |
| `DSH-002` | Dashboard com filtros | Dashboard | 2x |
| `DSH-003` | Dashboard analítico | Dashboard | 3x |
| `DSH-004` | Dashboard personalizável | Dashboard | 3x |
| `DSH-005` | Atividades recentes | Feed | 2x |
| `DSH-006` | Central de pendências | Listagem | 2x |

Building blocks comuns:

- Cards de indicadores
- Comparação com período anterior
- Gráficos
- Filtro por período
- Filtros por entidade
- Atividades recentes
- Alertas
- Metas
- Atalhos de ação
- Atualização automática
- Exportação

---

## MOD-004 — Funcionalidade principal e entidades

Representa o núcleo do produto. Deve ser instanciado para cada entidade relevante, como clientes, projetos, pedidos, imóveis, pacientes ou contratos.

| ID | Página ou ação | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `CORE-001` | Listagem da entidade | Listagem | 1x |
| `CORE-002` | Detalhes da entidade | Detalhe | 1x |
| `CORE-003` | Cadastro da entidade | Formulário | 1x |
| `CORE-004` | Edição da entidade | Formulário | 1x |
| `CORE-005` | Exclusão da entidade | Ação | 1x |
| `CORE-006` | Arquivamento da entidade | Ação | 1x |
| `CORE-007` | Duplicação da entidade | Ação | 2x |
| `CORE-008` | Histórico da entidade | Timeline | 2x |
| `CORE-009` | Importação de entidades | Importação | 3x |
| `CORE-010` | Exportação de entidades | Exportação | 2x |
| `CORE-011` | Ações em lote | Fluxo | 2x |
| `CORE-012` | Relacionamento entre entidades | Fluxo | 2x |
| `CORE-013` | Mudança de status | Workflow | 2x |
| `CORE-014` | Visualização em calendário | Calendário | 2x |
| `CORE-015` | Visualização em Kanban | Quadro | 2x |
| `CORE-016` | Visualização em mapa | Mapa | 3x |
| `CORE-017` | Comparação de entidades | Comparador | 3x |

Para cada entidade, registrar:

- Nome singular e plural
- Campos
- Tipos dos campos
- Relacionamentos
- Status possíveis
- Regras de transição
- Permissões
- Volume estimado
- Operações permitidas
- Necessidade de histórico
- Necessidade de importação ou exportação

---

## MOD-005 — Busca, filtros e navegação

| ID | Página ou recurso | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `NAV-001` | Busca simples | Componente | 1x |
| `NAV-002` | Busca global | Página | 2x |
| `NAV-003` | Filtros básicos | Componente | 1x |
| `NAV-004` | Filtros avançados | Componente | 2x |
| `NAV-005` | Ordenação | Componente | 1x |
| `NAV-006` | Paginação | Componente | 1x |
| `NAV-007` | Visualizações salvas | Fluxo | 2x |
| `NAV-008` | Favoritos | Fluxo | 1x |
| `NAV-009` | Itens recentes | Listagem | 1x |
| `NAV-010` | Pesquisa com sugestões | Componente | 2x |
| `NAV-011` | Pesquisa semântica | Recurso inteligente | 3x |

---

## MOD-006 — Perfil e preferências

| ID | Página | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `PRF-001` | Meu perfil | Formulário | 1x |
| `PRF-002` | Alterar senha | Formulário | 1x |
| `PRF-003` | Foto ou avatar | Upload | 1x |
| `PRF-004` | Preferências pessoais | Formulário | 1x |
| `PRF-005` | Preferências de notificação | Formulário | 2x |
| `PRF-006` | Tema e aparência | Configuração | 1x |
| `PRF-007` | Idioma e região | Configuração | 1x |
| `PRF-008` | Segurança e sessões | Listagem | 2x |
| `PRF-009` | Exportar meus dados | Fluxo | 2x |
| `PRF-010` | Excluir minha conta | Fluxo | 2x |

---

## MOD-007 — Empresas, workspaces e equipes

| ID | Página | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `ORG-001` | Dados da organização | Formulário | 1x |
| `ORG-002` | Lista de membros | Listagem | 1x |
| `ORG-003` | Convite de membros | Fluxo | 2x |
| `ORG-004` | Detalhes do membro | Detalhe | 1x |
| `ORG-005` | Times ou departamentos | CRUD | 2x |
| `ORG-006` | Cargos | CRUD | 2x |
| `ORG-007` | Papéis e permissões | Matriz | 3x |
| `ORG-008` | Transferência de propriedade | Fluxo | 2x |
| `ORG-009` | Gestão de workspaces | CRUD | 2x |
| `ORG-010` | Alternar workspace | Seleção | 2x |
| `ORG-011` | Domínios permitidos | Configuração | 2x |
| `ORG-012` | Unidades ou filiais | CRUD | 2x |

---

## MOD-008 — Planos, assinaturas e cobrança

| ID | Página | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `BIL-001` | Comparação de planos | Página | 1x |
| `BIL-002` | Escolha de plano | Seleção | 1x |
| `BIL-003` | Checkout | Fluxo | 2x |
| `BIL-004` | Assinatura atual | Detalhe | 1x |
| `BIL-005` | Alteração de plano | Fluxo | 2x |
| `BIL-006` | Método de pagamento | Formulário | 2x |
| `BIL-007` | Histórico de cobranças | Listagem | 2x |
| `BIL-008` | Fatura ou recibo | Documento | 2x |
| `BIL-009` | Uso e limites | Dashboard | 2x |
| `BIL-010` | Cancelamento | Fluxo | 2x |
| `BIL-011` | Reativação | Fluxo | 2x |
| `BIL-012` | Cupons e créditos | Fluxo | 2x |
| `BIL-013` | Cobrança por consumo | Medição | 3x |
| `BIL-014` | Falha de pagamento | Recuperação | 2x |

Requisitos possíveis:

- Período de teste
- Planos mensais e anuais
- Upgrade e downgrade
- Cobrança proporcional
- Cupons
- Impostos
- Múltiplas moedas
- Cobrança por usuário
- Cobrança por uso
- Limites por plano
- Webhooks do provedor de pagamento
- Recuperação de pagamentos recusados

---

## MOD-009 — Notificações e comunicação

| ID | Página ou recurso | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `COM-001` | Central de notificações | Listagem | 2x |
| `COM-002` | Preferências de notificações | Configuração | 2x |
| `COM-003` | Caixa de entrada | Listagem | 2x |
| `COM-004` | Conversa ou chat | Tempo real | 3x |
| `COM-005` | Comentários | Componente | 2x |
| `COM-006` | Respostas encadeadas | Componente | 2x |
| `COM-007` | Menções | Componente | 2x |
| `COM-008` | Templates de e-mail | Editor | 3x |
| `COM-009` | Histórico de comunicações | Timeline | 2x |
| `COM-010` | Anúncios do sistema | Gestão | 2x |

Canais possíveis:

- Notificação dentro do sistema
- E-mail
- SMS
- WhatsApp
- Push mobile
- Webhook

---

## MOD-010 — Relatórios e análises

| ID | Página ou recurso | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `RPT-001` | Lista de relatórios | Listagem | 1x |
| `RPT-002` | Relatório detalhado | Relatório | 2x |
| `RPT-003` | Relatório com filtros | Relatório | 2x |
| `RPT-004` | Construtor de relatório | Editor | 3x |
| `RPT-005` | Gráficos analíticos | Dashboard | 2x |
| `RPT-006` | Exportação em CSV | Exportação | 1x |
| `RPT-007` | Exportação em Excel | Exportação | 2x |
| `RPT-008` | Exportação em PDF | Exportação | 2x |
| `RPT-009` | Agendamento de relatório | Automação | 3x |
| `RPT-010` | Compartilhamento de relatório | Fluxo | 2x |
| `RPT-011` | Indicadores e metas | Dashboard | 2x |

---

## MOD-011 — Arquivos e documentos

| ID | Página ou recurso | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `FIL-001` | Upload simples | Upload | 1x |
| `FIL-002` | Upload múltiplo | Upload | 2x |
| `FIL-003` | Biblioteca de arquivos | Listagem | 2x |
| `FIL-004` | Visualização do arquivo | Preview | 2x |
| `FIL-005` | Download | Ação | 1x |
| `FIL-006` | Organização por pastas | Navegação | 2x |
| `FIL-007` | Compartilhamento | Fluxo | 2x |
| `FIL-008` | Controle de versões | Histórico | 3x |
| `FIL-009` | Assinatura eletrônica | Integração | 3x |
| `FIL-010` | Geração de documento | Automação | 3x |
| `FIL-011` | OCR ou extração de conteúdo | Processamento | 3x |

---

## MOD-012 — Integrações e API

| ID | Página ou recurso | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `INT-001` | Catálogo de integrações | Listagem | 1x |
| `INT-002` | Detalhes da integração | Detalhe | 1x |
| `INT-003` | Conectar conta externa | Autorização | 2x |
| `INT-004` | Configurar integração | Formulário | 2x |
| `INT-005` | Mapeamento de campos | Editor | 3x |
| `INT-006` | Histórico de sincronização | Listagem | 2x |
| `INT-007` | Gestão de webhooks | CRUD | 3x |
| `INT-008` | Chaves de API | Gestão | 2x |
| `INT-009` | Logs de integração | Listagem | 2x |
| `INT-010` | Documentação da API | Documentação | 2x |
| `INT-011` | Tentativas e reprocessamento | Processamento | 3x |

Ao estimar uma integração, avaliar separadamente:

- Autenticação
- Leitura de dados
- Escrita de dados
- Sincronização bidirecional
- Frequência de sincronização
- Mapeamento de campos
- Tratamento de erros
- Reprocessamento
- Webhooks
- Limites da API externa
- Ambiente de testes

---

## MOD-013 — Automações e workflows

| ID | Página ou recurso | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `AUT-001` | Lista de automações | Listagem | 2x |
| `AUT-002` | Criar automação simples | Formulário | 2x |
| `AUT-003` | Editor visual de automação | Editor | 3x |
| `AUT-004` | Gatilhos | Configuração | 2x |
| `AUT-005` | Condições | Configuração | 3x |
| `AUT-006` | Ações | Configuração | 2x |
| `AUT-007` | Agendamentos | Configuração | 2x |
| `AUT-008` | Histórico de execuções | Listagem | 2x |
| `AUT-009` | Detalhes da execução | Detalhe | 2x |
| `AUT-010` | Teste da automação | Simulação | 3x |

---

## MOD-014 — Agenda e calendário

| ID | Página ou recurso | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `CAL-001` | Calendário mensal | Calendário | 2x |
| `CAL-002` | Calendário semanal ou diário | Calendário | 2x |
| `CAL-003` | Cadastro de evento | Formulário | 2x |
| `CAL-004` | Detalhes do evento | Detalhe | 1x |
| `CAL-005` | Recorrência | Regra | 3x |
| `CAL-006` | Disponibilidade | Configuração | 3x |
| `CAL-007` | Agendamento público | Fluxo | 3x |
| `CAL-008` | Lembretes | Automação | 2x |
| `CAL-009` | Sincronização com calendário externo | Integração | 3x |

---

## MOD-015 — Suporte e ajuda

| ID | Página ou recurso | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `SUP-001` | Central de ajuda | Página | 1x |
| `SUP-002` | FAQ | Listagem | 1x |
| `SUP-003` | Busca de artigos | Busca | 2x |
| `SUP-004` | Abertura de chamado | Formulário | 1x |
| `SUP-005` | Lista de chamados | Listagem | 2x |
| `SUP-006` | Detalhes do chamado | Detalhe | 2x |
| `SUP-007` | Chat de suporte | Tempo real | 3x |
| `SUP-008` | Feedback | Formulário | 1x |
| `SUP-009` | Avaliação de atendimento | Formulário | 1x |
| `SUP-010` | Sugestões de funcionalidades | Portal | 2x |

---

## MOD-016 — Administração interna

Área utilizada pela equipe responsável por operar o SaaS.

| ID | Página ou recurso | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `ADM-001` | Dashboard administrativo | Dashboard | 2x |
| `ADM-002` | Gestão de usuários | CRUD | 2x |
| `ADM-003` | Gestão de organizações | CRUD | 2x |
| `ADM-004` | Gestão de planos | CRUD | 2x |
| `ADM-005` | Gestão de assinaturas | CRUD | 3x |
| `ADM-006` | Gestão de pagamentos | Listagem | 3x |
| `ADM-007` | Impersonação de usuário | Recurso administrativo | 3x |
| `ADM-008` | Auditoria | Listagem | 2x |
| `ADM-009` | Logs técnicos | Listagem | 2x |
| `ADM-010` | Configurações globais | Configuração | 2x |
| `ADM-011` | Feature flags | Gestão | 3x |
| `ADM-012` | Moderação | Workflow | 3x |
| `ADM-013` | Gestão de conteúdo | CRUD | 2x |
| `ADM-014` | Filas e tarefas | Monitoramento | 3x |
| `ADM-015` | Comunicados da plataforma | Gestão | 2x |

---

## MOD-017 — Auditoria, privacidade e conformidade

| ID | Página ou recurso | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `CMP-001` | Log de auditoria | Listagem | 2x |
| `CMP-002` | Histórico de alterações | Timeline | 2x |
| `CMP-003` | Gestão de consentimentos | Configuração | 2x |
| `CMP-004` | Solicitação de dados pessoais | Fluxo | 3x |
| `CMP-005` | Exclusão ou anonimização de dados | Fluxo | 3x |
| `CMP-006` | Política de retenção | Configuração | 3x |
| `CMP-007` | Controle de acesso a dados | Matriz | 3x |
| `CMP-008` | Relatório de acessos | Relatório | 2x |

---

## MOD-018 — Páginas institucionais e comerciais

| ID | Página | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `PUB-001` | Landing page | Institucional | 2x |
| `PUB-002` | Funcionalidades | Institucional | 1x |
| `PUB-003` | Preços | Institucional | 1x |
| `PUB-004` | Sobre | Institucional | 1x |
| `PUB-005` | Contato | Formulário | 1x |
| `PUB-006` | Blog | Listagem | 2x |
| `PUB-007` | Artigo | Conteúdo | 1x |
| `PUB-008` | Casos de sucesso | Conteúdo | 1x |
| `PUB-009` | Termos de uso | Legal | 1x |
| `PUB-010` | Política de privacidade | Legal | 1x |
| `PUB-011` | Política de cookies | Legal | 1x |
| `PUB-012` | Status do serviço | Monitoramento | 2x |

---

## MOD-019 — Estados e páginas de sistema

| ID | Página ou estado | Tipo | Complexidade inicial sugerida |
|---|---|---|---:|
| `SYS-001` | Página não encontrada | Estado | 1x |
| `SYS-002` | Erro interno | Estado | 1x |
| `SYS-003` | Manutenção | Estado | 1x |
| `SYS-004` | Sem permissão | Estado | 1x |
| `SYS-005` | Sem resultados | Estado | 1x |
| `SYS-006` | Estado vazio | Estado | 1x |
| `SYS-007` | Carregamento | Estado | 1x |
| `SYS-008` | Erro de conexão | Estado | 1x |
| `SYS-009` | Limite do plano atingido | Estado | 2x |
| `SYS-010` | Recurso indisponível | Estado | 1x |

---

## 4. Catálogo de building blocks

## 4.1 Interface e conteúdo

| ID | Building block | Unidade recomendada | Complexidade-base |
|---|---|---|---:|
| `UI-001` | Conteúdo estático | seção | 1x |
| `UI-002` | Cabeçalho de página | página | 1x |
| `UI-003` | Card informativo | unidade | 1x |
| `UI-004` | Card de indicador | unidade | 1x |
| `UI-005` | Abas | conjunto | 1x |
| `UI-006` | Accordion | conjunto | 1x |
| `UI-007` | Modal de confirmação | unidade | 1x |
| `UI-008` | Modal com formulário | unidade | 2x |
| `UI-009` | Tooltip ou popover | conjunto | 1x |
| `UI-010` | Stepper | fluxo | 2x |
| `UI-011` | Breadcrumb | página | 1x |
| `UI-012` | Menu lateral | produto | 2x |
| `UI-013` | Tema escuro | produto | 2x |
| `UI-014` | Interface responsiva | página ou produto | 2x |
| `UI-015` | Acessibilidade avançada | página ou produto | 2x |
| `UI-016` | Internacionalização | produto | 2x |

## 4.2 Formulários

| ID | Building block | Unidade recomendada | Complexidade-base |
|---|---|---|---:|
| `FRM-001` | Formulário simples, até 5 campos | formulário | 1x |
| `FRM-002` | Formulário médio, de 6 a 15 campos | formulário | 2x |
| `FRM-003` | Formulário extenso, acima de 15 campos | formulário | 3x |
| `FRM-004` | Campo com máscara | campo | 1x |
| `FRM-005` | Campo condicional | regra | 2x |
| `FRM-006` | Validação cruzada | regra | 2x |
| `FRM-007` | Autocomplete | campo | 2x |
| `FRM-008` | Seleção múltipla | campo | 1x |
| `FRM-009` | Formulário dinâmico | formulário | 3x |
| `FRM-010` | Salvamento automático | formulário | 3x |
| `FRM-011` | Rascunho | formulário | 2x |
| `FRM-012` | Wizard de múltiplas etapas | fluxo | 2x |

## 4.3 Listagens e dados

| ID | Building block | Unidade recomendada | Complexidade-base |
|---|---|---|---:|
| `DAT-001` | Lista simples | lista | 1x |
| `DAT-002` | Tabela simples | tabela | 1x |
| `DAT-003` | Data grid | tabela | 2x |
| `DAT-004` | Paginação | listagem | 1x |
| `DAT-005` | Ordenação | listagem | 1x |
| `DAT-006` | Filtro simples | conjunto | 1x |
| `DAT-007` | Filtro avançado | conjunto | 2x |
| `DAT-008` | Busca simples | página | 1x |
| `DAT-009` | Busca global | produto | 3x |
| `DAT-010` | Seleção em lote | listagem | 2x |
| `DAT-011` | Ação em lote | ação | 2x |
| `DAT-012` | Colunas configuráveis | tabela | 2x |
| `DAT-013` | Visualização salva | visualização | 2x |
| `DAT-014` | Agrupamento | tabela | 2x |
| `DAT-015` | Dados em tempo real | página | 3x |

## 4.4 Visualização e análise

| ID | Building block | Unidade recomendada | Complexidade-base |
|---|---|---|---:|
| `VIS-001` | Gráfico simples | gráfico | 1x |
| `VIS-002` | Gráfico interativo | gráfico | 2x |
| `VIS-003` | Gráfico combinado | gráfico | 2x |
| `VIS-004` | Mapa | mapa | 3x |
| `VIS-005` | Calendário | calendário | 2x |
| `VIS-006` | Kanban | quadro | 2x |
| `VIS-007` | Timeline | componente | 2x |
| `VIS-008` | Comparador | página | 3x |
| `VIS-009` | Funil | gráfico | 2x |
| `VIS-010` | Heatmap | gráfico | 3x |

## 4.5 Arquivos, importação e exportação

| ID | Building block | Unidade recomendada | Complexidade-base |
|---|---|---|---:|
| `FILE-001` | Upload simples | fluxo | 1x |
| `FILE-002` | Upload múltiplo | fluxo | 2x |
| `FILE-003` | Preview de arquivo | tipo de arquivo | 2x |
| `FILE-004` | Importação CSV | modelo | 2x |
| `FILE-005` | Importação Excel | modelo | 3x |
| `FILE-006` | Mapeamento de colunas | fluxo | 3x |
| `FILE-007` | Exportação CSV | modelo | 1x |
| `FILE-008` | Exportação Excel | modelo | 2x |
| `FILE-009` | Exportação PDF | modelo | 2x |
| `FILE-010` | Geração de documento | template | 3x |
| `FILE-011` | Controle de versões | recurso | 3x |

## 4.6 Fluxos e regras de negócio

| ID | Building block | Unidade recomendada | Complexidade-base |
|---|---|---|---:|
| `FLOW-001` | CRUD básico | entidade | 1x |
| `FLOW-002` | Regra de validação | regra | 1x |
| `FLOW-003` | Regra condicional | regra | 2x |
| `FLOW-004` | Mudança de status | fluxo | 2x |
| `FLOW-005` | Workflow configurável | fluxo | 3x |
| `FLOW-006` | Aprovação simples | fluxo | 2x |
| `FLOW-007` | Aprovação em múltiplos níveis | fluxo | 3x |
| `FLOW-008` | Agendamento | fluxo | 2x |
| `FLOW-009` | Recorrência | regra | 3x |
| `FLOW-010` | Cálculo simples | regra | 1x |
| `FLOW-011` | Motor de cálculo | módulo | 3x |
| `FLOW-012` | Processamento assíncrono | processo | 3x |
| `FLOW-013` | Histórico de alterações | entidade | 2x |
| `FLOW-014` | Desfazer ou restaurar | fluxo | 3x |

## 4.7 Usuários, acesso e segurança

| ID | Building block | Unidade recomendada | Complexidade-base |
|---|---|---|---:|
| `SEC-001` | Login com e-mail e senha | produto | 1x |
| `SEC-002` | Login social | provedor | 2x |
| `SEC-003` | Autenticação em dois fatores | produto | 2x |
| `SEC-004` | Single Sign-On | provedor | 3x |
| `SEC-005` | Papéis predefinidos | produto | 2x |
| `SEC-006` | Permissões granulares | módulo | 3x |
| `SEC-007` | Permissão por registro | entidade | 3x |
| `SEC-008` | Multiempresa ou multitenancy | produto | 3x |
| `SEC-009` | Auditoria | entidade ou produto | 2x |
| `SEC-010` | Criptografia adicional | recurso | 3x |

## 4.8 Comunicação

| ID | Building block | Unidade recomendada | Complexidade-base |
|---|---|---|---:|
| `MSG-001` | E-mail transacional | template | 1x |
| `MSG-002` | Notificação interna | evento | 1x |
| `MSG-003` | SMS | evento | 2x |
| `MSG-004` | Push mobile | evento | 2x |
| `MSG-005` | WhatsApp | fluxo | 3x |
| `MSG-006` | Comentários | entidade | 2x |
| `MSG-007` | Menções | produto | 2x |
| `MSG-008` | Chat em tempo real | módulo | 3x |
| `MSG-009` | Central de notificações | módulo | 2x |
| `MSG-010` | Preferências por canal | produto | 2x |

## 4.9 Integrações

| ID | Building block | Unidade recomendada | Complexidade-base |
|---|---|---|---:|
| `API-001` | Consumo de API simples | integração | 2x |
| `API-002` | OAuth com serviço externo | integração | 2x |
| `API-003` | Webhook de entrada | evento | 2x |
| `API-004` | Webhook de saída | evento | 2x |
| `API-005` | Sincronização unidirecional | integração | 2x |
| `API-006` | Sincronização bidirecional | integração | 3x |
| `API-007` | Mapeamento de campos | integração | 3x |
| `API-008` | Reprocessamento de falhas | integração | 3x |
| `API-009` | API pública | módulo | 3x |
| `API-010` | Documentação de API | módulo | 2x |

## 4.10 Inteligência artificial

| ID | Building block | Unidade recomendada | Complexidade-base |
|---|---|---|---:|
| `AI-001` | Geração de texto | fluxo | 2x |
| `AI-002` | Resumo | fluxo | 2x |
| `AI-003` | Classificação | modelo ou fluxo | 2x |
| `AI-004` | Extração de dados | tipo de documento | 3x |
| `AI-005` | Chat com IA | módulo | 3x |
| `AI-006` | Busca semântica | módulo | 3x |
| `AI-007` | RAG sobre documentos | módulo | 3x |
| `AI-008` | Agente com ações | módulo | 3x |
| `AI-009` | Revisão humana de resultado | fluxo | 2x |
| `AI-010` | Controle de consumo de IA | produto | 2x |

---

## 5. Classificação de complexidade

## 5.1 Complexidade 1x — Simples

Características:

- Interface convencional
- Poucas regras de negócio
- Fluxo linear
- Dados já disponíveis
- Componentes existentes e reutilizáveis
- Sem integração externa
- Baixo risco técnico
- Poucos estados alternativos

Exemplos:

- Login básico
- Perfil simples
- Página institucional
- Formulário com poucos campos
- Listagem sem filtros avançados
- Confirmação de exclusão

Multiplicador recomendado: `1.0`

## 5.2 Complexidade 2x — Intermediária

Características:

- Regras de negócio moderadas
- Múltiplos estados
- Validações condicionais
- Filtros e paginação
- Upload ou exportação
- Controle básico de permissões
- Integração externa padronizada
- Processamento moderado

Exemplos:

- CRUD completo
- Dashboard com filtros
- Checkout padrão
- Gestão de equipe
- Calendário
- Relatório com exportação

Multiplicador recomendado: `2.0`

## 5.3 Complexidade 3x — Complexa

Características:

- Muitas regras condicionais
- Fluxos configuráveis
- Permissões granulares
- Integrações bidirecionais
- Processamento assíncrono
- Tempo real
- Grande volume de dados
- Editor personalizado
- Requisitos elevados de segurança
- Dependência de serviços externos pouco previsíveis

Exemplos:

- Construtor de automações
- Relatórios customizáveis
- Chat em tempo real
- Editor colaborativo
- Motor de cálculo
- Sincronização entre plataformas

Multiplicador recomendado: `3.0`

## 5.4 Critérios objetivos para determinar a complexidade

Pontuar cada critério de 0 a 2:

| Critério | 0 | 1 | 2 |
|---|---|---|---|
| Regras de negócio | Nenhuma ou simples | Moderadas | Complexas ou configuráveis |
| Estados da interface | Até 3 | De 4 a 7 | Mais de 7 |
| Integrações | Nenhuma | Uma integração padrão | Múltiplas ou bidirecionais |
| Permissões | Acesso único | Papéis básicos | Granulares ou por registro |
| Volume de dados | Baixo | Médio | Alto ou tempo real |
| Processamento | Imediato e simples | Assíncrono moderado | Filas, cálculos ou rotinas pesadas |
| Personalização | Fixa | Algumas opções | Editor ou configuração livre |
| Risco técnico | Baixo | Médio | Alto ou desconhecido |

Conversão sugerida:

- De 0 a 4 pontos: **1x**
- De 5 a 10 pontos: **2x**
- De 11 a 16 pontos: **3x**

---

## 6. Estados obrigatórios por página

Não considerar uma página completa sem avaliar seus estados.

| ID | Estado | Aplicação |
|---|---|---|
| `STATE-001` | Carregando | Consulta ou processamento em andamento |
| `STATE-002` | Conteúdo carregado | Estado normal |
| `STATE-003` | Sem dados | Ainda não existem registros |
| `STATE-004` | Sem resultados | Filtro ou busca não retornou dados |
| `STATE-005` | Erro | Falha ao carregar ou processar |
| `STATE-006` | Sem conexão | Usuário desconectado |
| `STATE-007` | Sem permissão | Usuário não possui acesso |
| `STATE-008` | Bloqueado pelo plano | Recurso não incluído |
| `STATE-009` | Enviando | Ação em processamento |
| `STATE-010` | Sucesso | Ação concluída |
| `STATE-011` | Validação | Dados inválidos |
| `STATE-012` | Confirmação | Ação destrutiva ou importante |

---

## 7. Requisitos globais do produto

Esses itens atravessam diversas páginas e não devem ficar escondidos dentro de uma única tela.

| ID | Requisito | Unidade sugerida |
|---|---|---|
| `GLB-001` | Design system | produto |
| `GLB-002` | Layout responsivo | produto ou breakpoint |
| `GLB-003` | Acessibilidade | produto |
| `GLB-004` | Internacionalização | idioma |
| `GLB-005` | Multiempresa | produto |
| `GLB-006` | Papéis e permissões | produto ou módulo |
| `GLB-007` | Auditoria | produto ou entidade |
| `GLB-008` | Analytics de produto | produto |
| `GLB-009` | Monitoramento de erros | produto |
| `GLB-010` | Logs | produto |
| `GLB-011` | Backups | produto |
| `GLB-012` | Migração de dados | fonte |
| `GLB-013` | Ambiente de homologação | ambiente |
| `GLB-014` | Pipeline de publicação | produto |
| `GLB-015` | Documentação | produto ou módulo |
| `GLB-016` | Testes automatizados | produto ou módulo |
| `GLB-017` | LGPD e privacidade | produto |
| `GLB-018` | Segurança avançada | produto |
| `GLB-019` | Aplicativo instalável ou PWA | produto |
| `GLB-020` | Modo offline | produto ou módulo |

---

## 8. Esforços não visíveis que devem entrar no orçamento

## 8.1 Descoberta e definição

- Reuniões de descoberta
- Mapeamento de processos
- Definição de escopo
- Arquitetura da informação
- Protótipos
- Regras de negócio
- Critérios de aceite

## 8.2 Design

- Identidade visual
- Design system
- Wireframes
- Interfaces finais
- Responsividade
- Acessibilidade
- Prototipação e validação

## 8.3 Desenvolvimento

- Frontend
- Backend
- Banco de dados
- APIs
- Integrações
- Automações
- Infraestrutura

## 8.4 Qualidade

- Testes funcionais
- Testes de integração
- Testes de permissões
- Testes em dispositivos
- Testes de carga
- Correção de defeitos
- Homologação

## 8.5 Implantação e operação

- Configuração dos ambientes
- Publicação
- Domínio e certificados
- Monitoramento
- Logs
- Backup
- Migração de dados
- Treinamento
- Suporte inicial

## 8.6 Gestão

- Planejamento
- Gestão do projeto
- Comunicação
- Demonstrações
- Controle de mudanças
- Documentação

---

## 9. Multiplicadores complementares

## 9.1 Reutilização

| Situação | Multiplicador sugerido |
|---|---:|
| Bloco novo | 1.0 |
| Parcialmente reutilizado | 0.7 |
| Totalmente reutilizado com adaptação mínima | 0.4 |
| Apenas replicado ou configurado | 0.2 |

## 9.2 Risco

| Situação | Multiplicador sugerido |
|---|---:|
| Requisito conhecido | 1.0 |
| Pequena incerteza | 1.1 |
| Integração ou regra ainda não validada | 1.25 |
| Forte incerteza técnica | Usar fase de descoberta ou prova de conceito |

## 9.3 Plataforma

| Entrega | Multiplicador ou tratamento sugerido |
|---|---|
| Web responsiva | Base |
| Aplicativo mobile multiplataforma | Orçar como plataforma adicional |
| Aplicativos nativos separados | Orçar iOS e Android separadamente |
| Desktop | Orçar como plataforma adicional |
| API pública | Orçar como módulo |

---

## 10. Fórmula de precificação

### 10.1 Cálculo por building block

```text
valor_do_bloco =
    valor_base
    × quantidade
    × multiplicador_de_complexidade
    × multiplicador_de_reutilizacao
    × multiplicador_de_risco
```

### 10.2 Cálculo da página

```text
valor_da_pagina =
    estrutura_base_da_pagina
    + soma_dos_building_blocks
    + regras_de_negocio
    + estados_especiais
```

### 10.3 Cálculo do módulo

```text
valor_do_modulo =
    soma_das_paginas
    + funcionalidades_compartilhadas
    + integrações_do_modulo
```

### 10.4 Cálculo do projeto

```text
subtotal_do_produto =
    setup_e_arquitetura
    + soma_dos_modulos
    + requisitos_globais
    + integrações
    + qualidade
    + implantação
    + gestão

valor_final =
    subtotal_do_produto
    + contingência
    + impostos
```

---

## 11. Exemplo de orçamento de página

### Dashboard analítico

| Item | ID | Quantidade | Complexidade |
|---|---|---:|---:|
| Estrutura de dashboard | `DSH-003` | 1 | 2x |
| Card de indicador | `UI-004` | 4 | 1x |
| Gráfico interativo | `VIS-002` | 2 | 2x |
| Filtros avançados | `DAT-007` | 1 | 2x |
| Tabela de atividades | `DAT-003` | 1 | 2x |
| Exportação em Excel | `FILE-008` | 1 | 2x |
| Layout responsivo | `UI-014` | 1 | 2x |
| Estado vazio | `STATE-003` | 1 | 1x |
| Estado de erro | `STATE-005` | 1 | 1x |

Observações:

- Os cards podem compartilhar a mesma estrutura visual.
- Os gráficos devem ser orçados individualmente quando possuem regras ou fontes de dados diferentes.
- O backend necessário para agregações deve ser considerado.
- Exportação pode exigir processamento assíncrono quando o volume for alto.

---

## 12. Exemplo de orçamento de entidade

### Entidade: clientes

| Item | ID | Quantidade | Complexidade |
|---|---|---:|---:|
| Listagem | `CORE-001` | 1 | 2x |
| Detalhes | `CORE-002` | 1 | 2x |
| Cadastro | `CORE-003` | 1 | 2x |
| Edição | `CORE-004` | 1 | 2x |
| Exclusão | `CORE-005` | 1 | 1x |
| Histórico | `CORE-008` | 1 | 2x |
| Importação | `CORE-009` | 1 | 3x |
| Exportação | `CORE-010` | 1 | 2x |
| Data grid | `DAT-003` | 1 | 2x |
| Filtros avançados | `DAT-007` | 1 | 2x |
| Ações em lote | `DAT-011` | 2 | 2x |
| Permissão por registro | `SEC-007` | 1 | 3x |

---

## 13. Checklist para levantamento de uma página

- [ ] Qual é o objetivo da página?
- [ ] Quem pode acessá-la?
- [ ] Quais papéis possuem acesso?
- [ ] Quais dados aparecem?
- [ ] De onde vêm os dados?
- [ ] Quais ações o usuário pode realizar?
- [ ] Existem regras condicionais?
- [ ] Existem validações?
- [ ] Existem filtros, busca ou paginação?
- [ ] Existem uploads ou downloads?
- [ ] Existem integrações?
- [ ] É necessário tempo real?
- [ ] Qual é o volume esperado de dados?
- [ ] Quais estados de interface são necessários?
- [ ] A página precisa ser responsiva?
- [ ] Há requisitos de acessibilidade?
- [ ] Existe algo que pode ser reutilizado?
- [ ] Há riscos ou requisitos ainda indefinidos?

---

## 14. Checklist para fechamento do orçamento

- [ ] Todos os módulos foram identificados
- [ ] Todas as páginas foram listadas
- [ ] As entidades principais foram mapeadas
- [ ] Os building blocks foram quantificados
- [ ] A complexidade foi avaliada por critérios objetivos
- [ ] As regras de negócio foram registradas
- [ ] As permissões foram consideradas
- [ ] Os estados vazios, erros e carregamentos foram considerados
- [ ] As integrações foram decompostas
- [ ] Os requisitos globais foram adicionados
- [ ] Design, desenvolvimento e testes foram contemplados
- [ ] Implantação e gestão foram contempladas
- [ ] Reutilização foi descontada de maneira controlada
- [ ] Riscos e dependências foram registrados
- [ ] Foi adicionada contingência
- [ ] Premissas e itens fora do escopo foram documentados

---

## 15. Premissas recomendadas para propostas

- O valor considera apenas os itens descritos no escopo.
- Alterações de escopo devem gerar uma revisão do orçamento.
- Conteúdo, textos legais e traduções devem ter responsáveis definidos.
- Custos de serviços externos não estão incluídos, salvo indicação.
- Integrações dependem da disponibilidade e estabilidade das APIs externas.
- Migração e limpeza de dados devem ser orçadas separadamente.
- Demandas com alta incerteza devem passar por descoberta ou prova de conceito.
- A quantidade de revisões de design deve ser definida.
- Critérios de aceite devem ser aprovados antes do desenvolvimento.
- Suporte e manutenção após a entrega devem possuir condições próprias.

---

## 16. Modelo resumido para cadastro

```yaml
product:
  id: PROD-001
  name: Nome do SaaS
  type: saas
  platforms:
    - web
  global_requirements:
    - GLB-001
    - GLB-002
    - GLB-009
  modules:
    - id: MOD-003
      name: Dashboard
      pages:
        - id: DSH-003
          name: Dashboard analítico
          complexity: 2
          quantity: 1
          states:
            - STATE-001
            - STATE-003
            - STATE-005
          building_blocks:
            - id: UI-004
              quantity: 4
              complexity: 1
              reuse_multiplier: 0.7
            - id: VIS-002
              quantity: 2
              complexity: 2
              reuse_multiplier: 1.0
            - id: DAT-007
              quantity: 1
              complexity: 2
              reuse_multiplier: 1.0
            - id: FILE-008
              quantity: 1
              complexity: 2
              reuse_multiplier: 1.0
```

---

## 17. Regra operacional principal

O orçamento deve seguir esta hierarquia:

```text
Produto
└── Módulos
    ├── Páginas
    │   ├── Building blocks
    │   ├── Regras de negócio
    │   └── Estados
    ├── Funcionalidades compartilhadas
    └── Integrações
```

Uma página nunca deve ser precificada somente pelo seu nome. Primeiro devem ser identificados os building blocks, regras, estados, permissões, integrações e requisitos técnicos que determinam o esforço real.
