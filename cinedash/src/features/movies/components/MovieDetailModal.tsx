import { useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { X, Star, Clock, Bookmark, BookmarkCheck, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/shared/ui/skeleton'
import { Button } from '@/shared/ui/button'
import { useMovieDetails } from '../hooks/useMovieDetails'
import { useWatchlist } from '@/features/watchlist/hooks/useWatchlist'
import { getPosterUrl, getBackdropUrl, formatYear, formatRating } from '../utils'

interface MovieDetailModalProps {
  id: number
  mediaType?: 'movie' | 'tv'
}

const MovieDetailModal = ({ id, mediaType = 'movie' }: MovieDetailModalProps) => {
  const navigate = useNavigate()
  const { movie, cast, trailer, isLoading, isError } = useMovieDetails(id, mediaType)
  const { toggleMovie, isInWatchlist } = useWatchlist()

  const handleClose = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      void navigate({ to: '/dashboard' })
    }
  }, [navigate])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const inWatchlist = movie ? isInWatchlist(movie.id) : false
  const backdropUrl = movie ? getBackdropUrl(movie.backdrop_path) : null
  const posterUrl = movie ? getPosterUrl(movie.poster_path, 'w500') : null
  const year = movie ? formatYear(movie.release_date) : null
  const rating = movie ? formatRating(movie.vote_average) : null
  const runtime = movie?.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative mx-auto my-6 max-w-2xl px-4 pb-8 sm:my-10">
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-card shadow-2xl"
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 48, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          {isLoading ? (
            <div>
              <Skeleton className="h-[38vh] w-full rounded-none" />
              <div className="p-6 flex flex-col gap-3">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="mt-2 h-24 w-full" />
              </div>
            </div>
          ) : isError || !movie ? (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-20">
              <p className="text-lg font-semibold">Filme nao encontrado</p>
              <Button onClick={handleClose} className="rounded-full">
                Fechar
              </Button>
            </div>
          ) : (
            <>
              <div className="relative h-[38vh] min-h-[240px] overflow-hidden">
                {backdropUrl && (
                  <img
                    src={backdropUrl}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              </div>

              <div className="px-5 pb-8 sm:px-7">
                <div className="-mt-14 flex gap-4 sm:gap-5">
                  {posterUrl && (
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      className="w-20 shrink-0 rounded-xl shadow-2xl sm:w-28"
                    />
                  )}
                  <div className="flex flex-col justify-end gap-2 pb-1">
                    <h2 className="text-xl font-bold leading-tight sm:text-2xl">{movie.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                      {year && <span>{year}</span>}
                      {runtime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {runtime}
                        </span>
                      )}
                      {movie.vote_average > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                          {rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {movie.genres.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
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

                {movie.tagline && (
                  <p className="mt-3 text-sm italic text-muted-foreground">{movie.tagline}</p>
                )}

                <Button
                  onClick={() => toggleMovie(movie)}
                  variant={inWatchlist ? 'secondary' : 'default'}
                  className="mt-4 w-fit rounded-full gap-2"
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

                {movie.overview && (
                  <section className="mt-6">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sinopse
                    </h3>
                    <p className="text-sm leading-relaxed">{movie.overview}</p>
                  </section>
                )}

                {cast.length > 0 && (
                  <section className="mt-6">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Elenco Principal
                    </h3>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
                      {cast.map((member) => (
                        <div
                          key={member.id}
                          className="flex w-14 shrink-0 flex-col items-center gap-1.5"
                        >
                          {member.profile_path ? (
                            <img
                              src={getPosterUrl(member.profile_path, 'w185') ?? ''}
                              alt={member.name}
                              className="h-14 w-14 rounded-full object-cover bg-muted"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                              <User className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                            </div>
                          )}
                          <div className="text-center">
                            <p className="text-xs font-medium leading-tight">{member.name}</p>
                            <p className="text-xs leading-tight text-muted-foreground">
                              {member.character}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {trailer && (
                  <section className="mt-6">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Trailer
                    </h3>
                    <div className="aspect-video overflow-hidden rounded-xl">
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
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export { MovieDetailModal }
