import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, Star, Clock, Bookmark, BookmarkCheck, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/shared/ui/skeleton'
import { Button } from '@/shared/ui/button'
import { useMovieDetails } from '@/features/movies/hooks/useMovieDetails'
import { useWatchlist } from '@/features/watchlist/hooks/useWatchlist'
import { getPosterUrl, getBackdropUrl, formatYear, formatRating } from '@/features/movies/utils'

const MovieDetailSkeleton = () => (
  <div>
    <Skeleton className="h-[50vh] min-h-[320px] w-full rounded-none" />
    <div className="mx-auto max-w-screen-2xl px-4 pt-6 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <Skeleton className="h-48 w-32 shrink-0 rounded-xl sm:h-64 sm:w-44" />
        <div className="flex flex-col gap-3 pt-2">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-8 w-72 rounded" />
          <Skeleton className="h-4 w-52 rounded" />
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
      </div>
      <Skeleton className="mt-10 h-24 w-full max-w-3xl rounded-lg" />
    </div>
  </div>
)

const MovieDetailPage = () => {
  const { id } = useParams({ from: '/_auth/movie/$id' })
  const navigate = useNavigate()
  const movieId = Number(id)

  const { movie, cast, trailer, isLoading, isError, error } = useMovieDetails(movieId)
  const { toggleMovie, isInWatchlist } = useWatchlist()

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      void navigate({ to: '/dashboard' })
    }
  }

  if (isLoading) return <MovieDetailSkeleton />

  if (isError || !movie) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg font-semibold">Filme nao encontrado</p>
        <p className="text-sm text-muted-foreground">{error?.message}</p>
        <Button onClick={() => void navigate({ to: '/dashboard' })} className="rounded-full">
          Voltar ao Dashboard
        </Button>
      </div>
    )
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path)
  const posterUrl = getPosterUrl(movie.poster_path, 'w500')
  const year = formatYear(movie.release_date)
  const rating = formatRating(movie.vote_average)
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null
  const inWatchlist = isInWatchlist(movie.id)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <button
          onClick={handleBack}
          className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/60 px-4 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-background/80 sm:left-6 sm:top-6"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar
        </button>
      </div>

      <main className="mx-auto max-w-screen-2xl px-4 pb-16 sm:px-6">
        <div className="-mt-20 flex flex-col gap-6 sm:-mt-24 sm:flex-row sm:items-end sm:gap-8">
          {posterUrl && (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-32 shrink-0 rounded-xl shadow-2xl sm:w-44"
            />
          )}

          <div className="flex flex-col gap-4 pb-2">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {year && <span>{year}</span>}
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {runtime}
                </span>
              )}
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  {rating}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-sm italic text-muted-foreground">{movie.tagline}</p>
            )}

            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <Button
              onClick={() => toggleMovie(movie)}
              variant={inWatchlist ? 'secondary' : 'default'}
              className="w-fit rounded-full gap-2"
            >
              {inWatchlist ? (
                <>
                  <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
                  Na Watchlist
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" aria-hidden="true" />
                  Adicionar
                </>
              )}
            </Button>
          </div>
        </div>

        {movie.overview && (
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-semibold">Sinopse</h2>
            <p className="max-w-3xl leading-relaxed text-muted-foreground">{movie.overview}</p>
          </section>
        )}

        {cast.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">Elenco Principal</h2>
            <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
              {cast.map((member) => (
                <div key={member.id} className="flex w-20 shrink-0 flex-col items-center gap-2">
                  {member.profile_path ? (
                    <img
                      src={getPosterUrl(member.profile_path, 'w185') ?? ''}
                      alt={member.name}
                      className="h-20 w-20 rounded-full object-cover bg-muted"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <User className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs font-medium leading-tight">{member.name}</p>
                    <p className="text-xs leading-tight text-muted-foreground">{member.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {trailer && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">Trailer</h2>
            <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${movie.title} - Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>
        )}
      </main>
    </motion.div>
  )
}

export { MovieDetailPage }
