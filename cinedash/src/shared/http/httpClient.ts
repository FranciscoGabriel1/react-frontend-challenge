import { AxiosHttpClient } from './AxiosHttpClient'
import type { IHttpClient } from './IHttpClient'

const baseURL = import.meta.env.VITE_TMDB_BASE_URL as string
const apiKey = import.meta.env.VITE_TMDB_API_KEY as string

export const httpClient: IHttpClient = new AxiosHttpClient(baseURL, {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
})
