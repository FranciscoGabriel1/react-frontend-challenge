import { Search } from 'lucide-react'
import { MovieCard } from './MovieCard'
import { MovieSkeleton } from './MovieSkeleton'
import { useMovieSearch } from '../hooks/useMovieSearch'

const SKELETON_COUNT = 10

interface SearchMovieGridProps {
  query: string
}

const SearchMovieGrid = ({ query }: SearchMovieGridProps) => {
  const { data, isLoading } = useMovieSearch(query)

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        aria-busy="true"
        aria-label="Buscando filmes"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <MovieSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!data?.results?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Search className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-lg font-semibold">Nenhum resultado</p>
        <p className="text-sm text-muted-foreground">
          Nenhum filme encontrado para &quot;{query}&quot;.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {data.results.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export { SearchMovieGrid }
