# createMockAPI

基于 [better-mock][better-mock] 封装

## 适用场景

* 本地接口数据模拟

## 使用

```typescript
import { createMockAPI, createMockTable, createMockQueryBuilder } from '@zhengxs/vue-hooks'

import type { User } from '../interfaces/user'

export type UserListQuery = {
  nickname?: string
  page: number
  pageSize: number
}

// 创建数据表
const table = createMockTable<User>({
  id: '@id',
  username: '@first',
  nickname: '@cname',
})

// 创建请求查询
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

// url 使用 path-to-regexp 所以支持动态路径匹配
createMockAPI('/api/user/list', 'GET', (ctx) => {
  // 查询分页数据
  const data = createQueryBuilder(ctx.query).pagination()

  // 响应 ajax 结果
  return { code: 200, data }
})

```

**DEMO**

```plan
packages/examples/src/mock/user.ts
```

## API

编写中～

[better-mock]: https://github.com/lavyun/better-mock
