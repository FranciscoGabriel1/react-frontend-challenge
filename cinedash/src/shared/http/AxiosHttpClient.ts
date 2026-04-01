import axios, { type AxiosError, type AxiosInstance } from 'axios'
import type { IHttpClient, RequestConfig } from './IHttpClient'

type ApiErrorPayload = {
  message?: string
  status_message?: string
}

export class AxiosHttpClient implements IHttpClient {
  private readonly client: AxiosInstance

  constructor(baseURL: string, defaultConfig?: RequestConfig) {
    this.client = axios.create({
      baseURL,
      headers: defaultConfig?.headers,
      params: defaultConfig?.params,
    })
    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status
        const apiMessage = this.getApiMessage(error)
        const message =
          apiMessage
          ?? (status === 401 ? 'Nao autorizado'
          : status === 404 ? 'Recurso nao encontrado'
          : status === 429 ? 'Muitas requisicoes. Tente novamente.'
          : 'Erro inesperado. Tente novamente.')
        return Promise.reject(new Error(message))
      },
    )
  }

  private getApiMessage(error: AxiosError): string | undefined {
    const data = error.response?.data
    if (!data || typeof data !== 'object') {
      return undefined
    }

    const payload = data as ApiErrorPayload
    return payload.status_message ?? payload.message
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
