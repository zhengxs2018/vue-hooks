import { createMockAPI, createMockTable, createMockQueryBuilder, useList } from '@zhengxs/vue-hooks'

import type { User } from '../interfaces/user'

export type UserListQuery = {
  nickname?: string
  page: number
  pageSize: number
}

const table = createMockTable<User>({
  id: '@id',
  username: '@first',
  nickname: '@cname',
})

function createQueryBuilder(args: UserListQuery) {
  const { nickname, page, pageSize } = args

  const query = createMockQueryBuilder(table)
    .offset((page - 1) * pageSize)
    .limit(pageSize)

  if (nickname) {
    query.where((row: User) => {
      return row.nickname.indexOf(nickname as string) > -1
    })
  }

  return query
}

createMockAPI('/api/user/list', 'GET', (ctx) => {
  return { code: 200, data: createQueryBuilder((ctx.query as unknown) as UserListQuery).pagination() }
})
