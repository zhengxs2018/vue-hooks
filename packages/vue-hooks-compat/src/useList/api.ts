import { reactive, ref, computed, toRaw, onBeforeMount } from '@vue/composition-api'

import type { UseListOptions, List, UseListInstance, ListFetchOptions, ListFetchArgs } from './types'

/**
 * 列表 hook 函数
 *
 * @param options 配置参数
 *
 * @return 返回列表状态与方法
 */
export function useList<T>(options: UseListOptions<T>): UseListInstance<T> {
  const onFetch = options.onFetch

  // 列表状态
  const modeRef = ref(options.mode || 'replace')
  const loadingRef = ref(options.loading)

  // 列表数据
  const itemsRef = ref<T[]>(options.items || [])

  // 分页数据
  const pageRef = ref<number>(options.page || 1)
  const pageSizeRef = ref<number>(options.pageSize || 10)
  const totalRef = ref<number>(options.total || 0)

  // 计算属性
  const isFirst = computed<boolean>(() => pageRef.value === 1)
  const isEnd = computed<boolean>(() => totalRef.value > 0 && pageRef.value >= totalRef.value / pageSizeRef.value)

  /**
   * 刷新列表
   *
   * @param options 刷新配置
   */
  function refresh(options?: ListFetchOptions) {
    return dispatchRequest({}, { ...options, refresh: true })
  }

  /**
   * 搜索方法
   *
   * @param args 搜索参数
   */
  function search(args?: Partial<ListFetchArgs>) {
    // 默认，搜索就跳转回第一页
    return dispatchRequest({ page: 1, ...args }, { force: true })
  }

  /**
   * 清空数据
   *
   * @return {void}
   */
  function clear() {
    itemsRef.value = []
    pageRef.value = 1
    pageSizeRef.value = 10
    totalRef.value = 0
  }

  /**
   * 派发请求
   *
   * @private
   *
   * @param args
   * @param options
   */
  async function dispatchRequest(args?: Partial<ListFetchArgs>, options?: ListFetchOptions) {
    args = args || {}
    options = options || {}

    const page = args.page ?? pageRef.value
    const pageSize = args.pageSize ?? pageSizeRef.value

    if (loadingRef.value) {
      if (options.force !== true) return Promise.resolve()
    }

    const mode = modeRef.value
    const res = await onFetch({ page, pageSize }, { ...options, state: toJSON(), mode })
    if (!res) return

    /** @todo 这里的类型这么定义？ */
    if (mode === 'manual' || options.refresh === true) {
      itemsRef.value = reactive(res.items)
    } else {
      itemsRef.value = mode === 'append' ? itemsRef.value.concat(reactive(res.items)) : reactive(res.items)
    }

    // 修改分页数据
    pageRef.value = res.page || page
    pageSizeRef.value = res.pageSize || pageSize
    totalRef.value = res.total || 0
  }

  /**
   * 加载制定页数据
   *
   * @param page       指定页
   * @param options
   * @param options.force 是否强制刷新
   */
  function loadPageData(page: number, options?: ListFetchOptions) {
    return dispatchRequest({ page }, options)
  }

  /**
   * 加载上一页数据
   *
   * @param options
   * @param options.force 是否强制刷新
   */
  function loadPreviousPageData(options?: ListFetchOptions) {
    return isFirst ? Promise.resolve() : loadPageData(pageRef.value - 1, options)
  }

  /**
   * 加载下一页数据
   *
   * @param options 可选项
   * @param options.force 是否强制刷新
   */
  function loadNextPageData(options?: ListFetchOptions) {
    return isEnd ? Promise.resolve() : loadPageData(pageRef.value + 1, options)
  }

  /** 数据转换  */
  function toJSON(): List<T> {
    return {
      items: toRaw(itemsRef.value) as unknown as T[],
      page: pageRef.value,
      pageSize: pageSizeRef.value,
      total: totalRef.value
    }
  }

  onBeforeMount(() => {
    // 自动加载
    if (options.autoLoad === true) refresh()
  })

  return {
    items: itemsRef,
    page: pageRef,
    pageSize: pageSizeRef,
    total: totalRef,

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
  }
}
