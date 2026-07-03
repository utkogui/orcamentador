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
