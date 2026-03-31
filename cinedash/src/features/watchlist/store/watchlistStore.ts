import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movie } from '@/features/movies/types'

interface WatchlistState {
  movies: Movie[]
  addMovie: (movie: Movie) => void
  removeMovie: (id: number) => void
  isInWatchlist: (id: number) => boolean
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      movies: [],
      addMovie: (movie) =>
        set((state) => ({
          movies: state.movies.some((m) => m.id === movie.id)
            ? state.movies
            : [...state.movies, movie],
        })),
      removeMovie: (id) =>
        set((state) => ({
          movies: state.movies.filter((m) => m.id !== id),
        })),
      isInWatchlist: (id) => get().movies.some((m) => m.id === id),
    }),
    { name: 'cinedash-watchlist' },
  ),
)
