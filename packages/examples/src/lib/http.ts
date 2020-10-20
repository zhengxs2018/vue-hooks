import axios, { AxiosRequestConfig } from 'axios'

import { hasOwn } from './util'

const http = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
})

http.interceptors.response.use(
  (response) => {
    const data = response.data
    // 这里不判断，因为登录等场景可能需要业务字段
    return hasOwn.call(data, 'code') ? data : Promise.reject(new Error('parse error.'))
  },
  (error) => {
    const config = error.config || {}
    // 避免每次都处理错误
    if (config.silent === true) {
      return Promise.resolve({ code: -2, message: error.message })
    }
    return Promise.reject(error)
  }
)

export interface BizResponseResult<T> {
  code: number
  message: string
  data: T
}

export async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  const res = await http.request<null, BizResponseResult<T>>(config)
  return res.code === 200 ? res.data : Promise.reject(new Error(res.message ?? 'unknown error.'))
}

export default http
