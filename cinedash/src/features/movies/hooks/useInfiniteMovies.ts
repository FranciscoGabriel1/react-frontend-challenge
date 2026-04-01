import { useInfiniteQuery } from '@tanstack/react-query'
import { movieService } from '../services/movieService'
import { movieKeys } from './queryKeys'
import type { BrowseFilters } from '../types'

type InfiniteFilters = Omit<BrowseFilters, 'page'>

const MAX_PAGES = 7

export const useInfiniteMovies = (filters: InfiniteFilters = {}, enabled = true) =>
  useInfiniteQuery({
    queryKey: movieKeys.infiniteList(filters),
    queryFn: ({ pageParam }) => movieService.discover({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length < MAX_PAGES && lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined,
    enabled,
  })
