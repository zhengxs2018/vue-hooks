# useList

分页列表 hooks，可以基于这个拓展自己的列表方法

## 适用场景

* 分页表格请求管理
* 新闻等列表请求管理
* 移动端无限滚动请求管理

## 使用

```typescript
import { useList, useAxios } from '@zhengxs/vue-hooks'

const {
  // 请求状态
  loading,

  // 发送请求
  run,

  // 取消请求
  cancel
} = useAxios((params, config) => {
  return request({ ...config, url: '/api/user/list', params })
})

const {
  // state
  items,
  page,
  pageSize,
  total,

  // computed
  isFirst,
  isEnd,

  // async methods
  refresh,
  search,

  loadPageData,
  loadPreviousPageData,
  loadNextPageData,

  // sync methods
  clear,
  toJSON
} = useList({
  // 数据加载状态
  loading: loading,
  // 第一次自动加载数据
  autoLoad: true,
  // 获取远程数据
  onFetch(args) {
    return run({ ...args, nickname: query.nickname })
  },
})
```

**DEMO**

```plan
packages/examples/src/hooks/useUserList/api.ts
```

## API

### 使用参数

```typescript
export interface ListOptions<T> {
  /**
   * 列表变更模式
   *
   * append: 追加模式，适用于无限滚动列表
   * replace：适用于传统分页表格和列表
   * manual：手动处理列表数据
   */
  mode?: 'append' | 'replace' | 'manual'

  /** 加载状态 */
  loading?: boolean

   /** 是否自动加载 */
  autoLoad?: boolean

  /** 初始数据 */
  items?: T[]

  /** 当前页数 */
  page?: number

  /** 每页条数 */
  pageSize?: number

  /** 数据总数 */
  total?: number

  /** 自定义获取数据方法 */
  onFetch(args, options):  Promise<ListFetchResponse<T>>
}

export interface ListFetchResponse<T> {
  /** 数据数组 */
  items: T[]
  /** 当前页数 */
  page?: number
  /** 每页条数 */
  pageSize?: number
  /** 数据总数 */
  total: number
}
```

### 状态数据

```typescript
export interface ListState<T> {
  /** 列表项 */
  items: Ref<T[]>
  /** 当前页码 */
  page: Ref<number>
  /** 分页条数 */
  pageSize: Ref<number>
  /** 总数 */
  total: Ref<number>
}
```

### 计算属性

```typescript
export interface ListComputed {
  /** 是否第一页 */
  isFirst: ComputedRef<boolean>
  /** 是否最后一页 */
  isEnd: ComputedRef<boolean>
}
```

### 方法

```typescript
export interface ListFetchOptions {
  /** 刷新数据 */
  refresh?: boolean
  /** 强制获取数据 */
  force?: boolean
}

export interface ListMethods {
  /**
   * 刷新列表，页面初次加载时调用，用于加载初始数据
   *
   * 多次调用仅执行第一次，可以传递 force 强制刷新
   */
  refresh(options?: ListFetchOptions): Promise<void>

  /**
   * 搜索，可以传递 page 和 pageSize
   *
   * 默认传递 page=1
   */
  search(args?: Partial<ListFetchArgs>): Promise<void>

  /** 加载指定页码 */
  loadPageData(page: number, options?: ListFetchOptions): Promise<void>

  /** 加载上一页 */
  loadPreviousPageData(options?: ListFetchOptions): Promise<void>

  /** 加载下一页 */
  loadNextPageData(options?: ListFetchOptions): Promise<void>

  /** 清空列表数据 */
  clear(): void

  /** 清理列表数据 */
  toJSON(): List<T>
}
```

## React Hooks

如果希望在 react 中使用，可以参考这里的代码: [传送门](https://github.com/zhengxs2018/snowpack-react-app/blob/master/src/hooks/useList/api.ts)
