# Oficina Mecânica — Next.js + Prisma + Neon (Netlify)

Reescrita completa do sistema de gestão de oficina, agora em uma stack moderna e
com suporte oficial, pronta para ser publicada como site público no Netlify.

## Stack

| Camada        | Tecnologia                                   |
|---------------|-----------------------------------------------|
| Framework     | Next.js 14 (App Router, Server Actions)       |
| Linguagem     | TypeScript                                     |
| Estilo        | Tailwind CSS                                   |
| Banco de dados| PostgreSQL via **Neon** (serverless, com pool)|
| ORM           | Prisma                                         |
| Deploy        | Netlify (`@netlify/plugin-nextjs`)             |

## Funcionalidades

- Cadastro de **clientes**, **veículos** (por placa), **peças/estoque** e **funcionários**
- **Ordens de serviço** com itens, baixa automática de estoque ao usar uma peça
  cadastrada, cálculo automático do valor total e controle de status
  (Aberta → Em andamento → Aguardando peça → Finalizada/Cancelada)
- Painel com indicadores (ordens em aberto, peças com estoque baixo, últimas ordens)
- Histórico de serviços por veículo (via relação Veículo → Ordens de Serviço)

## 1. Rodando localmente

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL, DIRECT_URL, AUTH_SECRET, MASTER_EMAIL/PASSWORD
npm run db:push        # cria as tabelas no banco a partir do prisma/schema.prisma
npm run db:seed        # cria o usuário master + dados de exemplo
npm run dev
```

Acesse `http://localhost:3000` — você será redirecionado para `/login`.
Entre com o `MASTER_EMAIL` / `MASTER_PASSWORD` que colocou no `.env`.

## 2. Login e gestão de usuários

- Todo o sistema fica atrás de login (o middleware bloqueia qualquer página
  para quem não estiver autenticado).
- O **usuário master** é criado pelo `npm run db:seed`, usando as variáveis
  `MASTER_EMAIL` e `MASTER_PASSWORD` do `.env`. Ele é o único que enxerga o
  menu **Usuários**, onde pode:
  - criar novos usuários **Padrão** (para a equipe da oficina usar no dia a dia);
  - ativar/desativar qualquer usuário;
  - redefinir a senha de qualquer usuário;
  - opcionalmente criar outro usuário Master.
- Rode `npm run db:seed` novamente a qualquer momento para redefinir a senha
  do master, caso a perca (ele usa `upsert`, então não duplica).
- Depois do primeiro login, troque a senha do master (via o próprio botão
  "Redefinir senha" — você pode redefinir a de outro master também).

## 2. Criando o banco gratuito no Neon

1. Crie uma conta em **https://neon.tech** e um novo projeto (escolha a região
   mais próxima da sua oficina, ex. `sa-east-1` para Brasil).
2. No painel do projeto, abra **"Connection Details"**.
3. Copie **duas** URLs de conexão:
   - **Pooled connection** (contém `-pooler` no host) → variável `DATABASE_URL`.
     É essa que a aplicação usa em produção — permite que centenas de
     requisições simultâneas das Netlify Functions compartilhem poucas
     conexões físicas com o Postgres via PgBouncer, evitando o erro clássico
     de "too many connections" em ambientes serverless.
   - **Direct connection** (sem `-pooler`) → variável `DIRECT_URL`.
     É usada só pelo Prisma para rodar migrations/`db push`, porque o
     PgBouncer em modo *transaction* não suporta os comandos DDL usados nessas
     operações.

Cole as duas no seu `.env` (veja `.env.example` para o formato exato).

## 3. Publicando no Netlify

1. Suba este projeto para um repositório no GitHub/GitLab.
2. No Netlify, clique em **"Add new site" → "Import an existing project"** e
   selecione o repositório.
3. O Netlify deve detectar o `netlify.toml` automaticamente. Confirme:
   - **Build command:** `npx prisma generate && npm run build`
   - **Publish directory:** `.next`
4. Em **Site settings → Environment variables**, adicione:
   - `DATABASE_URL` — a URL **pooled** do Neon
   - `DIRECT_URL` — a URL **direta** do Neon
   - `AUTH_SECRET` — gere com `npx auth secret` (ou uma string aleatória longa)
   - `AUTH_TRUST_HOST` — `true`
   - `MASTER_EMAIL` / `MASTER_PASSWORD` — usados só quando você rodar o seed
5. Clique em **Deploy site**.
6. Antes do primeiro acesso, rode as migrations contra o banco do Neon a
   partir da sua máquina (usando o mesmo `.env` de produção):
   ```bash
   npm run db:push
   npm run db:seed   # opcional
   ```

Pronto — o site estará público em `https://SEU-SITE.netlify.app`.

## Por que essa estrutura tem melhor desempenho no Netlify

- **Singleton do Prisma Client** (`lib/prisma.ts`): reaproveita a mesma
  instância de conexão entre invocações da Netlify Function, em vez de abrir
  uma conexão nova a cada requisição.
- **Connection pooling do Neon**: com o parâmetro `-pooler`, o Postgres
  aguenta picos de acesso simultâneo mesmo no plano gratuito.
- **Server Actions em vez de API Routes redundantes**: menos código, menos
  waterfalls de rede, formulários funcionam mesmo sem JavaScript carregado.
- **Server Components por padrão**: cada página busca os dados direto no
  banco durante a renderização no servidor — sem uma camada extra de API
  client-side, reduzindo o tempo até o conteúdo aparecer.

