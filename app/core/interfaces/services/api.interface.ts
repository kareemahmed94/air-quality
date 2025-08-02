import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
}

export interface RequestConfig extends AxiosRequestConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

export interface IApiService {
  /**
   * GET request
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
  
  /**
   * POST request
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
  
  /**
   * PUT request
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
  
  /**
   * DELETE request
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
  
  /**
   * PATCH request
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>
  
  /**
   * Set default configuration for all requests
   */
  setDefaultConfig(config: Partial<RequestConfig>): void
  
  /**
   * Add request interceptor
   */
  addRequestInterceptor(
    onFulfilled?: (config: any) => any,
    onRejected?: (error: any) => any
  ): number
  
  /**
   * Add response interceptor
   */
  addResponseInterceptor(
    onFulfilled?: (response: AxiosResponse) => AxiosResponse,
    onRejected?: (error: any) => any
  ): number
}