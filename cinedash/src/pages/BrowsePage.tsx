import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ChevronDown, Check, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/ui/button'
import { MovieCard } from '@/features/movies/components/MovieCard'
import { MovieSkeleton } from '@/features/movies/components/MovieSkeleton'
import { useInfiniteMovies } from '@/features/movies/hooks/useInfiniteMovies'
import { useInfiniteTvShows } from '@/features/movies/hooks/useInfiniteTvShows'
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

const RATING_OPTIONS = [
  { label: 'Qualquer nota', value: undefined },
  { label: '6+', value: 6 },
  { label: '7+', value: 7 },
  { label: '8+', value: 8 },
  { label: '9+', value: 9 },
] as const

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = [
  { label: 'Qualquer ano', value: undefined },
  ...Array.from({ length: 12 }, (_, i) => {
    const year = CURRENT_YEAR - i
    return { label: String(year), value: year }
  }),
] as const

const SKELETON_COUNT = 20

const BrowsePage = ({ mediaType }: BrowsePageProps) => {
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>()
  const [selectedGenreName, setSelectedGenreName] = useState<string>('Generos')
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [sortLabel, setSortLabel] = useState('Popularidade')
  const [selectedYear, setSelectedYear] = useState<number | undefined>()
  const [selectedYearLabel, setSelectedYearLabel] = useState('Qualquer ano')
  const [selectedRating, setSelectedRating] = useState<number | undefined>()
  const [selectedRatingLabel, setSelectedRatingLabel] = useState('Qualquer nota')
  const [genreOpen, setGenreOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [yearOpen, setYearOpen] = useState(false)
  const [ratingOpen, setRatingOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const closeAll = useCallback(() => { setGenreOpen(false); setSortOpen(false); setYearOpen(false); setRatingOpen(false) }, [])

  const filters = { genre: selectedGenre, sortBy, year: selectedYear, minRating: selectedRating }

  const movieResult = useInfiniteMovies(filters, mediaType === 'movie')
  const tvResult = useInfiniteTvShows(filters, mediaType === 'tv')

  const { data, isLoading, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    mediaType === 'movie' ? movieResult : tvResult

  const movies = useMemo(() => data?.pages.flatMap((p) => p.results) ?? [], [data])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '300px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const { data: movieGenres } = useGenres()
  const { data: tvGenreData } = useTvGenres()
  const genreList = mediaType === 'movie' ? movieGenres?.genres : tvGenreData?.genres

  const handleSelectGenre = useCallback((id: number | undefined, name: string) => {
    setSelectedGenre(id); setSelectedGenreName(name); closeAll()
  }, [closeAll])
  const handleSelectSort = useCallback((value: string, label: string) => {
    setSortBy(value); setSortLabel(label); closeAll()
  }, [closeAll])
  const handleSelectYear = useCallback((value: number | undefined, label: string) => {
    setSelectedYear(value); setSelectedYearLabel(label); closeAll()
  }, [closeAll])
  const handleSelectRating = useCallback((value: number | undefined, label: string) => {
    setSelectedRating(value); setSelectedRatingLabel(label); closeAll()
  }, [closeAll])

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            onClick={() => { closeAll(); setGenreOpen((o) => !o) }}
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
            onClick={() => { closeAll(); setSortOpen((o) => !o) }}
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

        {mediaType === 'movie' && (
          <div className="relative">
            <button
              onClick={() => { closeAll(); setYearOpen((o) => !o) }}
              className="flex items-center gap-2 rounded-md border border-border/60 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-border"
            >
              {selectedYearLabel}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${yearOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence>
              {yearOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-30 mt-1 max-h-64 w-36 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-xl"
                >
                  {YEAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value ?? 'all'}
                      onClick={() => handleSelectYear(opt.value, opt.label)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      {opt.label}
                      {selectedYear === opt.value && <Check className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => { closeAll(); setRatingOpen((o) => !o) }}
            className="flex items-center gap-2 rounded-md border border-border/60 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-border"
          >
            {selectedRatingLabel}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${ratingOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          <AnimatePresence>
            {ratingOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full z-30 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl"
              >
                {RATING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value ?? 'all'}
                    onClick={() => handleSelectRating(opt.value, opt.label)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    {opt.label}
                    {selectedRating === opt.value && <Check className="h-4 w-4" aria-hidden="true" />}
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
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
          <div>
            <p className="font-semibold">Erro ao carregar</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nao foi possivel buscar o conteudo. Verifique sua conexao.
            </p>
          </div>
          <Button onClick={() => void refetch()} variant="outline" className="rounded-full">
            Tentar novamente
          </Button>
        </div>
      ) : (
        <>
          <motion.div
            key={`${selectedGenre}-${sortBy}-${selectedYear}-${selectedRating}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </motion.div>

          <div ref={sentinelRef} className="h-px" aria-hidden="true" />

          {isFetchingNextPage && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
            </div>
          )}
        </>
      )}
    </main>
  )
}

export { BrowsePage }
