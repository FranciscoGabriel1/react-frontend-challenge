import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { movieService } from '../services/movieService'
import { movieKeys } from './queryKeys'
import type { MovieFilters } from '../types'

export const useMovies = (filters: MovieFilters = {}, enabled = true) =>
  useQuery({
    queryKey: movieKeys.list(filters),
    queryFn: () => movieService.discover(filters),
    placeholderData: keepPreviousData,
    enabled,
  })
