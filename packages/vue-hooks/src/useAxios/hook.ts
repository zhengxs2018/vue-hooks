import { ref, onUnmounted } from 'vue'

import axios, { AxiosRequestConfig, AxiosInstance, CancelTokenSource } from 'axios'

import { UseAxiosService, CustomService, UseAxiosOptions } from './types'

const CancelToken = axios.CancelToken

function createService<T, V>(service: UseAxiosService<T, V>, client: AxiosInstance): CustomService<T, V> {
  switch (typeof service) {
    case "function":
      return service
    case "string":
      return (params: T, options: AxiosRequestConfig) => {
        return client.get<unknown, V>(service as string, { ...options, params })
      }
    default:
      return (data: T, options: AxiosRequestConfig) => {
        return client.request<unknown, V>({ ...service, ...options, data })
      }
  }
}

function createHttpClient() {
  const client = axios.create();
  client.interceptors.response.use(res => res.data)
  return client
}

export function useAxios<T, V>(url: UseAxiosService<T, V>, options?: UseAxiosOptions) {
  const {
    mode = 'normal',
    client = createHttpClient(),
    throwIfError = false,
    cancelOnUnmounted = true
  } = options || {}

  const loadingRef = ref(false)
  const errorRef = ref<Error | null>(null)

  const service = createService(url, client)

  let cancelTokenSource: CancelTokenSource | null = null
  function cancel(msg?: string) {
    if (cancelTokenSource) {
      cancelTokenSource.cancel(msg)
      cancelTokenSource = null
    }
  }

  function send(data: T, options?: AxiosRequestConfig) {
    // 如果是单请求模式
    // 每次请求前取消上一次的请求
    if (mode === 'single') cancel('Duplicate request.')

    loadingRef.value = false

    // 发送请求
    const request = service(data, {
      ...options,
      cancelToken: (cancelTokenSource = CancelToken.source()).token
    })

    function onError(error: Error) {
      // 保留上一次错误
      errorRef.value = error

      // 永远不会触发错误
      if (throwIfError === false || throwIfError === 'never') {
        return new Promise(() => void 0)
      }

      return throwIfError !== 'silent' && Promise.reject(error)
    }

    return request.catch(onError).finally(() => void (loadingRef.value = false))
  }

  // 页面销毁时自动取消
  if (cancelOnUnmounted) {
    onUnmounted(cancel)
  }

  return {
    loading: loadingRef,
    client,
    error: errorRef,
    send,
    cancel
  }
}
