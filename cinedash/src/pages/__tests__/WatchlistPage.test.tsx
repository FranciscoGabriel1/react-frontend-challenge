import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WatchlistPage } from '../WatchlistPage'
import type { Movie } from '@/features/movies/types'

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return { ...actual, useNavigate: () => vi.fn() }
})

vi.mock('@/features/watchlist/hooks/useWatchlist', () => ({
  useWatchlist: vi.fn(),
}))

vi.mock('@/features/movies/hooks/useGenres', () => ({
  useGenres: () => ({ data: { genres: [{ id: 28, name: 'Acao' }] } }),
}))

import { useWatchlist } from '@/features/watchlist/hooks/useWatchlist'

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Avatar',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    release_date: '2009-12-18',
    vote_average: 7.9,
    vote_count: 20000,
    genre_ids: [28],
    popularity: 200,
  },
  {
    id: 2,
    title: 'Batman',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    release_date: '2005-06-15',
    vote_average: 8.2,
    vote_count: 15000,
    genre_ids: [28],
    popularity: 180,
  },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('WatchlistPage', () => {
  it('exibe estado vazio quando nao ha filmes', () => {
    vi.mocked(useWatchlist).mockReturnValue({
      movies: [],
      toggleMovie: vi.fn(),
      isInWatchlist: vi.fn(),
    })
    render(<WatchlistPage />)
    expect(screen.getByText('Sua watchlist esta vazia')).toBeInTheDocument()
  })

  it('exibe botao de navegar para dashboard no estado vazio', () => {
    vi.mocked(useWatchlist).mockReturnValue({
      movies: [],
      toggleMovie: vi.fn(),
      isInWatchlist: vi.fn(),
    })
    render(<WatchlistPage />)
    expect(screen.getByRole('button', { name: /explorar filmes/i })).toBeInTheDocument()
  })

  it('renderiza filmes na tabela', () => {
    vi.mocked(useWatchlist).mockReturnValue({
      movies: mockMovies,
      toggleMovie: vi.fn(),
      isInWatchlist: vi.fn(),
    })
    render(<WatchlistPage />)
    expect(screen.getByText('Avatar')).toBeInTheDocument()
    expect(screen.getByText('Batman')).toBeInTheDocument()
  })

  it('exibe contagem correta de filmes', () => {
    vi.mocked(useWatchlist).mockReturnValue({
      movies: mockMovies,
      toggleMovie: vi.fn(),
      isInWatchlist: vi.fn(),
    })
    render(<WatchlistPage />)
    expect(screen.getByText('2 filmes')).toBeInTheDocument()
  })

  it('exibe singular para um filme', () => {
    vi.mocked(useWatchlist).mockReturnValue({
      movies: [mockMovies[0]],
      toggleMovie: vi.fn(),
      isInWatchlist: vi.fn(),
    })
    render(<WatchlistPage />)
    expect(screen.getByText('1 filme')).toBeInTheDocument()
  })

  it('chama toggleMovie ao clicar em remover', () => {
    const toggleMovie = vi.fn()
    vi.mocked(useWatchlist).mockReturnValue({
      movies: mockMovies,
      toggleMovie,
      isInWatchlist: vi.fn(),
    })
    render(<WatchlistPage />)
    fireEvent.click(screen.getByLabelText('Remover Avatar da watchlist'))
    expect(toggleMovie).toHaveBeenCalledWith(mockMovies[0])
  })

  it('ordena por titulo em ordem crescente ao clicar no cabecalho', () => {
    vi.mocked(useWatchlist).mockReturnValue({
      movies: [mockMovies[1], mockMovies[0]],
      toggleMovie: vi.fn(),
      isInWatchlist: vi.fn(),
    })
    render(<WatchlistPage />)

    const rowsBefore = screen.getAllByRole('row')
    expect(rowsBefore[1]).toHaveTextContent('Batman')

    fireEvent.click(screen.getByRole('button', { name: /titulo/i }))

    const rowsAfter = screen.getAllByRole('row')
    expect(rowsAfter[1]).toHaveTextContent('Avatar')
    expect(rowsAfter[2]).toHaveTextContent('Batman')
  })
})
