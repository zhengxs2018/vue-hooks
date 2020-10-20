import { toSafeInteger } from '../utils'
import type { UseListOptions, UseListInstance, ListFetchOptions, ListFetchArgs } from './types'

function createState<T extends object>(options: UseListOptions<T>) {
  return {
    loading: false,
    mode: options.mode || 'replace',
    query: options.query || {},
    items: Array.isArray(options.items) ? options.items : [],
    page: toSafeInteger(options.page, 1),
    pageSize: toSafeInteger(options.pageSize, 10),
    total: toSafeInteger(options.total, 0)
  }
}

export function useList<T extends object>(options: UseListOptions<T>): UseListInstance<T> {
  options = options || {}

  const onFetch = options.onFetch

  const state = createState(options)

  // 是否第一页
  const isFirst = (): boolean => state.page === 1

  // 是否结尾
  const isEnd = (): boolean => state.total > 0 && state.page >= state.total / state.pageSize

  function refresh(force?: boolean): Promise<void> {
    return load({}, { refresh: true, force })
  }

  /**
   * 手说
   *
   * @param args
   */
  function search(args?: Partial<ListFetchArgs>): Promise<void> {
    return load({ page: 1, ...args }, { force: true })
  }

  /**
   * 加载指定页数据
   *
   * @param page
   * @param options
   */
  function loadPageData(page: number, options?: ListFetchOptions): Promise<void> {
    return load({ page }, options)
  }

  function loadPreviousPageData(force = false): Promise<void> {
    if (isFirst()) {
      if (force === true) {
        return loadPageData(state.page, { force })
      }
      return Promise.resolve()
    }
    return loadPageData(state.page - 1, { force })
  }

  function loadNextPageData(force = false): Promise<void> {
    if (isEnd() && force === false) return Promise.resolve()
    return loadPageData(state.page + 1, { force })
  }

  async function load(args: Partial<ListFetchArgs>, options?: ListFetchOptions): Promise<void> {
    options = options || {}

    // 加载中并且不强制刷新就直接返回
    if (state.loading && options.force !== true) {
      return Promise.resolve()
    }
    state.loading = true

    // 列表模式
    const mode = state.mode

    // 请求数据
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      query: state.query,
      ...args
    }
    const res = await Promise.resolve(onFetch(params, { mode, state }))

    // 如果不反会数据那就跳过
    if (!res) return

    // 修改列表数据
    if (mode === 'manual' || options.refresh === true) {
      state.items = res.items
    } else {
      state.items = mode === 'append' ? state.items.concat(state.items) : state.items
    }

    // 修改分页数据
    state.page = res.page ?? 1
    state.pageSize = res.pageSize ?? 10
    state.total = res.total ?? 0
  }

  function toJSON(): T[] {
    return state.items
  }

  function clear(): void {
    state.items = []
  }

  return Object.assign(state, {
    isFirst,
    isEnd,

    refresh,
    search,

    loadPageData,
    loadPreviousPageData,
    loadNextPageData,

    clear,
    toJSON
  })
}
