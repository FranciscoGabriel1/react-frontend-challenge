import { useQuery } from '@tanstack/react-query'
import { movieService } from '../services/movieService'
import { movieKeys } from './queryKeys'

export const useGenres = () =>
  useQuery({
    queryKey: movieKeys.genres(),
    queryFn: () => movieService.getGenres(),
    staleTime: Infinity,
  })
