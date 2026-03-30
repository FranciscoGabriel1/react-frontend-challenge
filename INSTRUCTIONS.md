# INSTRUCTIONS - CineDash

## Projeto escolhido

**Opcao A: CineDash** - Dashboard analitico de curadoria de filmes consumindo a API publica do TMDB.

---

## Pre-requisitos

- Node.js 20+
- npm 10+
- Conta gratuita no [TMDB](https://www.themoviedb.org/) para obter a credencial da API

---

## Como rodar

### 1. Acesse o diretorio da aplicacao

```bash
cd cinedash
```

### 2. Instale as dependencias

```bash
npm install
```

### 3. Configure as variaveis de ambiente

```bash
cp .env.example .env.local
```

Edite `cinedash/.env.local` e preencha uma das credenciais da TMDB:

```bash
VITE_TMDB_API_KEY=sua_api_key_v3_aqui
# ou
VITE_TMDB_READ_ACCESS_TOKEN=seu_token_v4_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

Importante: mesmo se voce iniciar o projeto pela raiz com `npm run dev`, o arquivo lido pelo app e `cinedash/.env.local`.

Para obter a credencial:
1. Acesse [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Crie uma conta gratuita e solicite acesso a API
3. Copie a **API Key (v3 auth)** ou o **API Read Access Token (v4 auth)**

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicacao estara disponivel em `http://localhost:5173`.

---

## Scripts disponiveis

| Comando | Descricao |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de producao |
| `npm run preview` | Preview do build de producao |
| `npm run test` | Executa os testes (Vitest) |
| `npm run test:ui` | Interface visual dos testes |

---

## Credenciais de acesso (autenticacao simulada)

Como nao ha backend, a autenticacao e simulada no frontend.

- **Email:** qualquer e-mail valido (ex: `user@cinedash.com`)
- **Senha:** qualquer senha com mais de 6 caracteres

---

## Documentacao tecnica

Consulte [ARCHITECTURE.md](./ARCHITECTURE.md) para decisoes arquiteturais detalhadas.
