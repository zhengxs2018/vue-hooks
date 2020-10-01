
import type { AxiosRequestConfig } from 'axios'

import { reactive } from 'vue'

import { useAxios, useList, List } from '@zhengxs/vue-hooks'

import { request } from '../../lib/http'
import type { User } from '../../interfaces/user'

import type { UseUserListOptions, UserListQuery, UserListParams } from './types'

export function useUserList(options: UseUserListOptions = {}) {
  const service = (params: UserListParams, config: AxiosRequestConfig) => {
    return request({ ...config, url: '/api/user/list', params })
  }

  const { loading, error, run, cancel } = useAxios<List<User>, UserListParams>(service, {
    silent: options.silent,
    unique: true,
  })

  const query = reactive<UserListQuery>({
    nickname: '',
  })

  const list = useList<User>({
    loading: loading,
    mode: options.mode,
    autoLoad: options.autoLoad,
    onFetch(args) {
      return run({ ...args, nickname: query.nickname })
    },
  })

  return {
    ...list,
    loading,
    error,
    query,
    cancel
  }
}
