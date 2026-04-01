import { useQuery } from '@tanstack/react-query'
import { movieService } from '../services/movieService'
import { tvKeys } from './queryKeys'

export const useTvGenres = () =>
  useQuery({
    queryKey: tvKeys.genres(),
    queryFn: () => movieService.getTvGenres(),
    staleTime: Infinity,
  })
