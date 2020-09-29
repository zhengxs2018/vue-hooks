# @zhengxs/vue-hooks

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

基础 vue3.x 开发的 hooks 插件，兼容 vue2.x 版本.

## 安装

```bash
$ npm install @zhengxs/vue-hooks --save
```

## 使用

### 在 vue3 中使用

```typescript
import { reactive, onBeforeMount } from 'vue'

import { useList, useAxios, List, ListChangeMode } from '@zhengxs/vue-hooks'

import { request } from '@/lib/http'
import type { User } from '@/interfaces/user'

export interface UseUserListOptions {
  mode?: ListChangeMode
  silent?: boolean
}

export interface UserRequestParams extends LoadArgs {
  nickname: string
}

export function useUserList(options: UseUserListOptions = {}) {
  const query = reactive<{ nickname: string }>({
    nickname: '',
  })

  const service = (params: UserRequestParams, config: AxiosRequestConfig) => {
    return request({ ...config, url: '/api/user/list', params })
  }

  const http = useAxios<List<User>, UserRequestParams>(service, {
    silent: options.silent,
    unique: true,
  })

  const list = useList<User>({
    mode: options.mode,
    loading: http.loading,
    dispatchRequest(args) {
      return http.run({ ...args, ...query })
    },
  })

  return { query, ...http, ...list }
}

export default {
  setup() {
    const userList = useUserList((params, config) => {
      return request({ ...config, url: '/api/user/list', params })
    })

    onBeforeMount(() => {
      userList.refresh()
    })

    return {
      userList
    }
  }
}
```

### 在 vue2 中使用

在 **vue2** 中模块路径改成 `@zhengxs/vue-hooks/vue2`

```typescript
import { useList, useAxios, List, ListChangeMode } from '@zhengxs/vue-hooks/vue2'

import { request } from '@/lib/http'
import type { User } from '@/interfaces/user'

export interface UseUserListOptions {
  mode?: ListChangeMode
  silent?: boolean
}

export interface UserRequestParams extends LoadArgs {
  nickname: string
}

export function useUserList(options: UseUserListOptions = {}) {
  const query = {
    nickname: '',
  }

  const service = (params: UserRequestParams, config: AxiosRequestConfig) => {
    return request({ ...config, url: '/api/user/list', params })
  }

  const http = useAxios<List<User>, UserRequestParams>(service, {
    silent: options.silent,
    unique: true,
  })

  const list = useList<User>({
    mode: options.mode,
    loading: http.loading,
    dispatchRequest(args) {
      return http.run({ ...args, ...query })
    },
  })

  return { query, ...http, ...list }
}

export default {
  data() {
    return {
      userList: useUserList((params, config) => {
        return request({ ...config, url: '/api/user/list', params })
      })
    }
  },
  created() {
    this.userList.refresh()
  }
}
```

## 开发步骤

你需要安装 [Node.js][nodejs] 的版本为 12+.

克隆此仓库后运行:

```bash
# 安装依赖
$ yarn install

# 启动 storybook
$ yarn storybook

# 构建 typedoc 文档
$ yarn typedoc

# 构建代码
$ yarn build
```

在 package.json 文件的 scripts 部分还有一些其他脚本可用.

## 运行单元测试

```bash
# 单元测试
$ yarn test

# 单元测试并且生成测试覆盖率
$ yarn cov
```

## 版本发布

**自动发布**

```bash
# 发布内测版
$ yarn canary

# 发布测试版
$ yarn beta
```

**手动发布**

```bash
# 更新版本，内置代码检查
$ npm version <newversion|major|minor|patch>

# 发布包，内置代码构建
$ npm publish
```

See [npm](https://docs.npmjs.com/) for more help.

## 更新日志

See [CHANGELOG.md](./CHANGELOG.md)

## 贡献

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md)

[nodejs]: https://nodejs.org
