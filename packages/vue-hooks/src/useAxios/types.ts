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
  throwIfError?: boolean | 'never' | 'silent'
  /**
   * 页面销毁时自动取消请求
   */
  cancelOnUnmounted?: boolean
}

export interface CustomService<T, V> {
  (data: T, options: AxiosRequestConfig): Promise<V>
}

export type UseAxiosService<T, V> = string | AxiosRequestConfig | CustomService<T, V>
