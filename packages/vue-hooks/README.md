# @zhengxs/vue-hooks

Vue Hooks Library.

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![NPM version](https://img.shields.io/npm/v/@zhengxs/vue-hooks.svg?style=flat)
![NPM downloads](https://img.shields.io/npm/dm/@zhengxs/vue-hooks.svg?style=flat)
![License](https://img.shields.io/npm/l/@nrwl/workspace.svg?style=flat-square)

基础 **vue3.x** 开发的 **hooks** 插件，未来将通过 `@vue/composition-api` 模块兼容 **vue2.x** 版本

## 📦 安装

```bash
$ npm install @zhengxs/vue-hooks --save
```

## 🔨 使用

封装业务接口

```typescript
import type { AxiosRequestConfig } from 'axios'

import { reactive } from 'vue'

import { useAxios, useList, List } from '@zhengxs/vue-hooks'

import { request } from '../../lib/http'
import type { User } from '../../interfaces/user'

import { UseUserListOptions, UserListQuery, UserListParams } from './types'

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

```

在组件中使用

```typescript
import { FunctionalComponent as FC, defineComponent, watch } from 'vue'

import { Alert, Input, Table } from 'ant-design-vue'

import { useUserList } from '../hooks/useUserList/index'

export const TableList: FC = () => {
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

  const pagination: any = {
    current: page,
    pageSize: pageSize,
    total: total,
    onChange(page: number) {
      return loadPageData(page, { force: true })
    },
    onShowSizeChange(_: number, pageSize: number) {
      return search({ page: 1, pageSize })
    }
  }

  watch(
    () => {
      return items.value
    },
    () => {
      console.log(toJSON())
    }
  )

  return () => (
    <>
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
  name: 'TableList',
  setup: TableList
})
```

[nodejs]: https://nodejs.org
