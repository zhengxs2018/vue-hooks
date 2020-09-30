# useAxios

基于 [axios][axios] 封装

## 适用场景

* 自动取消上一次请求
* 错误静默处理
* 轮询（未来）
* 错误重试（未来）

## 使用

```typescript
import { useAxios } from '@zhengxs/vue-hooks'

const {
  // state
  loading,
  data,
  error,

  // async methods
  run,

  // sync methods
  cancel
} = useAxios((params, config) => {
  return request({ ...config, url: '/api/user/list', params })
})
```

**DEMO**

```plan
packages/examples/src/hooks/useUserList/api.ts
```

## API

编写中～

[axios]: https://github.com/axios/axios
