import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2, Film } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/button'
import { useWatchlist } from '@/features/watchlist/hooks/useWatchlist'
import { useGenres } from '@/features/movies/hooks/useGenres'
import { getPosterUrl, formatYear, formatRating } from '@/features/movies/utils'
import type { Movie } from '@/features/movies/types'

const columnHelper = createColumnHelper<Movie>()

const WatchlistPage = () => {
  const navigate = useNavigate()
  const { movies, toggleMovie } = useWatchlist()
  const { data: genreData } = useGenres()
  const [sorting, setSorting] = useState<SortingState>([])

  const genreMap = useMemo(
    () => new Map(genreData?.genres.map((g) => [g.id, g.name]) ?? []),
    [genreData],
  )

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'poster',
        header: '',
        cell: ({ row }) => {
          const url = getPosterUrl(row.original.poster_path, 'w185')
          return url ? (
            <img
              src={url}
              alt={row.original.title}
              className="h-14 w-10 rounded object-cover"
            />
          ) : (
            <div className="flex h-14 w-10 items-center justify-center rounded bg-muted">
              <Film className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </div>
          )
        },
      }),
      columnHelper.accessor('title', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Titulo
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <button
            onClick={() =>
              void navigate({
                to: '/movie/$id',
                params: { id: String(row.original.id) },
                search: row.original.mediaType === 'tv' ? { t: 'tv' as const } : {},
              })
            }
            className="text-left font-medium hover:underline max-w-[180px] truncate block"
          >
            {row.original.title}
          </button>
        ),
      }),
      columnHelper.accessor(
        (row) => genreMap.get(row.genre_ids?.[0]) ?? '',
        {
          id: 'genre',
          header: ({ column }) => (
            <button
              className="flex items-center gap-1 font-semibold hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Genero
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
              )}
            </button>
          ),
          cell: ({ getValue }) => (
            <span className="text-sm text-muted-foreground">{getValue() || '-'}</span>
          ),
        },
      ),
      columnHelper.accessor('release_date', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Lancamento
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
            )}
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">{formatYear(getValue())}</span>
        ),
      }),
      columnHelper.accessor('vote_average', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Rating
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
            )}
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm font-medium">{formatRating(getValue())}</span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span className="font-semibold">Acoes</span>,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleMovie(row.original)}
            aria-label={`Remover ${row.original.title} da watchlist`}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        ),
      }),
    ],
    [genreMap, navigate, toggleMovie],
  )

  const table = useReactTable({
    data: movies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <motion.main
      className="mx-auto w-full max-w-screen-lg px-4 py-8 sm:px-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Minha Watchlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {movies.length === 0
            ? 'Nenhum filme adicionado ainda.'
            : `${movies.length} ${movies.length === 1 ? 'filme' : 'filmes'}`}
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/50 bg-card py-20 text-center">
          <Film className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-semibold">Sua watchlist esta vazia</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Adicione filmes pelo dashboard para acompanhar aqui.
            </p>
          </div>
          <Button
            onClick={() => void navigate({ to: '/dashboard' })}
            className="rounded-full"
          >
            Explorar filmes
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/50">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-border/50 bg-muted/40 text-muted-foreground"
                >
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  className="border-b border-border/30 transition-colors last:border-0 hover:bg-muted/30"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.main>
  )
}

export { WatchlistPage }
