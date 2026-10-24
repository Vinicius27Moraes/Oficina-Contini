# Deploy no cluster local

O workflow `.github/workflows/ci-cd.yml` valida pull requests e faz deploy no
cluster `kind` quando uma alteração chega à branch `main`. O runner
`self-hosted` precisa ter Docker, `kind`, `kubectl` e acesso ao cluster cujo
nome é `oficina`.

## Configurar o cluster

Crie o namespace e um arquivo `oficina-infra/.env.k8s` localmente. Esse arquivo
é ignorado pelo Git. Preencha com valores próprios e URLs válidas para o banco:

```dotenv
POSTGRES_USER=oficina
POSTGRES_PASSWORD=troque-por-uma-senha-forte
POSTGRES_DB=oficina
DATABASE_URL=postgresql://oficina:troque-por-uma-senha-forte@postgres:5432/oficina?schema=public&connection_limit=5
DIRECT_URL=postgresql://oficina:troque-por-uma-senha-forte@postgres:5432/oficina?schema=public
AUTH_SECRET=gere-um-segredo-aleatorio-longo
AUTH_TRUST_HOST=true
MASTER_EMAIL=seu-email
MASTER_PASSWORD=uma-senha-forte-diferente
```

No PowerShell, aplique o Secret e os recursos:

```powershell
kubectl create namespace oficina --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret generic oficina-secret -n oficina --from-env-file=oficina-infra/.env.k8s --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -f oficina-infra/k8s.yaml
```

O arquivo `.env.k8s` não deve ser commitado nem compartilhado. Gere
`AUTH_SECRET` com `npx auth secret` ou um gerador criptograficamente seguro.
Se o cluster já usa o banco em PVC, altere a senha também no PostgreSQL antes
de atualizar o Secret; mudar apenas o Secret não muda a senha do banco existente.

## Configurar o runner do GitHub Actions

Instale e registre um runner self-hosted na máquina que controla o cluster
`kind` chamado `oficina`. Restrinja esse runner ao repositório e não execute
workflows de branches não confiáveis nele. O job de deploy só roda depois da
validação e em push para `main`.

Configure proteção da branch `main` no GitHub para exigir o check
**Validar aplicação** antes do merge. Para promover artefatos, mantenha o runner
online; o workflow constrói uma imagem identificada pelo SHA do commit, carrega
no `kind`, espera o rollout e tenta restaurar a revisão anterior se falhar.

As credenciais que estavam no manifesto já foram expostas no histórico Git.
Removê-las do arquivo atual não apaga versões antigas: troque as credenciais no
cluster e invalide os valores antigos.
