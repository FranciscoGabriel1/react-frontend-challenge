import { describe, it, expect, beforeEach } from 'vitest'
import { useWatchlistStore } from '../watchlistStore'
import type { Movie } from '@/features/movies/types'

const mockMovie: Movie = {
  id: 1,
  title: 'Inception',
  overview: 'A mind-bending thriller.',
  poster_path: '/inception.jpg',
  backdrop_path: '/inception_backdrop.jpg',
  release_date: '2010-07-16',
  vote_average: 8.8,
  vote_count: 30000,
  genre_ids: [28, 878],
  popularity: 150.5,
}

const anotherMovie: Movie = {
  id: 2,
  title: 'Interstellar',
  overview: 'A journey through space.',
  poster_path: '/interstellar.jpg',
  backdrop_path: null,
  release_date: '2014-11-07',
  vote_average: 8.6,
  vote_count: 25000,
  genre_ids: [878],
  popularity: 130.0,
}

beforeEach(() => {
  useWatchlistStore.setState({ movies: [] })
})

describe('watchlistStore', () => {
  it('inicia com watchlist vazia', () => {
    expect(useWatchlistStore.getState().movies).toHaveLength(0)
  })

  it('adiciona um filme', () => {
    useWatchlistStore.getState().addMovie(mockMovie)
    expect(useWatchlistStore.getState().movies).toHaveLength(1)
    expect(useWatchlistStore.getState().movies[0].id).toBe(1)
  })

  it('nao adiciona filme duplicado', () => {
    useWatchlistStore.getState().addMovie(mockMovie)
    useWatchlistStore.getState().addMovie(mockMovie)
    expect(useWatchlistStore.getState().movies).toHaveLength(1)
  })

  it('adiciona multiplos filmes distintos', () => {
    useWatchlistStore.getState().addMovie(mockMovie)
    useWatchlistStore.getState().addMovie(anotherMovie)
    expect(useWatchlistStore.getState().movies).toHaveLength(2)
  })

  it('remove um filme por id', () => {
    useWatchlistStore.getState().addMovie(mockMovie)
    useWatchlistStore.getState().removeMovie(1)
    expect(useWatchlistStore.getState().movies).toHaveLength(0)
  })

  it('nao remove outros filmes ao remover por id', () => {
    useWatchlistStore.getState().addMovie(mockMovie)
    useWatchlistStore.getState().addMovie(anotherMovie)
    useWatchlistStore.getState().removeMovie(1)
    expect(useWatchlistStore.getState().movies).toHaveLength(1)
    expect(useWatchlistStore.getState().movies[0].id).toBe(2)
  })

  it('isInWatchlist retorna true para filme adicionado', () => {
    useWatchlistStore.getState().addMovie(mockMovie)
    expect(useWatchlistStore.getState().isInWatchlist(1)).toBe(true)
  })

  it('isInWatchlist retorna false para filme ausente', () => {
    expect(useWatchlistStore.getState().isInWatchlist(999)).toBe(false)
  })

  it('isInWatchlist retorna false apos remocao', () => {
    useWatchlistStore.getState().addMovie(mockMovie)
    useWatchlistStore.getState().removeMovie(1)
    expect(useWatchlistStore.getState().isInWatchlist(1)).toBe(false)
  })
})
