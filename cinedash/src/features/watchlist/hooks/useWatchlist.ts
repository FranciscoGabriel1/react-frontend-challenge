import { toast } from 'sonner'
import { useWatchlistStore } from '../store/watchlistStore'
import type { Movie } from '@/features/movies/types'

export const useWatchlist = () => {
  const { movies, addMovie, removeMovie, isInWatchlist } = useWatchlistStore()

  const toggleMovie = (movie: Movie) => {
    if (isInWatchlist(movie.id)) {
      removeMovie(movie.id)
      toast.success(`"${movie.title}" removido da watchlist`)
    } else {
      addMovie(movie)
      toast.success(`"${movie.title}" adicionado a watchlist`)
    }
  }

  return { movies, toggleMovie, isInWatchlist }
}
