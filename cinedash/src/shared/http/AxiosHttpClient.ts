import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { IHttpClient, RequestConfig } from './IHttpClient'

export class AxiosHttpClient implements IHttpClient {
  private readonly client: AxiosInstance

  constructor(baseURL: string, defaultHeaders?: Record<string, string>) {
    this.client = axios.create({ baseURL, headers: defaultHeaders })
    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status
        const message =
          status === 401 ? 'Não autorizado'
          : status === 404 ? 'Recurso não encontrado'
          : status === 429 ? 'Muitas requisições. Tente novamente.'
          : 'Erro inesperado. Tente novamente.'
        return Promise.reject(new Error(message))
      },
    )
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, {
      params: config?.params,
      headers: config?.headers,
    })
    return response.data
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, {
      params: config?.params,
      headers: config?.headers,
    })
    return response.data
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, {
      params: config?.params,
      headers: config?.headers,
    })
    return response.data
  }
}
