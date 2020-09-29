import { ref, reactive } from 'vue'

import axios, { CancelTokenSource } from 'axios'

import type { UseAxiosService, UseAxiosOptions, UseAxiosState, UseAxiosInstance } from './types'

const CancelToken = axios.CancelToken

const never: Promise<never> = new Promise(() => void 0)

export function useAxios<T extends object = any, U = any, S extends UseAxiosService<T, U> = any>(
  service: S,
  options: UseAxiosOptions = {}
): UseAxiosInstance<T, U> {
  let cancelSource: CancelTokenSource | null = null

  const unique = options.unique !== true
  const silent = options.silent !== false

  const loadingRef = ref<boolean>(false)
  const dataRef = ref<T | null>(null)
  const errorRef = ref<Error | null>(null)

  const onSuccess = (data: T) => {
    loadingRef.value = false
    // @ts-ignore
    dataRef.value = reactive<T>(data)
    return data
  }

  const onError = (error: Error): Promise<never> => {
    loadingRef.value = false
    errorRef.value = error
    return silent ? never : Promise.reject(error)
  }

  const run = (args: U): Promise<T> => {
    if (unique) cancel()

    const source = CancelToken.source()
    cancelSource = source

    loadingRef.value = true
    dataRef.value = null
    errorRef.value = null
    return service(args, { cancelToken: source.token }).then(onSuccess, onError)
  }

  const cancel = (message?: string) => {
    if (cancelSource) {
      cancelSource.cancel(message)
      cancelSource = null
    }
  }

  /** 数据转换  */
  function toJSON(): UseAxiosState<T> {
    return {
      loading: loadingRef.value,
      data: dataRef.value as T,
      error: errorRef.value
    }
  }

  return {
    loading: loadingRef,
    data: dataRef,
    error: errorRef,
    run,
    cancel,
    toJSON
  }
}
