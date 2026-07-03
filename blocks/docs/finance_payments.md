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
