# 🔮 Manual de Arquitetura e Integração SaaS: The Oracle Academy

Este documento fornece as diretrizes técnicas da reestruturação arquitetural realizada no **The Oracle Academy**. O sistema foi transformado de uma aplicação com acoplamento monolítico em uma plataforma SaaS modular de nível empresarial, pronta para produção, escalável e segura.

---

## 📐 1. Camadas da Arquitetura Geral

O ecossistema está dividido em 3 camadas físicas e lógicas rigorosamente isoladas:

```
                                    ┌────────────────────────┐
                                    │    CLIENTE (FRONTEND)  │
                                    │ React + Vite + Hooks   │
                                    └───────────┬────────────┘
                                                │ (API REST + JWT)
                                                ▼
                                    ┌────────────────────────┐
                                    │   SERVIDOR (BACKEND)   │
                                    │ Express + MVC + Services│
                                    └─────┬────────────┬─────┘
                                          │            │
                         (Postgres Pool)  │            │  (In-Memory Fallback)
                                          ▼            ▼
                                    ┌───────────┐┌───────────┐
                                    │POSTGRESQL ││LOCAL CACHE│
                                    │ DATABASE  ││   ENGINE  │
                                    └───────────┘└───────────┘
```

### 🎨 A. Camada do Cliente (Frontend)
Localizada em `/src`, segue a separação estrita de responsabilidades:
*   **`/services/api.ts`**: Cliente HTTP central que sintoniza as requisições com o backend, anexando o cabeçalho `Authorization: Bearer <TOKEN>` e gerenciando erros de rede.
*   **`/services/firebase.ts`**: Inicializador oficial do Firebase Authentication com escopos do Google Workspace integrados.
*   **`/hooks`**: Custom Hooks (`useAuth.ts`, `useCart.ts`, `useTheme.ts`) isolando o estado e lógica de ciclo de vida das páginas React.
*   **`/pages`**: Páginas isoladas com marcação TSX e lógica de apresentação limpa, incluindo a nova `/cart` (carrinho) e `/seller/:id` (portal de reputação do vendedor).

### 🚀 B. Camada do Servidor (Backend)
Localizada em `/server`, implementa o padrão de arquitetura desacoplada:
*   **`/database`**: Gerenciador de conexão física com pool de conexões PostgreSQL (`pool.ts`) aliado a uma egrégora de resiliência in-memory (`fallbackDB`) garantindo estabilidade imediata sem exigir dependência externa.
*   **`/middlewares`**: Barreira de proteção cibernética (`security.middleware.ts`, `auth.middleware.ts`, `error.middleware.ts`).
*   **`/services`**: Motores de negócio isolados (Gemini, Repasses do Split, Workspace Docs).
*   **`/controllers`**: Orquestradores de requisição HTTP que acionam a camada de negócio e retornam JSONs limpos.
*   **`/routes`**: Rotas REST isoladas mapeadas em `/api`.

### 🗄️ C. Camada de Dados (Modelagem Real)
Definida em `/server/database/schema.sql`, estruturada em tabelas físicas relacionais no PostgreSQL:
1.  `users`: Cadastro de acessos e cargos (`admin`, `aluno`, `vendedor`).
2.  `profiles`: Correspondências astrológicas, XP e dados de privacidade do buscador.
3.  `courses`: Cursores gerados pela IA ou admin, estruturados em JSONb.
4.  `user_course_progress`: Lições concluídas e pontuação oracular do aluno.
5.  `marketplace_items`: Artefatos ativos e relicário de vendas.
6.  `product_reviews`: Notas de estrelas (1 a 5) e feedbacks agregados de reputação.
7.  `sellers`: Carteira digital individual com balanço (`balance`) e taxas ajustáveis.
8.  `transactions`: Rastreabilidade de saques PIX, repasses de split e créditos de compra.
9.  `purchases`: Registros históricos de transações financeiras físicas e virtuais.

---

## 🔐 2. Defesas Cibernéticas e Segurança

A segurança foi reformulada para suportar auditorias de conformidade SaaS em produção:

*   **Bcrypt Hashing:** Todas as senhas (incluindo usuários de integração Google) são processadas por hash criptográfico usando Bcrypt com fator de complexidade `10` antes da gravação física.
*   **JWT Bearer Auth:** Login e sincronizações geram chaves JSON Web Tokens assinadas por assinatura criptográfica assimétrica. O middleware de autenticação intercepta rotas privadas e descodifica as permissões para `req.user`.
*   **Prevenção contra SQL Injection:** O driver oficial `pg` é configurado para receber apenas consultas parametrizadas (ex: `$1, $2`). É expressamente proibida a concatenação direta de strings nas strings de query SQL.
*   **Heurísticas Antivulnerabilidades:** O middleware `security.middleware.ts` intercepta payloads de entrada e aplica heurísticas ativas contra ataques:
    *   *XSS (Cross-Site Scripting):* Conversão/escape sistemático de tags HTML em dados textuais de entrada.
    *   *SQL Injection Heurísticas:* Bloqueio preemptivo de requisições que apresentem padrões de manipulação de queries (ex: `UNION SELECT`, `--`, `OR 1=1`).
    *   *CORS e CSP:* Cabeçalhos robustos bloqueando frames externos (`X-Frame-Options: DENY`) e limitando conexões a domínios não homologados.

---

## 🤖 3. Sistema Inteligente de Geração de Cursos (IA Gemini)

O motor oracular em `/server/services/gemini.service.ts` atua com caching inteligente para reduzir tempos de latência e custos de faturamento com IA:

1.  **Busca de Títulos Similares:** Antes de acionar os modelos de inteligência artificial, o serviço executa uma busca relacional por títulos aproximados no banco de dados (`ILIKE '%tema%'`).
2.  **Gravação e Indexação:** Caso não haja correspondência, o serviço aciona a API do Google Gemini com um prompt estruturado rígido, exigindo resposta formatada em JSON com módulos, lições em Markdown, dicas didáticas e metadados de imagem.
3.  **Estrutura Dinâmica:** O curso gerado é persistido instantaneamente no banco com status `gerado`, tornando-se disponível imediatamente a toda a comunidade de buscadores.

---

## 💰 4. Split de Pagamento e Marketplace Multivendedor

O ecossistema financeiro imita o fluxo de grandes marketplaces (ex: Mercado Livre / Hotmart):

### A. Fluxo de Repasse de Split (15% Plataforma / 85% Vendedor)

```
 [Comprador finaliza Cart] ──> [Preference MP / PIX aprovado]
                                          │
                                          ▼
                             ┌────────────────────────┐
                             │ Webhook /api/payment   │
                             └────────────┬───────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼ (15% Comissão Plataforma)                     ▼ (85% Repasse Líquido)
         [Saldo Plataforma]                               [Carteira do Vendedor]
         Registrado na Transação                          Saldo somado no banco
```

*   **Mercado Pago Integration:** A rota `/api/payments/create-preference` lê os itens do carrinho de compras e gera uma preferência oficial de checkout integrada ao gateway do Mercado Pago Sandbox.
*   **Webhooks de IPN:** O receptor `/api/payments/webhook` escuta eventos do Mercado Pago para liberar o pedido e executar a divisão da transação automaticamente no banco.
*   **PIX Sandbox Simulator:** Se as chaves reais não forem injetadas no ambiente, o sistema ativa um modo simulador que exibe um QR Code temático místico e permite aprovar o pagamento localmente com um clique, disparando com perfeição os registros de split de comissão pós-aprovação.
*   **Sistema de Saque (Withdrawal):** O vendedor acessa seu saldo através de seu perfil e faz a requisição informando a chave PIX e valor. O sistema valida contra saldos físicos negativos e grava a transação na fila de auditoria humana.

---

## 🚀 5. Scripts de Build, Deploy e Inicialização

O repositório está equipado com scripts npm automatizados para o ecossistema de produção:

### Requisitos Mínimos
*   Node.js v18 ou superior.
*   Instalação limpa via `npm install --legacy-peer-deps` (evitando atritos de dependências legadas).

### Comandos de Desenvolvimento
Inicia a egrégora localmente combinando Express backend e Vite frontend em tempo real na porta `3000`:
```bash
npm run dev
```

### Comandos de Produção
Compila o frontend estático para a pasta `/dist` e empacota o servidor central usando `esbuild` em um único executável otimizado em `/dist/server.cjs`:
```bash
npm run build
```
Para inicializar o servidor empacotado em produção:
```bash
npm run start
```

### Docker-Compose
Para orquestrar um container de banco de dados PostgreSQL persistente localmente:
```bash
docker-compose up -d
```

---

## 🎯 6. Escalabilidade e Evoluções Futuras

Para expandir os limites da infraestrutura rumo a milhões de conexões ativas:

1.  **Réplicas de Leitura no Postgres:** Configure o Pool do `pg` no arquivo `server/database/pool.ts` para balancear queries pesadas de busca de cursos por similaridade em réplicas read-only.
2.  **Fila de Webhooks (Redis):** Em altos picos de vendas, substitua o tratamento síncrono de webhook por uma fila de concorrência com Redis (BullMQ), mitigando gargalos de requisições de split de pagamento concorrentes.
3.  **Workspace Real OAuth Integration:** Para transicionar as credenciais estáticas do Google Docs e Drive para cada buscador individual, substitua o fluxo de conta de serviço por um fluxo OAuth2 completo de consentimento do Workspace no frontend.
