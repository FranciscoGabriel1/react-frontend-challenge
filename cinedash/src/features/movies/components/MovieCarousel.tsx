import { useRef, useState, useEffect } from 'react'
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
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setIsAtStart(el.scrollLeft <= 0)
    setIsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }

  useEffect(() => {
    updateScrollState()
  }, [movies, isLoading])

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: 'smooth',
    })
  }

  const leftVisible = !isAtStart
  const rightVisible = !isAtEnd

  return (
    <section className="group/carousel">
      <h2 className="mb-3 pl-6 text-lg font-semibold tracking-tight sm:pl-10 lg:pl-16">
        {title}
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-0 z-20 flex h-full w-14 items-center justify-center bg-gradient-to-r from-background/95 to-transparent transition-opacity duration-200 ${
            leftVisible
              ? 'opacity-0 group-hover/carousel:opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
          aria-label={`${title} - rolar para esquerda`}
          aria-hidden={!leftVisible}
        >
          <ChevronLeft className="h-6 w-6 drop-shadow-lg" />
        </button>

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="-my-4 overflow-x-auto scrollbar-hide py-4"
        >
          {isLoading ? (
            <div className="flex gap-3 pl-6 sm:pl-10 lg:pl-16">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="w-[148px] shrink-0 sm:w-[164px] md:w-[180px]">
                  <MovieSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="flex gap-3 pl-6 sm:pl-10 lg:pl-16"
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
          className={`absolute right-0 top-0 z-20 flex h-full w-14 items-center justify-center bg-gradient-to-l from-background/95 to-transparent transition-opacity duration-200 ${
            rightVisible
              ? 'opacity-0 group-hover/carousel:opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
          aria-label={`${title} - rolar para direita`}
          aria-hidden={!rightVisible}
        >
          <ChevronRight className="h-6 w-6 drop-shadow-lg" />
        </button>
      </div>
    </section>
  )
}

export { MovieCarousel }
