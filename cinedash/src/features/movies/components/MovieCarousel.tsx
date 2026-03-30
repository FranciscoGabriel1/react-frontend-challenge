import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { MovieCard } from './MovieCard'
import { MovieSkeleton } from './MovieSkeleton'
import type { Movie } from '../types'

interface MovieCarouselProps {
  title: string
  movies: Movie[]
  isLoading?: boolean
  numbered?: boolean
}

const SKELETON_COUNT = 7
const SCROLL_AMOUNT = 900

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
}

const MovieCarousel = ({ title, movies, isLoading, numbered }: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: 'smooth',
    })
  }

  return (
    <section className="group/carousel">
      <h2 className="mb-3 text-lg font-semibold tracking-tight">{title}</h2>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 z-20 flex h-full w-12 items-center justify-center bg-gradient-to-r from-background/90 to-transparent opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100"
          aria-label={`${title} - rolar para esquerda`}
        >
          <ChevronLeft className="h-6 w-6 drop-shadow-lg" />
        </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide py-4 -my-4"
        >
          {isLoading ? (
            <div className="flex gap-3">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="w-[148px] shrink-0 sm:w-[164px] md:w-[180px]">
                  <MovieSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="flex gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {movies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  variants={itemVariants}
                  className="w-[148px] shrink-0 sm:w-[164px] md:w-[180px]"
                >
                  <MovieCard
                    movie={movie}
                    rank={numbered ? index + 1 : undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 z-20 flex h-full w-12 items-center justify-center bg-gradient-to-l from-background/90 to-transparent opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100"
          aria-label={`${title} - rolar para direita`}
        >
          <ChevronRight className="h-6 w-6 drop-shadow-lg" />
        </button>
      </div>
    </section>
  )
}

export { MovieCarousel }
