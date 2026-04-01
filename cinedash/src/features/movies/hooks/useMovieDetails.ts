import { useQueries } from '@tanstack/react-query'
import { movieService } from '../services/movieService'
import { movieKeys } from './queryKeys'

const CAST_LIMIT = 5

export const useMovieDetails = (id: number, mediaType: 'movie' | 'tv' = 'movie') => {
  const isTv = mediaType === 'tv'
  const [detailsQuery, creditsQuery, videosQuery] = useQueries({
    queries: [
      {
        queryKey: movieKeys.detail(id, mediaType),
        queryFn: () => (isTv ? movieService.getTvDetails(id) : movieService.getDetails(id)),
      },
      {
        queryKey: movieKeys.credits(id, mediaType),
        queryFn: () => (isTv ? movieService.getTvCredits(id) : movieService.getCredits(id)),
      },
      {
        queryKey: movieKeys.videos(id, mediaType),
        queryFn: () => movieService.getVideos(id, mediaType),
      },
    ],
  })

  const trailer = videosQuery.data?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube',
  )

  return {
    movie: detailsQuery.data,
    cast: creditsQuery.data?.cast?.slice(0, CAST_LIMIT) ?? [],
    trailer,
    isLoading: detailsQuery.isLoading || creditsQuery.isLoading || videosQuery.isLoading,
    isError: detailsQuery.isError,
    error: detailsQuery.error,
  }
}
