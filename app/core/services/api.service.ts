import { injectable } from 'inversify'
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { IApiService, ApiResponse, RequestConfig } from '../interfaces'

@injectable()
export class ApiService implements IApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    // Default error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log error details for debugging
        console.error('API Request Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        })

        return Promise.reject(error)
      }
    )
  }

  private transformResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    }
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, config)
      return this.transformResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config)
      return this.transformResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config)
      return this.transformResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config)
      return this.transformResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config)
      return this.transformResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  setDefaultConfig(config: Partial<RequestConfig>): void {
    Object.assign(this.axiosInstance.defaults, config)
  }

  addRequestInterceptor(
    onFulfilled?: (config: any) => any,
    onRejected?: (error: any) => any
  ): number {
    return this.axiosInstance.interceptors.request.use(onFulfilled, onRejected)
  }

  addResponseInterceptor(
    onFulfilled?: (response: AxiosResponse) => AxiosResponse,
    onRejected?: (error: any) => any
  ): number {
    return this.axiosInstance.interceptors.response.use(onFulfilled, onRejected)
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText || 'API request failed'
      const apiError = new Error(`HTTP ${error.response.status}: ${message}`)
      ;(apiError as any).status = error.response.status
      ;(apiError as any).data = error.response.data
      return apiError
    } else if (error.request) {
      // Network error
      return new Error('Network error: Unable to reach the server')
    } else {
      // Other error
      return new Error(`Request error: ${error.message}`)
    }
  }
}
