import axios, { AxiosRequestConfig, AxiosInstance, CancelTokenSource } from 'axios'

import { UseAxiosService, CustomService, UseAxiosOptions, UseAxiosState } from './types'

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
    throwIfError = false
  } = options || {}


  const state: UseAxiosState = {
    loading: false,
    error: null
  }

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

    state.loading = false
    state.error = null

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
        state.error = error
        // 永远不会触发错误
        if (throwIfError === false) {
          return new Promise(() => void 0)
        }
      }

      return Promise.reject(error)
    }

    return request.catch(onError).finally(() => void (state.loading = false))
  }

  return Object.assign(state, {
    send,
    cancel
  })
}
