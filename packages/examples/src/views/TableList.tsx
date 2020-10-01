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
      // search 方法，默认 page = 1
      return search({ pageSize })
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
  name: 'TableList',
  setup: TableList
})
