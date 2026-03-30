import type { IHttpClient } from '@/shared/http/IHttpClient'
import type { Movie, MovieFilters, PaginatedResponse, GenreListResponse } from '../types'
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
      sort_by: 'popularity.desc',
      page: filters.page ?? 1,
    }

    if (filters.genre) params.with_genres = filters.genre
    if (filters.year) params.primary_release_year = filters.year
    if (filters.minRating) params['vote_average.gte'] = filters.minRating

    return this.http.get<PaginatedResponse<Movie>>('/discover/movie', { params })
  }

  getTrending(): Promise<PaginatedResponse<Movie>> {
    return this.http.get<PaginatedResponse<Movie>>('/trending/movie/week', {
      params: { language: LANGUAGE },
    })
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
}

export const movieService = new MovieService(httpClient)
