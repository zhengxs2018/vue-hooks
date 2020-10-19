import { blockHttpRequest, createTable, createQueryBuilder } from '@zhengxs/mock'
import { toSafeInteger, trim } from 'lodash-es'

import type { User } from '../interfaces/user'

const table = createTable<User>({
  id: '@id',
  username: '@first',
  nickname: '@cname'
})

blockHttpRequest('/api/user/list', 'GET', (ctx) => {
  // 获取查询参数
  const args = ctx.query

  // 分页数据
  const page = toSafeInteger(args.page || 1)
  const pageSize = toSafeInteger(args.pageSize || 10)

  // 创建查询构造器
  const query = createQueryBuilder(table)

  // 添加昵称过滤
  const nickname = trim(args.nickname || '')
  if (nickname) {
    // 支持多个过滤条件
    query.where((row: User) => {
      return row.nickname.indexOf(nickname) > -1
    })
  }

  return {
    code: 200,
    message: 'ok',
    data: query.pagination({ page, pageSize })
  }
})

blockHttpRequest('/api/user/detail', 'GET', () => {
  return {
    code: 200,
    message: 'ok',
    data: table.rows[0]
  }
})

blockHttpRequest('/api/user/create', 'POST', () => {
  return {
    code: 200,
    message: 'ok'
  }
})

blockHttpRequest('/api/user/update', 'POST', () => {
  return {
    code: 200,
    message: 'ok'
  }
})
