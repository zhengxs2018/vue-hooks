# @zhengxs/vue-hooks

Vue Hooks Library.

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![NPM version](https://img.shields.io/npm/v/@zhengxs/vue-hooks.svg?style=flat)
![NPM downloads](https://img.shields.io/npm/dm/@zhengxs/vue-hooks.svg?style=flat)
![License](https://img.shields.io/npm/l/@zhengxs/vue-hooks.svg?style=flat-square)

基于 **vue3.x** 开发的 **hooks** 插件，[@zhengxs/vue-hooks-compat](https://www.npmjs.com/package/@zhengxs/vue-hooks-compat) 通过 `@vue/composition-api` 模块兼容 **vue2.x** 版本

## 📦 安装

```bash
$ npm install @zhengxs/vue-hooks --save
```

## Hooks 列表

- **UI 状态**
  - useList 分页列表
  - useForm 表单逻辑
- **网络请求**
  - useAxios 基于 axios 封装

## 使用

封装业务接口

```typescript
import { reactive } from 'vue'

import { useAxios, useList, List } from '@zhengxs/vue-hooks'

export function useUserList(options: UseUserListOptions = {}) {
  // 通用查询条件
  const query = reactive<UserListQuery>({
    ...options.query,
    nickname: '',
  })

  // 后台服务
  const service = (params: UserListParams, config: AxiosRequestConfig) => {
    return http.get('/api/user/list', { ...config, params })
  }

  // 使用 useAxios 自动管理状态
  const { loading, error, run, cancel } = useAxios<List<User>, UserListParams>(service, {
    silent: true, // 当错误的时候内部消化
    unique: true, // 不管调用几次，都仅保留最后一次的请求状态
  })

  // 使用 useList 管理列表分页调用
  const list = useList<User>({
    loading: loading,
    mode: options.mode, // 列表变更模式，append：追加 | replace: 替换 | manual: 手动处理
    autoLoad: options.autoLoad, // 是否自动加载第一页的数据
    onFetch(args) {
      return run({ ...args, ...query })
    },
  })

  return {
    ...list,
    loading,
    query,
    error,
    cancel
  }
}

```

在组件中使用

```tsx
import { FunctionalComponent as FC, defineComponent } from 'vue'

import { Alert, Input, Table } from 'ant-design-vue'

import { useUserList } from '../hooks/useUserList/index'

export const UserList: FC = () => {
  const { loading, error, query, items, page, pageSize, total, search, loadPageData, toJSON } = useUserList({
    autoLoad: true
  })

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname'
    }
  ]

  const pagination = {
    current: page,
    pageSize: pageSize,
    total: total,
    onChange(page: number) {
      return loadPageData(page, { force: true })
    },
    onShowSizeChange(_: number, pageSize: number) {
      return search({ pageSize })
    }
  }

  return () => (
    <>
      <h1>用户列表</h1>
      {error.value && <Alert type="error" message="加载错误" description={error.value.message} closable />}
      <Input
        value={query.nickname}
        placeholder="回车搜索"
        onInput={(evt) => (query.nickname = (evt.target as HTMLInputElement).value.trim())}
        // @ts-ignore
        onPressEnter={() => search()}
      />
      <Table loading={loading.value} columns={columns} dataSource={items.value} rowKey="id" pagination={pagination} />
    </>
  )
}

export default defineComponent({
  name: 'UserList',
  setup: UserList
})
```

## License

* MIT
