import { useQuery } from '@tanstack/react-query'
import { movieService } from '../services/movieService'
import { tvKeys } from './queryKeys'

export const useTrendingTv = () =>
  useQuery({
    queryKey: tvKeys.trending(),
    queryFn: () => movieService.getTrendingTv(),
    staleTime: 5 * 60 * 1000,
  })
