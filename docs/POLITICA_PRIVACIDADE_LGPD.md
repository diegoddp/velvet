# POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS PESSOAIS

**LGPD - Lei Geral de Proteção de Dados Pessoais (Lei 13.709/2018)**

**Versão 1.0 | Data: [DATA] | Jurisdição: Brasil**

---

## 1. INTRODUÇÃO

A Admire Platform ("Nós" ou "Plataforma") respeita sua privacidade. Esta Política explica como coletamos, usamos, armazenamos e protegemos seus dados pessoais conforme a **Lei 13.709/2018 (LGPD)**.

**Controlador de Dados**: Admire Platform Brasil
**Encarregado de Proteção de Dados (DPO)**: dpo@admire.com.br

---

## 2. DADOS COLETADOS

### Por Categoria:

| Categoria | Dados | Motivo |
|-----------|-------|--------|
| **Identificação** | Nome, CPF, Email | Verificação KYC, conta |
| **Contato** | Telefone, endereço | Comunicação, compliance |
| **Verificação** | RG/CNH, Selfie, Birthdate | Age verification, KYC |
| **Pagamento** | Número de cartão (tokenizado) | Processamento de pagamentos |
| **Comportamento** | Conteúdo visualizado, compras | Recomendações, analytics |
| **Técnico** | IP, User-Agent, Cookies | Segurança, detecção de fraude |
| **Consentimento** | Formulários assinados | Conformidade legal |

### Dados Sensíveis (Artigo 9 LGPD):
- 🔐 **Biométrica**: Selfie para verificação (armazenada separadamente)
- 🔐 **Dados de Saúde**: Nenhum (não coletamos)
- 🔐 **Origem Étnica**: Nenhum (não discriminamos)

---

## 3. BASE LEGAL PARA PROCESSAMENTO

### Nossas Bases Legais (Artigo 7):

| Processamento | Base Legal | Período |
|---------------|-----------|---------|
| Criar conta | **Consentimento** + Contrato | Enquanto usuário ativo |
| Age verification | **Obrigação legal** (Digital ECA) | Mínimo 1 ano |
| KYC creator | **Obrigação legal** (LGPD Art. 16) | Enquanto creator |
| Pagamentos | **Contrato** | Mínimo 7 anos (fiscal) |
| Segurança | **Interesse legítimo** | Enquanto necessário |
| Compliance | **Obrigação legal** | Conforme Lei |
| Marketing | **Consentimento** (opt-in) | Até revogação |

---

## 4. FINALIDADES DO PROCESSAMENTO

Seus dados são usados APENAS para:

### Obrigatórias (Sem consentimento adicional):
✅ Criar e gerenciar sua conta
✅ Processar pagamentos e assinaturas
✅ Cumprir obrigações legais (LGPD, Digital ECA, etc.)
✅ Prevenir fraude e abuso
✅ Investigar denúncias de conteúdo ilegal
✅ Comunicações de segurança/legal

### Opcionais (Requer consentimento):
- 📧 Marketing por email
- 📱 Notificações push
- 📊 Pesquisas de satisfação
- 💡 Recomendações personalizadas

---

## 5. COMPARTILHAMENTO DE DADOS

### Com Quem Compartilhamos:

| Receptor | Dados | Motivo | Contrato |
|----------|-------|--------|----------|
| **Processador de Pagamentos** | Tokenizado apenas | Pagamentos | ✅ DPA |
| **Provedor de Age Verification** | CPF + Biométrica | KYC | ✅ DPA |
| **AWS S3** | Media + Backups | Armazenamento | ✅ DPA |
| **Autoridades Públicas** | Conforme solicitado | Conformidade legal | Lei |
| **NCMEC/PF** | Dados suspeitos de CSAM | Proteção de menores | Lei 15.211/25 |

### Compartilhamento PROIBIDO:
❌ **NÃO** vendemos seus dados a terceiros
❌ **NÃO** compartilhamos com anunciantes
❌ **NÃO** alugamos listas de emails
❌ **NÃO** usamos para perfil de crédito

---

## 6. ARMAZENAMENTO & SEGURANÇA

### Onde Armazenamos:
🔐 **Servidores**: Brasil (conforme exigência LGPD)
🔐 **Backup**: Encriptado, retenção 90 dias
🔐 **Dados Sensíveis**: Separados, acesso restrito

### Medidas de Segurança:
✅ Criptografia AES-256 para dados sensíveis
✅ TLS 1.3 para transmissão
✅ Hash bcrypt para senhas (12+ rounds)
✅ MFA/2FA para contas admin
✅ WAF e DDoS protection
✅ Logging e monitoramento 24/7
✅ Testes de penetração trimestral
✅ SIEM para detecção de anomalias

### Acesso:
- Apenas funcionários autorizados
- Assinaram NDA
- Logs de acesso auditados
- Sem acesso a dados de cliente desnecessário

---

## 7. SEUS DIREITOS (ARTIGOS 17-19 LGPD)

Você tem direito a:

### 1. Direito de Acesso (Art. 18)
**O quê**: Obter cópia de todos seus dados
**Como**: Enviar para privacy@admire.com.br
**Prazo**: 15 dias úteis
**Formato**: PDF ou arquivo eletrônico
**Custo**: Gratuito

### 2. Direito de Retificação (Art. 19)
**O quê**: Corrigir dados incorretos ou incompletos
**Como**: Painel de conta ou email
**Prazo**: Corrigido imediatamente
**Exemplo**: "Meu CPF está errado"

### 3. Direito de Exclusão (Art. 17) - Direito ao Esquecimento
**O quê**: Solicitar exclusão de dados pessoais
**Quando**: Em qualquer momento
**Como**: privacy@admire.com.br
**Prazo**: 15 dias úteis

**Limitações**: Podemos reter dados se:
- Obrigação legal (e.g., fiscal, anti-fraude)
- Investigação pendente de conteúdo ilegal
- Contrato ativo (e.g., assinatura)

### 4. Direito de Portabilidade (Art. 18)
**O quê**: Receber dados em formato estruturado
**Formato**: CSV/JSON
**Para transferir**: Para outro serviço
**Prazo**: 15 dias úteis

### 5. Direito de Oposição (Art. 21)
**O quê**: Se opor ao processamento por interesse legítimo
**Exemplo**: "Não quero recomendações personalizadas"
**Resultado**: Dados não mais usados naquele propósito

### 6. Direito a Informação (Art. 9)
**O quê**: Ser informado sobre seus direitos
**Como**: Esta Política + resposta a solicitações

---

## 8. RETENÇÃO DE DADOS

### Duração Por Categoria:

| Dados | Retenção | Razão |
|-------|----------|-------|
| **Email/Senha** | Enquanto ativo + 90 dias | Recuperação de conta |
| **CPF/RG** | 7 anos | Obrigação fiscal |
| **Selfie/Biométrica** | 2 anos pós-exclusão | Detecção de fraude |
| **Transações** | 7 anos | Conformidade fiscal |
| **Logs de Segurança** | 1 ano | Investigação de segurança |
| **Conteúdo Reportado** | 5 anos+ | Investigação legal |
| **Marketing** | Até opt-out | Consentimento |

**Depois de expirado**: Dados são criptograficamente destruídos

---

## 9. COOKIES & RASTREAMENTO

### Cookies Usados:

| Tipo | Propósito | Consentimento |
|------|----------|----------------|
| **Sessão** | Login, shopping cart | Necessário |
| **Analytics** | Google Analytics (anonimizado) | Opt-in |
| **Marketing** | Pixels de retargeting | Opt-in |
| **Preferências** | Tema, idioma | Necessário |

### Sua Opção:
- Browser settings → Desabilitar cookies
- Painel de privacidade da Admire → Gerenciar consentimento
- DNT (Do Not Track) → Respeitamos

---

## 10. MUDANÇAS NA POLÍTICA

Se alterarmos esta Política:
- 📧 Notificação por email 30 dias antes
- 📢 Publicado aqui com data
- ✅ Sua continuidade = Aceitação

---

## 11. CONFORMIDADE COM LGPD

### Obrigações Cumpridas:
✅ **Art. 5**: Princípios de transparência, finalidade, necessidade
✅ **Art. 7**: Base legal documentada
✅ **Art. 9**: Consentimento para dados sensíveis
✅ **Art. 16**: Notificação de vazamento em 48h
✅ **Art. 17-19**: Direitos exercíveis
✅ **Art. 48-49**: Termo de consentimento separado
✅ **Art. 50**: Responsabilidade em contrato com fornecedores

### Incidente de Dados:
Se suspeita de vazamento:
1. Investigação imediata
2. Notificação ANPD em 48h (se risco)
3. Notificação a você por email
4. Remediação em <30 dias

---

## 12. CONTATO PARA PRIVACIDADE

### Para Solicitar Direitos LGPD:
**Email**: privacy@admire.com.br
**Assunto**: "[SOLICITAÇÃO LGPD] [Seu Nome] - [Tipo de Direito]"

**Tipos de Solicitação**:
- "Direito de Acesso"
- "Direito de Exclusão"
- "Direito de Retificação"
- "Direito de Portabilidade"

**Resposta garantida**: Dentro de 15 dias úteis

### Para Reclamação:
Se achar que não cumprimos LGPD:

1. **Contate-nos primeiro**: dpo@admire.com.br
2. **Escalação a ANPD**: https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd

---

## 13. CRIANÇAS & MENORES

🚫 **NÃO coletamos dados de menores de 18 anos**

- **Serviço é 18+ apenas**
- Se descobrirmos menor, deletamos **imediatamente**
- Nenhum tracking de crianças

---

## 14. TRANSFERÊNCIA INTERNACIONAL

Nossos dados são armazenados **APENAS no Brasil** (conforme LGPD Art. 33).

Se dados precisarem sair do Brasil (backup, conformidade):
- ✅ Contrato de Processamento de Dados (DPA)
- ✅ Garantias de proteção equivalente
- ✅ Notificação ao usuário

---

## 15. ALTERAÇÕES & ATUALIZAÇÕES

**Última Atualização**: [DATA]
**Próxima Revisão**: [DATA + 6 meses]

---

**Ao usar a Admire, você aceita esta Política de Privacidade.**

**Para questões**: privacy@admire.com.br

---

*Documento preparado em conformidade com Lei 13.709/2018 (LGPD) e Lei 15.211/2025 (Digital ECA).*
