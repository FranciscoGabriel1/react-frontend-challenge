import type { MovieFilters, BrowseFilters } from '../types'

export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters: MovieFilters) => [...movieKeys.lists(), filters] as const,
  infiniteList: (filters: BrowseFilters) => [...movieKeys.lists(), 'infinite', filters] as const,
  trending: () => [...movieKeys.all, 'trending'] as const,
  genres: () => [...movieKeys.all, 'genres'] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
  details: (mediaType: 'movie' | 'tv' = 'movie') =>
    [...movieKeys.all, 'detail', mediaType] as const,
  detail: (id: number, mediaType: 'movie' | 'tv' = 'movie') =>
    [...movieKeys.details(mediaType), id] as const,
  credits: (id: number, mediaType: 'movie' | 'tv' = 'movie') =>
    [...movieKeys.detail(id, mediaType), 'credits'] as const,
  videos: (id: number, mediaType: 'movie' | 'tv' = 'movie') =>
    [...movieKeys.detail(id, mediaType), 'videos'] as const,
}

export const tvKeys = {
  all: ['tv'] as const,
  lists: () => [...tvKeys.all, 'list'] as const,
  list: (filters: BrowseFilters) => [...tvKeys.lists(), filters] as const,
  infiniteList: (filters: BrowseFilters) => [...tvKeys.lists(), 'infinite', filters] as const,
  trending: () => [...tvKeys.all, 'trending'] as const,
  genres: () => [...tvKeys.all, 'genres'] as const,
}
