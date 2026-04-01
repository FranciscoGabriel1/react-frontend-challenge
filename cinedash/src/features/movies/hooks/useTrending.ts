import { useQuery } from '@tanstack/react-query'
import { movieService } from '../services/movieService'
import { movieKeys } from './queryKeys'

export const useTrending = () =>
  useQuery({
    queryKey: movieKeys.trending(),
    queryFn: () => movieService.getTrending(),
  })
