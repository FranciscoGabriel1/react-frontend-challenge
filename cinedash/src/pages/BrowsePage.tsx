import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MovieCard } from '@/features/movies/components/MovieCard'
import { MovieSkeleton } from '@/features/movies/components/MovieSkeleton'
import { useMovies } from '@/features/movies/hooks/useMovies'
import { useTvShows } from '@/features/movies/hooks/useTvShows'
import { useGenres } from '@/features/movies/hooks/useGenres'
import { useTvGenres } from '@/features/movies/hooks/useTvGenres'

interface BrowsePageProps {
  mediaType: 'movie' | 'tv'
}

const SORT_OPTIONS = [
  { label: 'Popularidade', value: 'popularity.desc' },
  { label: 'Lancamento', value: 'release_date.desc' },
  { label: 'Avaliacao', value: 'vote_average.desc' },
  { label: 'A-Z', value: 'title.asc' },
] as const

const SKELETON_COUNT = 20

const BrowsePage = ({ mediaType }: BrowsePageProps) => {
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>()
  const [selectedGenreName, setSelectedGenreName] = useState<string>('Generos')
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [sortLabel, setSortLabel] = useState('Popularidade')
  const [page, setPage] = useState(1)
  const [genreOpen, setGenreOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const movieResult = useMovies(
    mediaType === 'movie' ? { genre: selectedGenre, page, sortBy } : { page: 0 },
  )
  const tvResult = useTvShows(
    mediaType === 'tv' ? { genre: selectedGenre, page, sortBy } : {},
  )

  const { data, isLoading } = mediaType === 'movie' ? movieResult : tvResult

  const { data: movieGenres } = useGenres()
  const { data: tvGenreData } = useTvGenres()
  const genreList =
    mediaType === 'movie' ? movieGenres?.genres : tvGenreData?.genres

  const totalPages = data?.total_pages ?? 1

  const handleSelectGenre = (id: number | undefined, name: string) => {
    setSelectedGenre(id)
    setSelectedGenreName(name)
    setPage(1)
    setGenreOpen(false)
  }

  const handleSelectSort = (value: string, label: string) => {
    setSortBy(value)
    setSortLabel(label)
    setPage(1)
    setSortOpen(false)
  }

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            onClick={() => { setGenreOpen((o) => !o); setSortOpen(false) }}
            className="flex items-center gap-2 rounded-md border border-border/60 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-border"
          >
            {selectedGenreName}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${genreOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          <AnimatePresence>
            {genreOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-30 mt-1 max-h-72 w-48 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-xl"
              >
                <button
                  onClick={() => handleSelectGenre(undefined, 'Generos')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  Todos
                  {selectedGenre === undefined && <Check className="h-4 w-4" aria-hidden="true" />}
                </button>
                {genreList?.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleSelectGenre(g.id, g.name)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    {g.name}
                    {selectedGenre === g.id && <Check className="h-4 w-4" aria-hidden="true" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => { setSortOpen((o) => !o); setGenreOpen(false) }}
            className="flex items-center gap-2 rounded-md border border-border/60 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-border"
          >
            {sortLabel}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectSort(opt.value, opt.label)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    {opt.label}
                    {sortBy === opt.value && <Check className="h-4 w-4" aria-hidden="true" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <MovieSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          key={`${selectedGenre}-${sortBy}-${page}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
        >
          {data?.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-border/60 px-5 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-sm text-muted-foreground">
            {page} / {Math.min(totalPages, 500)}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-full border border-border/60 px-5 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            Proximo
          </button>
        </div>
      )}
    </main>
  )
}

export { BrowsePage }
