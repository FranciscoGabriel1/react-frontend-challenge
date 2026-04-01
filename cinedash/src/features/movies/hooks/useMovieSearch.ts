import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { movieService } from '../services/movieService'
import { movieKeys } from './queryKeys'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { SEARCH_MIN_LENGTH } from '@/shared/constants/search'

export const useMovieSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 500)

  return useQuery({
    queryKey: movieKeys.search(debouncedQuery),
    queryFn: () => movieService.search(debouncedQuery),
    enabled: debouncedQuery.length >= SEARCH_MIN_LENGTH,
    placeholderData: keepPreviousData,
  })
}
