import type { MovieFilters, BrowseFilters } from '../types'

export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters: MovieFilters) => [...movieKeys.lists(), filters] as const,
  trending: () => [...movieKeys.all, 'trending'] as const,
  genres: () => [...movieKeys.all, 'genres'] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
  credits: (id: number) => [...movieKeys.detail(id), 'credits'] as const,
  videos: (id: number, mediaType: 'movie' | 'tv' = 'movie') => [...movieKeys.detail(id), 'videos', mediaType] as const,
}

export const tvKeys = {
  all: ['tv'] as const,
  lists: () => [...tvKeys.all, 'list'] as const,
  list: (filters: BrowseFilters) => [...tvKeys.lists(), filters] as const,
  trending: () => [...tvKeys.all, 'trending'] as const,
  genres: () => [...tvKeys.all, 'genres'] as const,
}
