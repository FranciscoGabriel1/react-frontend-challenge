import type { MovieFilters } from '../types'

export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters: MovieFilters) => [...movieKeys.lists(), filters] as const,
  trending: () => [...movieKeys.all, 'trending'] as const,
  genres: () => [...movieKeys.all, 'genres'] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
}
