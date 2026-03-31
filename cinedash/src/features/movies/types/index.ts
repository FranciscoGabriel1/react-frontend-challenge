export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  mediaType?: 'movie' | 'tv'
}

export interface MovieDetails extends Movie {
  genres: Genre[]
  runtime: number | null
  tagline: string
  status: string
  budget: number
  revenue: number
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface VideoResult {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface CreditsResponse {
  id: number
  cast: CastMember[]
}

export interface VideosResponse {
  id: number
  results: VideoResult[]
}

export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface GenreListResponse {
  genres: Genre[]
}

export interface MovieFilters {
  genre?: number
  year?: number
  minRating?: number
  page?: number
  sortBy?: string
}

export interface BrowseFilters {
  genre?: number
  page?: number
  sortBy?: string
  year?: number
  minRating?: number
}

export interface RawTvShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
}

export interface RawTvDetails {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  genres: Genre[]
  popularity: number
  episode_run_time: number[]
  tagline: string
  status: string
  number_of_episodes: number
  number_of_seasons: number
}
