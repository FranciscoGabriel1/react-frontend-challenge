import { Play, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { useTrending } from '../hooks/useTrending'
import { getBackdropUrl, formatYear, formatRating } from '../utils'

const MovieHeroSkeleton = () => (
  <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden" aria-hidden="true">
    <Skeleton className="h-full w-full rounded-none" />
  </div>
)

const MovieHero = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useTrending()
  const featured = data?.results?.[0]

  if (isLoading) return <MovieHeroSkeleton />
  if (!featured) return null

  const backdropUrl = getBackdropUrl(featured.backdrop_path)
  const year = formatYear(featured.release_date)
  const rating = formatRating(featured.vote_average)

  return (
    <section
      className="relative h-[62vh] min-h-[420px] w-full overflow-hidden"
      aria-label={`Destaque: ${featured.title}`}
    >
      {backdropUrl && (
        <motion.img
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />

      <motion.div
        className="absolute bottom-0 left-0 right-0 px-6 pb-12 sm:px-10 sm:pb-16 lg:px-16 lg:max-w-3xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      >
        <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
          {year && <span>{year}</span>}
          {featured.vote_average > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              {rating}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {featured.title}
        </h1>

        {featured.overview && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground sm:text-base">
            {featured.overview}
          </p>
        )}

        <div className="mt-6">
          <Button
            className="h-11 rounded-full px-6 gap-2"
            onClick={() =>
              void navigate({
                to: '/movie/$id',
                params: { id: String(featured.id) },
                search: featured.mediaType === 'tv' ? { t: 'tv' as const } : {},
                resetScroll: false,
              })
            }
          >
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            Explorar
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

export { MovieHero }
