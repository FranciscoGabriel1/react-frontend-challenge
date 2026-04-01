import { AxiosHttpClient } from './AxiosHttpClient'
import type { IHttpClient, RequestConfig } from './IHttpClient'

const TMDB_V3_API_KEY_PATTERN = /^[a-f0-9]{32}$/i

const baseURL = (import.meta.env.VITE_TMDB_BASE_URL as string | undefined)?.trim()
const apiKey = (import.meta.env.VITE_TMDB_API_KEY as string | undefined)?.trim()
const readAccessToken = (import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN as string | undefined)?.trim()

const defaultConfig: RequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
}

if (readAccessToken) {
  defaultConfig.headers = {
    ...defaultConfig.headers,
    Authorization: `Bearer ${readAccessToken}`,
  }
} else if (apiKey) {
  if (TMDB_V3_API_KEY_PATTERN.test(apiKey)) {
    defaultConfig.params = { api_key: apiKey }
  } else {
    defaultConfig.headers = {
      ...defaultConfig.headers,
      Authorization: `Bearer ${apiKey}`,
    }
  }
}

export const httpClient: IHttpClient = new AxiosHttpClient(
  baseURL ?? 'https://api.themoviedb.org/3',
  defaultConfig,
)
