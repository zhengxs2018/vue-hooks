import { ref, onUnmounted } from 'vue'

import axios, { AxiosRequestConfig, AxiosInstance, CancelTokenSource } from 'axios'

import { UseAxiosService, CustomService, UseAxiosOptions } from './types'

const CancelToken = axios.CancelToken

function createService<T, V>(service: UseAxiosService<T, V>, client: AxiosInstance): CustomService<T, V> {
  if (typeof service === 'function') {
    return (data: T, options: AxiosRequestConfig): Promise<V> => {
      const result = service(data, options)
      if (typeof (result as unknown as Promise<V>).then === 'function') {
        return result as Promise<V>
      }

      return client.request(result as AxiosRequestConfig)
    }
  }

  return (params: T, options: AxiosRequestConfig) => {
    return client.get<unknown, V>(service as string, { ...options, params })
  }
}

function createHttpClient() {
  const client = axios.create();
  client.interceptors.response.use(res => res.data)
  return client
}

export function useAxios<T, V>(url: UseAxiosService<T, V>, options?: UseAxiosOptions) {
  const {
    mode = 'single',
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
    errorRef.value = null

    // 发送请求
    cancelTokenSource = CancelToken.source()
    const request = service(data, Object.assign({}, options, {
      cancelToken: cancelTokenSource.token
    }))

    function onError(error: Error) {
      // 如果是手动取消
      if (axios.isCancel(error)) {
        // 非严格的模式下就挂起请求
        if (throwIfError !== true) {
          return new Promise(() => void 0)
        }
      } else {
        // 保留上一次错误
        errorRef.value = error
        // 永远不会触发错误
        if (throwIfError === false) {
          return new Promise(() => void 0)
        }
      }

      return Promise.reject(error)
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
