import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { movieService } from '../services/movieService'
import { tvKeys } from './queryKeys'
import type { BrowseFilters } from '../types'

export const useTvShows = (filters: BrowseFilters = {}) =>
  useQuery({
    queryKey: tvKeys.list(filters),
    queryFn: () => movieService.discoverTv(filters),
    placeholderData: keepPreviousData,
  })
