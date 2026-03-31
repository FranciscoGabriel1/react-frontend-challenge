import { useSearch } from '@tanstack/react-router'
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
  const { q } = useSearch({ strict: false }) as { q?: string }
  const searchQuery = q ?? ''

  const { data: trending, isLoading: trendingLoading } = useTrending()
  const { data: popular, isLoading: popularLoading } = useMovies({})

  const isSearchMode = searchQuery.length >= SEARCH_MIN_LENGTH

  return (
    <>
      {!isSearchMode && <MovieHero />}

      <main className="w-full pb-16">
        <AnimatePresence mode="wait">
          {isSearchMode ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="px-6 pt-8 sm:px-10 lg:px-16"
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
              className="flex flex-col gap-10 pt-8"
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
