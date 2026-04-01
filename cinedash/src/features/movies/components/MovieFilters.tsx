import { Search, X } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { useGenres } from '../hooks/useGenres'
import type { MovieFilters as MovieFilterValues } from '../types'

interface MovieFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: MovieFilterValues
  onFiltersChange: (filters: MovieFilterValues) => void
}

const CURRENT_YEAR = new Date().getFullYear()
const MIN_YEAR = 1900

const MovieFilters = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: MovieFiltersProps) => {
  const { data: genresData } = useGenres()
  const genres = genresData?.genres ?? []

  const hasActiveFilters =
    Boolean(filters.genre) || Boolean(filters.year) || Boolean(filters.minRating)

  const clearFilters = () => onFiltersChange({})

  return (
    <div className="mb-8 flex flex-col gap-3">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Buscar filmes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 border-0 bg-muted pl-9 focus-visible:ring-1 focus-visible:ring-primary"
          aria-label="Buscar filmes"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.genre ?? ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              genre: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="h-9 cursor-pointer rounded-lg border-0 bg-muted px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          aria-label="Filtrar por genero"
        >
          <option value="">Todos os generos</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={MIN_YEAR}
          max={CURRENT_YEAR}
          value={filters.year ?? ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              year: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder="Ano"
          className="h-9 w-24 rounded-lg border-0 bg-muted px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          aria-label="Filtrar por ano"
        />

        <input
          type="number"
          min={0}
          max={10}
          step={0.5}
          value={filters.minRating ?? ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              minRating: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder="Nota min."
          className="h-9 w-28 rounded-lg border-0 bg-muted px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          aria-label="Nota minima"
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  )
}

export { MovieFilters }
