import type { AxiosRequestConfig } from 'axios'

import type { Ref, UnwrapRef } from 'vue'

export interface UseAxiosState<T> {
  loading: boolean
  data: T | null
  error: Error | null
}

export interface UseAxiosOptions {
  unique?: boolean
  silent?: boolean
}

export interface UseAxiosInstance<T, P> {
  data: Ref<UnwrapRef<T> | null>
  loading: Ref<boolean>
  error: Ref<Error | null>

  run(args: P): Promise<T>
  cancel(message?: string): void
  toJSON(): UseAxiosState<T>
}

export type UseAxiosService<T, U> = (args: U, options: AxiosRequestConfig) => Promise<T>
