import { createPortal } from 'react-dom'
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Play, Plus, Check, ThumbsUp, ChevronDown, VolumeX, Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Movie } from '../types'
import { useWatchlist } from '@/features/watchlist/hooks/useWatchlist'
import { getBackdropUrl, formatYear, formatRating } from '../utils'
import { movieKeys } from '../hooks/queryKeys'
import { movieService } from '../services/movieService'

const HOVER_CARD_WIDTH = 320
const HOVER_CARD_MARGIN = 16

interface HoverCardPosition {
  top: number
  left: number
  transformOriginX: string
}

const getPosition = (rect: DOMRect): HoverCardPosition => {
  const idealLeft = rect.left - (HOVER_CARD_WIDTH - rect.width) / 2
  let left = idealLeft
  let transformOriginX = 'center'

  if (idealLeft < HOVER_CARD_MARGIN) {
    left = HOVER_CARD_MARGIN
    transformOriginX = 'left'
  } else if (idealLeft + HOVER_CARD_WIDTH > window.innerWidth - HOVER_CARD_MARGIN) {
    left = window.innerWidth - HOVER_CARD_WIDTH - HOVER_CARD_MARGIN
    transformOriginX = 'right'
  }

  return { top: rect.top - 12, left, transformOriginX }
}

interface MovieHoverCardProps {
  movie: Movie
  anchorRect: DOMRect
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const MovieHoverCard = ({
  movie,
  anchorRect,
  onMouseEnter,
  onMouseLeave,
}: MovieHoverCardProps) => {
  const navigate = useNavigate()
  const { toggleMovie, isInWatchlist } = useWatchlist()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const inWatchlist = isInWatchlist(movie.id)

  const mediaType = movie.mediaType ?? 'movie'
  const { data: videosData } = useQuery({
    queryKey: movieKeys.videos(movie.id, mediaType),
    queryFn: () => movieService.getVideos(movie.id, mediaType),
    staleTime: 5 * 60 * 1000,
  })

  const trailer = videosData?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube',
  )

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'w780')
  const { top, left, transformOriginX } = getPosition(anchorRect)

  const previewUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${trailer.key}`
    : null

  const sendPlayerCommand = (func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*',
    )
  }

  useEffect(() => {
    if (!previewUrl) return
    const parseMessage = (raw: string): Record<string, unknown> | null => {
      try { return JSON.parse(raw) as Record<string, unknown> }
      catch { return null }
    }
    const handleMessage = (e: MessageEvent) => {
      if (typeof e.data !== 'string') return
      const data = parseMessage(e.data)
      if (data?.event === 'onReady') {
        sendPlayerCommand('playVideo')
        sendPlayerCommand('setVolume', [100])
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [previewUrl])

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newMuted = !isMuted
    setIsMuted(newMuted)
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: newMuted ? 'mute' : 'unMute', args: [] }),
      '*',
    )
  }

  return createPortal(
    <motion.div
      style={{
        position: 'fixed',
        top,
        left,
        width: HOVER_CARD_WIDTH,
        zIndex: 200,
        transformOrigin: `${transformOriginX} top`,
      }}
      initial={{ scale: 0.82, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.82, opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border/30"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative aspect-video bg-muted">
        {previewUrl ? (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="h-full w-full"
            allow="autoplay; encrypted-media"
            aria-hidden="true"
          />
        ) : backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}

        <button
          onClick={handleToggleMute}
          className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-black/60 transition-colors hover:bg-black/80"
          aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
        >
          {isMuted ? (
            <VolumeX className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                void navigate({
                to: '/movie/$id',
                params: { id: String(movie.id) },
                search: mediaType === 'tv' ? { t: 'tv' as const } : {},
              })
              }
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-white/80"
              aria-label="Assistir"
            >
              <Play className="ml-0.5 h-4 w-4 fill-black" aria-hidden="true" />
            </button>

            <button
              onClick={() => toggleMovie(movie)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition-colors hover:border-white"
              aria-label={inWatchlist ? 'Remover da watchlist' : 'Adicionar a watchlist'}
            >
              {inWatchlist ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition-colors hover:border-white"
              aria-label="Gostei"
            >
              <ThumbsUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <button
            onClick={() =>
              void navigate({
                to: '/movie/$id',
                params: { id: String(movie.id) },
                search: mediaType === 'tv' ? { t: 'tv' as const } : {},
              })
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition-colors hover:border-white"
            aria-label="Mais informacoes"
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="truncate text-sm font-bold leading-tight">{movie.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs">
          {movie.vote_average > 0 && (
            <span className="font-medium text-green-400">{formatRating(movie.vote_average)}</span>
          )}
          <span className="text-muted-foreground">{formatYear(movie.release_date)}</span>
        </div>
      </div>
    </motion.div>,
    document.body,
  )
}

export { MovieHoverCard }
