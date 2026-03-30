import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MovieHero } from '@/features/movies/components/MovieHero'
import { MovieCarousel } from '@/features/movies/components/MovieCarousel'
import { SearchMovieGrid } from '@/features/movies/components/SearchMovieGrid'
import { useMovies } from '@/features/movies/hooks/useMovies'
import { useTrending } from '@/features/movies/hooks/useTrending'

const SEARCH_MIN_LENGTH = 2

const FEATURED_GENRES = [
  { id: 28, name: 'Acao' },
  { id: 35, name: 'Comedia' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Terror' },
  { id: 878, name: 'Ficcao Cientifica' },
  { id: 10749, name: 'Romance' },
] as const

interface GenreCarouselProps {
  genre: { id: number; name: string }
}

const GenreCarousel = ({ genre }: GenreCarouselProps) => {
  const { data, isLoading } = useMovies({ genre: genre.id })
  return (
    <MovieCarousel
      title={genre.name}
      movies={data?.results ?? []}
      isLoading={isLoading}
    />
  )
}

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: trending, isLoading: trendingLoading } = useTrending()
  const { data: popular, isLoading: popularLoading } = useMovies({})

  const isSearchMode = searchQuery.length > SEARCH_MIN_LENGTH

  return (
    <>
      <MovieHero />

      <main className="mx-auto w-full max-w-screen-2xl px-4 pb-16 sm:px-6">
        <div className="py-6">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Buscar filmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border-0 bg-muted pl-9 pr-9 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              aria-label="Buscar filmes"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSearchMode ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="mb-6 text-lg font-semibold">
                Resultados para &quot;{searchQuery}&quot;
              </h2>
              <SearchMovieGrid query={searchQuery} />
            </motion.div>
          ) : (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-10"
            >
              <MovieCarousel
                title="Em Alta"
                movies={trending?.results?.slice(0, 10) ?? []}
                isLoading={trendingLoading}
                numbered
              />

              <MovieCarousel
                title="Populares"
                movies={popular?.results ?? []}
                isLoading={popularLoading}
              />

              {FEATURED_GENRES.map((genre) => (
                <GenreCarousel key={genre.id} genre={genre} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

export { DashboardPage }
