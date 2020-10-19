import { FunctionalComponent as FC, defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { Layout, Menu } from 'ant-design-vue'

const { Header, Content, Footer, Sider } = Layout
const { Item } = Menu

type MenuClickHandler = (params: {
  key: string | number
  keyPath: string[] | number[]
  item: any
  domEvent: MouseEvent
}) => void

export const BasicLayout: FC = (_, { slots }) => {
  const router = useRouter()
  const route = useRoute()

  const onClick: MenuClickHandler = (info) => {
    router.push(info.key.toString())
  }

  return () => (
    <Layout>
      <Header></Header>
      <Content style={{ padding: '0 20px' }}>
        <Layout style={{ padding: '24px 0' }}>
          <Sider width={200}>
            <Menu mode="inline" selectedKeys={[route.path]} style={{ height: '100%' }} onClick={onClick}>
              <Item key="/TableList">TableList</Item>
              <Item key="/Form">Form</Item>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>{slots}</Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created by zhengxs2018 </Footer>
    </Layout>
  )
}

export default defineComponent({
  name: 'BasicLayout',
  setup: BasicLayout
})
