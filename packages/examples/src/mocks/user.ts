import { createMockAPI, createMockTable, createMockQueryBuilder } from '@zhengxs/vue-hooks'
import { toSafeInteger, trim } from 'lodash-es'

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
  const nickname = trim(args.nickname || '')
  const page = toSafeInteger(args.page || 1)
  const pageSize = toSafeInteger(args.pageSize || 10)

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
