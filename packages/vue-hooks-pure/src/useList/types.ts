/**
 * 列表变更模式
 */
export type ListMode = 'append' | 'replace' | 'manual'

/**
 * 分页器
 */
export interface Pagination {
  /** 当前页数 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 数据总数 */
  total: number
}

/**
 * 列表数据结构
 */
export interface List<T> extends Pagination {
  /**
   * 数据数组
   */
  items: T[]
}

export interface ListFetchOptions {
  /** 刷新数据 */
  refresh?: boolean
  /** 强制获取数据 */
  force?: boolean
}

export interface ListFetchHandlerOptions<T> extends ListFetchOptions {
  /** 数据变更模式 */
  mode: ListMode
  /** 列表状态数据 */
  state: List<T>
}

/**
 * 列表数据请求函数参数
 */
export interface ListFetchArgs extends Omit<Pagination, 'total'> {
  query: Record<string, any>
}

/**
 * 请求响应结果
 */
export interface ListFetchResponse<T> extends Partial<ListFetchArgs> {
  items: T[]
  total: number
}

export interface ListFetchHandler<T> {
  (args: ListFetchArgs, options: ListFetchHandlerOptions<T>): Promise<ListFetchResponse<T>>
}

/**
 * UseList 配置参数
 */
export interface UseListOptions<T> extends Partial<List<T>> {
  /** 数据变更模式 */
  mode?: ListMode
  /** 查询参数 */
  query?: Record<string, any>
  /** 自动加载 */
  autoLoad?: boolean
  /** 获取数据 */
  onFetch: ListFetchHandler<T>
}

export interface UseListInstance<T> extends List<T> {
  // computed
  isFirst(): boolean
  isEnd(): boolean

  // async methods
  refresh(force?: boolean): Promise<void>
  search(args?: Partial<ListFetchArgs>): Promise<void>
  loadPageData(page: number, options?: ListFetchOptions): Promise<void>
  loadPreviousPageData(force?: boolean): Promise<void>
  loadNextPageData(force?: boolean): Promise<void>

  // sync methods
  clear(): void
  toJSON(): T[]
}
