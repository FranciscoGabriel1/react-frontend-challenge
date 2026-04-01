import { AlertCircle, Film } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { MovieCard } from './MovieCard'
import { MovieSkeleton } from './MovieSkeleton'
import { useMovies } from '../hooks/useMovies'
import type { MovieFilters } from '../types'

const SKELETON_COUNT = 20

interface MovieGridProps {
  filters: MovieFilters
  onPageChange: (page: number) => void
}

const MovieGrid = ({ filters, onPageChange }: MovieGridProps) => {
  const { data, isLoading, isError, error } = useMovies(filters)
  const page = filters.page ?? 1

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        aria-busy="true"
        aria-label="Carregando filmes"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <MovieSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
        <p className="text-lg font-semibold">Algo deu errado</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  if (!data?.results?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Film className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-lg font-semibold">Nenhum filme encontrado</p>
        <p className="text-sm text-muted-foreground">
          Tente ajustar os filtros para ver mais resultados.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {data.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Pagina anterior"
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {page} / {Math.min(data.total_pages, 500)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= Math.min(data.total_pages, 500)}
          onClick={() => onPageChange(page + 1)}
          aria-label="Proxima pagina"
        >
          Proxima
        </Button>
      </div>
    </div>
  )
}

export { MovieGrid }
