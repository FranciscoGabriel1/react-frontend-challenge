# INSTRUCTIONS — CineDash

## Projeto escolhido

**Opção A: CineDash** — Dashboard analítico de curadoria de filmes consumindo a API pública do TMDB.

---

## Pré-requisitos

- Node.js 20+
- npm 10+
- Conta gratuita no [TMDB](https://www.themoviedb.org/) para obter a API key

---

## Como rodar

### 1. Acesse o diretório da aplicação

```bash
cd cinedash
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` e preencha sua TMDB API key:

```
VITE_TMDB_API_KEY=sua_api_key_aqui
```

Para obter a key:
1. Acesse [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Crie uma conta gratuita e solicite acesso à API
3. Copie a **API Key (v3 auth)**

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run test` | Executa os testes (Vitest) |
| `npm run test:ui` | Interface visual dos testes |

---

## Credenciais de acesso (autenticação simulada)

Como não há backend, a autenticação é simulada no frontend.

- **Email:** qualquer e-mail válido (ex: `user@cinedash.com`)
- **Senha:** qualquer senha com mais de 6 caracteres

---

## Documentação técnica

Consulte [ARCHITECTURE.md](./ARCHITECTURE.md) para decisões arquiteturais detalhadas.
