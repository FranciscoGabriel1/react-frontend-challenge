import type { IHttpClient } from '@/shared/http/IHttpClient'
import type {
  Movie,
  MovieDetails,
  MovieFilters,
  BrowseFilters,
  RawTvShow,
  RawTvDetails,
  PaginatedResponse,
  GenreListResponse,
  CreditsResponse,
  VideosResponse,
} from '../types'
import { httpClient } from '@/shared/http/httpClient'

const LANGUAGE = 'pt-BR'

class MovieService {
  private readonly http: IHttpClient

  constructor(http: IHttpClient) {
    this.http = http
  }

  discover(filters: MovieFilters = {}): Promise<PaginatedResponse<Movie>> {
    const params: Record<string, unknown> = {
      language: LANGUAGE,
      sort_by: filters.sortBy ?? 'popularity.desc',
      page: filters.page ?? 1,
    }

    if (filters.genre) params.with_genres = filters.genre
    if (filters.year) params.primary_release_year = filters.year
    if (filters.minRating) params['vote_average.gte'] = filters.minRating

    return this.http.get<PaginatedResponse<Movie>>('/discover/movie', { params })
  }

  discoverTv(filters: BrowseFilters = {}): Promise<PaginatedResponse<Movie>> {
    const params: Record<string, unknown> = {
      language: LANGUAGE,
      sort_by: filters.sortBy ?? 'popularity.desc',
      page: filters.page ?? 1,
    }

    if (filters.genre) params.with_genres = filters.genre
    if (filters.year) params.first_air_date_year = filters.year
    if (filters.minRating) params['vote_average.gte'] = filters.minRating

    return this.http
      .get<PaginatedResponse<RawTvShow>>('/discover/tv', { params })
      .then((raw) => ({
        ...raw,
        results: raw.results.map(this.normalizeTvShow),
      }))
  }

  getTrending(): Promise<PaginatedResponse<Movie>> {
    return this.http.get<PaginatedResponse<Movie>>('/trending/movie/week', {
      params: { language: LANGUAGE },
    })
  }

  getTrendingTv(): Promise<PaginatedResponse<Movie>> {
    return this.http
      .get<PaginatedResponse<RawTvShow>>('/trending/tv/week', {
        params: { language: LANGUAGE },
      })
      .then((raw) => ({
        ...raw,
        results: raw.results.map(this.normalizeTvShow),
      }))
  }

  search(query: string, page = 1): Promise<PaginatedResponse<Movie>> {
    return this.http.get<PaginatedResponse<Movie>>('/search/movie', {
      params: { query, page, language: LANGUAGE },
    })
  }

  getGenres(): Promise<GenreListResponse> {
    return this.http.get<GenreListResponse>('/genre/movie/list', {
      params: { language: LANGUAGE },
    })
  }

  getTvGenres(): Promise<GenreListResponse> {
    return this.http.get<GenreListResponse>('/genre/tv/list', {
      params: { language: LANGUAGE },
    })
  }

  getDetails(id: number): Promise<MovieDetails> {
    return this.http.get<MovieDetails>(`/movie/${id}`, {
      params: { language: LANGUAGE },
    })
  }

  getCredits(id: number): Promise<CreditsResponse> {
    return this.http.get<CreditsResponse>(`/movie/${id}/credits`, {
      params: { language: LANGUAGE },
    })
  }

  getVideos(id: number, mediaType: 'movie' | 'tv' = 'movie'): Promise<VideosResponse> {
    return this.http.get<VideosResponse>(`/${mediaType}/${id}/videos`)
  }

  getTvDetails(id: number): Promise<MovieDetails> {
    return this.http
      .get<RawTvDetails>(`/tv/${id}`, { params: { language: LANGUAGE } })
      .then((raw) => ({
        id: raw.id,
        title: raw.name,
        overview: raw.overview ?? '',
        poster_path: raw.poster_path,
        backdrop_path: raw.backdrop_path,
        release_date: raw.first_air_date ?? '',
        vote_average: raw.vote_average,
        vote_count: raw.vote_count,
        genre_ids: raw.genres.map((g) => g.id),
        popularity: raw.popularity,
        genres: raw.genres,
        runtime: raw.episode_run_time?.[0] ?? null,
        tagline: raw.tagline ?? '',
        status: raw.status ?? '',
        budget: 0,
        revenue: 0,
        mediaType: 'tv' as const,
      }))
  }

  getTvCredits(id: number): Promise<CreditsResponse> {
    return this.http.get<CreditsResponse>(`/tv/${id}/credits`, {
      params: { language: LANGUAGE },
    })
  }

  private normalizeTvShow = (raw: RawTvShow): Movie => ({
    id: raw.id,
    title: raw.name,
    overview: raw.overview ?? '',
    poster_path: raw.poster_path,
    backdrop_path: raw.backdrop_path,
    release_date: raw.first_air_date ?? '',
    vote_average: raw.vote_average,
    vote_count: raw.vote_count,
    genre_ids: raw.genre_ids,
    popularity: raw.popularity,
    mediaType: 'tv',
  })
}

export const movieService = new MovieService(httpClient)
