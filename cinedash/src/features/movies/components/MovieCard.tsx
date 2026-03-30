import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Film, Star } from 'lucide-react'
import type { Movie } from '../types'
import { getPosterUrl, formatYear, formatRating } from '../utils'

interface MovieCardProps {
  movie: Movie
  rank?: number
}

const MovieCard = ({ movie, rank }: MovieCardProps) => {
  const navigate = useNavigate()
  const posterUrl = getPosterUrl(movie.poster_path)
  const year = formatYear(movie.release_date)
  const rating = formatRating(movie.vote_average)

  return (
    <motion.button
      onClick={() => void navigate({ to: '/movie/$id', params: { id: String(movie.id) } })}
      whileHover={{ scale: 1.06, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="relative flex flex-col gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl w-full"
      style={{ originX: 0.5, originY: 0.5 }}
      aria-label={`Ver detalhes de ${movie.title}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Film className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          </div>
        )}

        {rank !== undefined && (
          <span
            className="absolute bottom-0 left-1 text-7xl font-black leading-none text-white/15 select-none pointer-events-none"
            aria-hidden="true"
          >
            {rank}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
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
      </div>
    </motion.button>
  )
}

export { MovieCard }
