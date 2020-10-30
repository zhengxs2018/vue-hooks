import type { AxiosRequestConfig, AxiosInstance } from 'axios'

/**
 * 请求模式
 *
 * normal: 默认
 * single: 单请求
 * polling: 轮训
 */
export type RequestMode = 'normal' | 'single' | 'polling'

export interface UseAxiosOptions {
  /**
   * 请求模式
   */
  mode?: RequestMode
  /**
   * axios 客户端实例
   */
  client?: AxiosInstance
  /**
   * 设置为 false 错误将永远不会出现
   *
   * 注意：这将让状态永远处于 padding 状态
   */
  throwIfError?: boolean
}

export interface CustomService<T, V> {
  (data: T, options: AxiosRequestConfig): Promise<V>
}

export interface CustomAxiosRequestConfig<T> {
  (data: T, options: AxiosRequestConfig): AxiosRequestConfig
}

export type UseAxiosService<T, V> = string | CustomAxiosRequestConfig<T> | CustomService<T, V>

export interface UseAxiosState {
  loading: boolean
  error: Error | null
}
