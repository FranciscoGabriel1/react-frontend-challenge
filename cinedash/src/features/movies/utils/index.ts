const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const getPosterUrl = (
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'original' = 'w342',
): string | null => {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export const getBackdropUrl = (
  path: string | null,
  size: 'w780' | 'w1280' | 'original' = 'w1280',
): string | null => {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export const formatYear = (releaseDate: string): string => {
  if (!releaseDate) return ''
  return releaseDate.slice(0, 4)
}

export const formatRating = (rating: number): string => rating.toFixed(1)

export const parseMovieIdParam = (id: string | undefined): number | null => {
  if (!id) return null

  const parsedId = Number(id)
  return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null
}
