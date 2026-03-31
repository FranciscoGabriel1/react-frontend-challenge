import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWatchlist } from '../useWatchlist'
import { useWatchlistStore } from '../../store/watchlistStore'
import type { Movie } from '@/features/movies/types'

vi.mock('sonner', () => ({
  toast: { success: vi.fn() },
}))

import { toast } from 'sonner'

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

beforeEach(() => {
  useWatchlistStore.setState({ movies: [] })
  vi.clearAllMocks()
})

describe('useWatchlist', () => {
  it('retorna lista vazia inicialmente', () => {
    const { result } = renderHook(() => useWatchlist())
    expect(result.current.movies).toHaveLength(0)
  })

  it('adiciona filme nao presente na watchlist', () => {
    const { result } = renderHook(() => useWatchlist())
    act(() => { result.current.toggleMovie(mockMovie) })
    expect(result.current.movies).toHaveLength(1)
    expect(result.current.movies[0].id).toBe(1)
  })

  it('exibe toast de adicao ao incluir filme', () => {
    const { result } = renderHook(() => useWatchlist())
    act(() => { result.current.toggleMovie(mockMovie) })
    expect(toast.success).toHaveBeenCalledWith('"Inception" adicionado a watchlist')
  })

  it('remove filme ja presente na watchlist', () => {
    useWatchlistStore.getState().addMovie(mockMovie)
    const { result } = renderHook(() => useWatchlist())
    act(() => { result.current.toggleMovie(mockMovie) })
    expect(result.current.movies).toHaveLength(0)
  })

  it('exibe toast de remocao ao excluir filme', () => {
    useWatchlistStore.getState().addMovie(mockMovie)
    const { result } = renderHook(() => useWatchlist())
    act(() => { result.current.toggleMovie(mockMovie) })
    expect(toast.success).toHaveBeenCalledWith('"Inception" removido da watchlist')
  })

  it('isInWatchlist reflete estado atual', () => {
    const { result } = renderHook(() => useWatchlist())
    expect(result.current.isInWatchlist(1)).toBe(false)
    act(() => { result.current.toggleMovie(mockMovie) })
    expect(result.current.isInWatchlist(1)).toBe(true)
    act(() => { result.current.toggleMovie(mockMovie) })
    expect(result.current.isInWatchlist(1)).toBe(false)
  })
})
