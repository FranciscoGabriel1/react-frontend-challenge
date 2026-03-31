import { memo, useRef, useState, useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { Film, Star } from 'lucide-react'
import type { Movie } from '../types'
import { getPosterUrl, formatYear, formatRating } from '../utils'
import { movieKeys } from '../hooks/queryKeys'
import { movieService } from '../services/movieService'
import { MovieHoverCard } from './MovieHoverCard'
import { Card, CardContent } from '@/shared/ui/card'

interface MovieCardProps {
  movie: Movie
  rank?: number
}

const SHOW_DELAY_MS = 500
const HIDE_DELAY_MS = 150

const MovieCard = memo(({ movie, rank }: MovieCardProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const cardRef = useRef<HTMLDivElement>(null)
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

  const posterUrl = getPosterUrl(movie.poster_path)
  const year = formatYear(movie.release_date)
  const rating = formatRating(movie.vote_average)

  const isShowingRef = useRef(false)

  useEffect(() => {
    isShowingRef.current = anchorRect !== null
  }, [anchorRect])

  const clearAllTimers = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
  }, [])

  const startHideTimer = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current)
    hideTimerRef.current = setTimeout(() => setAnchorRect(null), HIDE_DELAY_MS)
  }, [])

  const cancelHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
  }, [])

  const handleCardEnter = useCallback(() => {
    cancelHideTimer()
    const mediaType = movie.mediaType ?? 'movie'
    void queryClient.prefetchQuery({
      queryKey: movieKeys.videos(movie.id, mediaType),
      queryFn: () => movieService.getVideos(movie.id, mediaType),
      staleTime: 5 * 60 * 1000,
    })
    showTimerRef.current = setTimeout(() => {
      if (cardRef.current) {
        setAnchorRect(cardRef.current.getBoundingClientRect())
      }
    }, SHOW_DELAY_MS)
  }, [movie.id, movie.mediaType, queryClient, cancelHideTimer])

  const handleCardLeave = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current)
    startHideTimer()
  }, [startHideTimer])

  useEffect(() => {
    const onScroll = () => {
      if (!isShowingRef.current || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      if (rect.bottom < 60 || rect.top > window.innerHeight - 60) {
        setAnchorRect(null)
        return
      }
      setAnchorRect(rect)
    }
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => {
      clearAllTimers()
      window.removeEventListener('scroll', onScroll, { capture: true })
    }
  }, [clearAllTimers])

  return (
    <>
      <Card
        ref={cardRef}
        className="relative w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow hover:shadow-lg hover:shadow-black/50"
        onMouseEnter={handleCardEnter}
        onMouseLeave={handleCardLeave}
        onClick={() =>
          void navigate({
            to: '/movie/$id',
            params: { id: String(movie.id) },
            search: movie.mediaType === 'tv' ? { t: 'tv' as const } : {},
          })
        }
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            void navigate({
              to: '/movie/$id',
              params: { id: String(movie.id) },
              search: movie.mediaType === 'tv' ? { t: 'tv' as const } : {},
            })
          }
        }}
        aria-label={`Ver detalhes de ${movie.title}`}
      >
        <div className={`relative${rank !== undefined ? ' pb-6' : ''}`}>
          <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl bg-muted">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Film className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              </div>
            )}
            {rank !== undefined && (
              <div
                className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"
                aria-hidden="true"
              />
            )}
          </div>

          {rank !== undefined && (
            <span
              className="absolute -bottom-1 left-0.5 select-none text-[5.5rem] font-black italic leading-none pointer-events-none z-10"
              style={{
                WebkitTextStroke: '2px rgba(255,255,255,0.85)',
                color: 'transparent',
                filter: 'drop-shadow(0 2px 12px rgba(0,0,0,1))',
              }}
              aria-hidden="true"
            >
              {rank}
            </span>
          )}
        </div>

        <CardContent>
          <p className="truncate text-sm font-medium">{movie.title}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {year && <span>{year}</span>}
            {movie.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                {rating}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {anchorRect && (
          <MovieHoverCard
            movie={movie}
            anchorRect={anchorRect}
            onMouseEnter={cancelHideTimer}
            onMouseLeave={startHideTimer}
          />
        )}
      </AnimatePresence>
    </>
  )
})

export { MovieCard }
