import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMovieSearch } from '../useMovieSearch'
import { movieService } from '../../services/movieService'

vi.mock('@/shared/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}))

vi.mock('../../services/movieService', () => ({
  movieService: {
    search: vi.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return Wrapper
}

const mockSearchResponse = {
  page: 1,
  total_pages: 1,
  total_results: 1,
  results: [
    {
      id: 1,
      title: 'Up',
      overview: 'Adventure',
      poster_path: '/up.jpg',
      backdrop_path: '/up-bg.jpg',
      release_date: '2009-05-29',
      vote_average: 8.3,
      vote_count: 1000,
      genre_ids: [16],
      popularity: 99,
    },
  ],
}

describe('useMovieSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('executes searches with exactly two characters', async () => {
    vi.mocked(movieService.search).mockResolvedValue(mockSearchResponse)

    const { result } = renderHook(() => useMovieSearch('Up'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(movieService.search).toHaveBeenCalledWith('Up')
    expect(result.current.data).toEqual(mockSearchResponse)
  })

  it('does not execute searches below the minimum length', () => {
    renderHook(() => useMovieSearch('U'), {
      wrapper: createWrapper(),
    })

    expect(movieService.search).not.toHaveBeenCalled()
  })
})
