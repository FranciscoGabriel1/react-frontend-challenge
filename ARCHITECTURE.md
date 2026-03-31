# ARCHITECTURE - CineDash

## Visao Geral

CineDash e um dashboard de curadoria de filmes construido com React 19, TypeScript strict e uma stack moderna orientada a tipo-seguranca e escalabilidade. Cada decisao arquitetural foi tomada com o objetivo de produzir codigo que seja rastreavel, testavel e facil de evoluir.

---

## Estrutura: Feature-Sliced Design (FSD)

O projeto e organizado por **dominio de negocio**, nao por tipo de arquivo:

```
src/
├── features/
│   ├── auth/          # Autenticacao simulada (schema, store, form)
│   ├── movies/        # Listagem, detalhes, busca, hover card
│   └── watchlist/     # Store persistido, hook, integracao com tabela
├── shared/
│   ├── http/          # Camada de transporte HTTP (IoC)
│   ├── components/    # ErrorBoundary, AppHeader, AppFooter
│   ├── hooks/         # useDebounce
│   └── ui/            # Re-exports Shadcn/ui
└── pages/             # Composicao de features por rota
```

**Por que FSD e nao `components/` flat?** Uma pasta `components/` com 30+ arquivos mistura autenticacao, filmes e UI generica - impossivel saber o escopo de uma mudanca sem ler o arquivo. FSD garante que cada feature seja coesa e que mudancas em `auth/` nunca afetem `movies/` acidentalmente.

---

## Camada HTTP: IoC com IHttpClient

```
IHttpClient (interface) ← MovieService depende apenas disso
        ↑
AxiosHttpClient (adaptador) ← unica dependencia de axios no projeto
        ↑
httpClient.ts (fabrica) ← instancia com baseURL e token TMDB
```

**Decisao:** `MovieService` recebe `IHttpClient` via construtor - nunca importa `axios` diretamente. Para trocar de axios por `fetch` nativo: criar `FetchHttpClient implements IHttpClient` e mudar uma linha na fabrica. Nenhum service, hook ou componente precisa ser alterado.

**Interceptors em `AxiosHttpClient`:**
- Request: injeta `Authorization: Bearer <token>` em todas as requests
- Response: captura erros HTTP e relanca como `Error` tipado com status code

---

## Server State: TanStack Query v5

### Query Key Factories

```ts
export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters) => [...movieKeys.lists(), filters] as const,
  detail: (id) => [...movieKeys.all, 'detail', id] as const,
  credits: (id) => [...movieKeys.detail(id), 'credits'] as const,
  videos: (id, mediaType) => [...movieKeys.detail(id), 'videos', mediaType] as const,
  search: (query) => [...movieKeys.all, 'search', query] as const,
}
```

**Por que factories?** `queryClient.invalidateQueries({ queryKey: movieKeys.lists() })` invalida todas as listas sem tocar nos detalhes individuais. Strings literais hardcoded criam bugs silenciosos de cache stale que so aparecem em producao.

### Estrategia de Cache

- Filmes populares/trending: `staleTime` alto (5 min) - muda pouco
- Busca: `staleTime` baixo (30s) - sensivel a queries do usuario
- Detalhes: cache por ID + mediaType - `/movie/123` e `/tv/123` sao diferentes keys
- Listagens (BrowsePage): `useInfiniteQuery` - TanStack Query armazena cada pagina individualmente em cache; navegar de volta reutiliza paginas ja carregadas sem nova request

### Scroll Infinito (BrowsePage)

`BrowsePage` usa `useInfiniteQuery` em vez de `useQuery` com paginacao manual:

```ts
useInfiniteQuery({
  queryKey: [...movieKeys.lists(), 'infinite', filters],
  queryFn: ({ pageParam }) => movieService.discover({ ...filters, page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) =>
    allPages.length < MAX_PAGES && lastPage.page < lastPage.total_pages
      ? lastPage.page + 1
      : undefined,
})
```

**Limite de paginas (`MAX_PAGES = 10`):** sem limite o scroll infinito acumularia centenas de paginas, tornando o footer inatingivel e degradando a performance com excesso de nos no DOM. Com 10 paginas (200 itens) o usuario sempre alcanca o footer.

**Acionamento via `IntersectionObserver`:** um elemento sentinela invisivel (`<div ref={sentinelRef} />`) e posicionado ao final da lista com `rootMargin: '300px'` - a proxima pagina comeca a carregar antes do usuario chegar ao final, simulando carregamento continuo sem jank.

**Reset automatico de pagina:** como os filtros fazem parte da `queryKey`, qualquer alteracao de filtro gera uma nova query do zero (pagina 1), sem necessidade de reset manual de estado.

**Dois hooks distintos mantidos:**
- `useMovies` / `useTvShows` - `useQuery` paginado, usado em dashboards e testes
- `useInfiniteMovies` / `useInfiniteTvShows` - `useInfiniteQuery`, exclusivo do BrowsePage

---

## Roteamento: TanStack Router (file-based)

### Por que TanStack Router e nao React Router v6?

React Router v6 exige casting manual em params e search params:
```ts
const { id } = useParams() as { id: string } // cast forcado
```

TanStack Router gera tipos end-to-end a partir da definicao da rota:
```ts
const { id } = Route.useParams() // id: string - tipado automaticamente
```

### Estrategia de Modal de Detalhes

O modal de detalhe do filme (`/movie/$id`) nao e uma pagina separada - e uma rota que sobrepoe o Dashboard. Isso permite:
- URL compartilhavel com o modal aberto
- Navegacao com back/forward do browser
- Manter o estado do Dashboard por baixo sem remontagem

A rota `/_auth.tsx` detecta se `/_auth/movie/$id` esta ativa via `useMatches()` e renderiza o modal + o Dashboard simultaneamente.

### Parametro `?t=tv`

Series de TV e filmes compartilham a mesma rota `/movie/$id`. O discriminador `?t=tv` na query string determina qual endpoint chamar (`/tv/{id}` vs `/movie/{id}`). Validado com Zod no `validateSearch` da rota.

---

## Client State: Zustand v5

**Auth Store** (`authStore`):
- `token: string | null` + `user: { email }` + `isAuthenticated()`
- `login()` gera UUID ficticio via `crypto.randomUUID()` - sem backend
- Persistido via `persist` middleware no `localStorage` - sessao sobrevive ao reload

**Watchlist Store** (`watchlistStore`):
- `movies: Movie[]` + `addMovie` / `removeMovie` / `isInWatchlist`
- Deduplicacao no `addMovie`: se o filme ja existe, nao adiciona
- Persistido no `localStorage` - watchlist sobrevive ao reload e a fechamento do browser

**Theme Store** (`themeStore`):
- `theme: 'dark' | 'light'` com toggle
- Aplica classe `dark` no `<html>` via `useEffect` - compativel com Tailwind dark mode

**Por que Zustand e nao Context API?** Context API re-renderiza todos os consumers ao mudar qualquer parte do estado. Zustand usa selectors granulares - componentes so re-renderizam quando o slice que eles consomem muda.

---

## Formularios: React Hook Form + Zod

```ts
const loginSchema = z.object({
  email: z.string().email('E-mail invalido'),
  password: z.string().min(6, 'Senha deve ter mais de 6 caracteres'),
})
```

O schema Zod e a **unica source of truth** para validacao: inferencia de tipo automatica via `z.infer<typeof loginSchema>`, sem duplicar interfaces TypeScript. RHF integra nativamente com Zod via `zodResolver` - validacao acontece no submit e em tempo real apos primeiro erro.

---

## Debounce na Busca

```ts
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
```

Sem debounce, cada tecla dispararia uma request ao TMDB. Com 400ms no header de busca, a request so sai quando o usuario para de digitar. O hook limpa o timer anterior no cleanup do `useEffect` - se o usuario digitar rapido, apenas o valor final dispara a request.

---

## TanStack Table na Watchlist

A `WatchlistPage` usa `@tanstack/react-table` com tres row models combinados:

| Row model | Funcao |
|---|---|
| `getCoreRowModel` | Base obrigatoria |
| `getSortedRowModel` | Sorting por Titulo, Genero, Lancamento, Rating |
| `getPaginationRowModel` | Paginacao client-side (5 itens por pagina) |

**Filtro de busca por titulo:** implementado fora do TanStack Table (filtragem manual no array `filteredMovies` via `useMemo`) para manter controle explicito sobre o reset de pagina. Quando o valor do filtro muda, `pageIndex` e resetado para 0 junto com o `filterValue`.

**Por que filtrar fora da tabela?** O TanStack Table oferece `getFilteredRowModel`, mas reset automatico de pagina ao filtrar requer configuracao adicional (`autoResetPageIndex`). Filtrar externamente e passar `filteredMovies` como `data` e mais simples e mantem a logica de reset explicita e rastreavel.

O genero e derivado dinamicamente via `genreMap` (lookup de `genre_ids[0]` → nome) para nao precisar de dados pre-enriquecidos no store.

---

## Normalizacao de Series (TV)

A API TMDB usa schemas diferentes para filmes e series:

| Campo | Filme | Serie |
|---|---|---|
| titulo | `title` | `name` |
| data | `release_date` | `first_air_date` |
| duracao | `runtime` (min) | `episode_run_time[0]` |

`MovieService.normalizeTvShow()` mapeia o schema de serie para o tipo `Movie` interno, garantindo que o restante da aplicacao (hooks, componentes, store) nunca precise se preocupar com essa distincao. O discriminador `mediaType: 'tv'` e preservado para os casos onde a diferenca importa (URL de videos, endpoint de detalhes).

---

## Desafios da API TMDB

### CORS e Autenticacao

A API TMDB aceita autenticacao via `api_key` (query param, v3) ou `Authorization: Bearer` (header, v4). Optei pelo header Bearer no interceptor do `AxiosHttpClient` - mais seguro (nao aparece na URL) e compativel com ambas as credenciais.

### Endpoints de Video

`/movie/{id}/videos` e `/tv/{id}/videos` sao endpoints distintos. O `mediaType` da entidade precisa ser propagado desde o `Movie` (via `normalizeTvShow`) ate o `useMovieDetails` hook para evitar 404s em series.

### Rate Limiting

A API TMDB tem rate limit generoso para desenvolvimento (~40 requests/10s), mas o debounce na busca e o cache do TanStack Query (staleTime) reduzem drasticamente o numero de requests em uso real.

### Imagens

URLs de imagem seguem o padrao `https://image.tmdb.org/t/p/{size}/{path}`. Tamanhos usados:
- `w185` - poster pequeno (cards da watchlist)
- `w342` - poster medio (hover card)
- `w500` - poster grande (modal de detalhes)
- `original` - backdrop (hero, modal background)

---

## Tratamento de Erros

- **`ErrorBoundary`** (class component - unico caso onde class component e obrigatorio em React) envolve o conteudo principal em `_auth.tsx`. Qualquer erro nao tratado em renders filhos exibe UI de fallback com botao de retry.
- **Estados de erro nos hooks**: `isError` + `refetch` expostos pelo TanStack Query. `BrowsePage` exibe mensagem amigavel com botao "Tentar novamente".
- **Toast de confirmacao**: `sonner` notifica o usuario em acoes de watchlist (adicionar/remover). Uma unica instancia de `<Toaster>` em `__root.tsx` - multiplas instancias causam toasts duplicados.

---

## Performance

### React.memo no MovieCard

`MovieCard` e envolvido em `React.memo`. Sem isso, ao carregar uma nova pagina no scroll infinito, todos os cards existentes re-renderizariam junto com os novos - O(n) re-renders onde so O(novos) sao necessarios.

`memo` funciona aqui porque:
1. O objeto `movie` e estavel entre renders (TanStack Query usa structural sharing - reutiliza referencias de objetos inalterados)
2. `rank` e um numero primitivo
3. Callbacks internos (`handleCardEnter`, `handleCardLeave`) ja sao estabilizados com `useCallback`

### useMemo e useCallback no BrowsePage

```ts
const movies = useMemo(() => data?.pages.flatMap((p) => p.results) ?? [], [data])
```

`.flatMap()` sobre todas as paginas e O(n) e criaria um novo array a cada render do componente pai. Com `useMemo`, so recomputa quando `data` muda (nova pagina carregada ou filtro alterado).

Os handlers de filtro (`handleSelectGenre`, `handleSelectSort`, etc.) sao estabilizados com `useCallback` - garante que a referencia de `closeAll` (tambem `useCallback`) nao cause re-criacao em cascata.

---

## Animacoes: Framer Motion

- **Hero**: `scale(1.05) → scale(1)` + `opacity: 0 → 1` na imagem de fundo
- **Hover Card**: aparece com delay de 500ms apos hover no card, desaparece imediatamente
- **Modal de detalhes**: slide-up + fade-in via `AnimatePresence`
- **Carrosséis**: os carrosséis horizontais usam scroll nativo com `scrollbar-hide`
- **Mobile nav**: animacao de altura (`height: 0 → auto`) no menu hamburguer

Todas as animacoes respeitam `prefers-reduced-motion` via configuracao global do Framer Motion.

---

## Testes

Estrategia focada em **comportamento**, nao em implementacao:

| Arquivo | O que testa |
|---|---|
| `loginSchema.test.ts` | Validacoes Zod: email invalido, senha curta, campos vazios |
| `authStore.test.ts` | Login, logout, token unico, estado inicial |
| `LoginForm.test.tsx` | Render, erros de validacao, autenticacao com credenciais validas |
| `useDebounce.test.ts` | Delay respeitado, reset do timer em mudancas rapidas |
| `useMovies.test.tsx` | Filtros, estado de loading, tratamento de erros da API |
| `watchlistStore.test.ts` | addMovie, removeMovie, isInWatchlist, deduplicacao |
| `useWatchlist.test.ts` | toggleMovie (add/remove), toast de confirmacao |
| `WatchlistPage.test.tsx` | Render vazio, render com filmes, sorting, remocao |

**O que optei por não testar:** componentes puramente visuais sem logica (MovieSkeleton, AppFooter), mocks de responses triviais, detalhes de implementacao CSS.
