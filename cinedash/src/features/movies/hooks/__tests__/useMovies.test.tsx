import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useMovies } from '../useMovies'
import { movieService } from '../../services/movieService'

vi.mock('../../services/movieService', () => ({
  movieService: {
    discover: vi.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Wrapper
}

const mockMoviesResponse = {
  page: 1,
  total_pages: 10,
  total_results: 200,
  results: [
    {
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
    },
  ],
}

describe('useMovies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches movies with default filters', async () => {
    vi.mocked(movieService.discover).mockResolvedValue(mockMoviesResponse)

    const { result } = renderHook(() => useMovies(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(movieService.discover).toHaveBeenCalledWith({})
    expect(result.current.data).toEqual(mockMoviesResponse)
  })

  it('fetches movies with genre filter', async () => {
    vi.mocked(movieService.discover).mockResolvedValue(mockMoviesResponse)

    const filters = { genre: 28, page: 1 }
    const { result } = renderHook(() => useMovies(filters), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(movieService.discover).toHaveBeenCalledWith(filters)
  })

  it('returns loading state initially', () => {
    vi.mocked(movieService.discover).mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useMovies(), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(true)
  })

  it('handles service errors', async () => {
    vi.mocked(movieService.discover).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useMovies(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error?.message).toBe('API Error')
  })
})
