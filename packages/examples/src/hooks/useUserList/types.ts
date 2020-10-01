import { ListChangeMode, ListFetchArgs } from '@zhengxs/vue-hooks'

export interface UserListQuery {
  nickname?: string
  [key: string]: any
}

export interface UserListParams extends UserListQuery, ListFetchArgs {
  // pass
}

export interface UseUserListOptions {
  autoLoad?: boolean
  mode?: ListChangeMode
  silent?: boolean
  query?: UserListQuery
}
