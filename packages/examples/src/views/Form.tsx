import axios, { CancelTokenSource } from 'axios'

import { FunctionalComponent as FC, defineComponent, ref, unref } from 'vue'

import { Button, Form, Input } from 'ant-design-vue'

import { useForm } from '@zhengxs/vue-hooks'

import { request } from '../lib/http'
import type { User } from '../interfaces/user'

const CancelToken = axios.CancelToken

function useCreateUser() {
  let cancelSource: CancelTokenSource | null = null
  return (): Promise<User> => {
    if (cancelSource) {
      cancelSource.cancel('abort')
    }

    cancelSource = CancelToken.source()
    return request({
      url: '/api/user/detail',
      cancelToken: cancelSource.token
    })
  }
}

export const FormPage: FC = () => {
  // 获取用户
  const getUser = useCreateUser()
  const formRef = ref<Form>()
  const { mode, loading, data, reset, submit } = useForm<User>({
    mode: 'new',
    data() {
      return {
        id: '',
        username: '',
        avatar: '',
        nickname: ''
      }
    },
    // 数据获取
    onFetch: getUser,
    // 进行表单验证
    onValidate() {
      return formRef.value?.validate().catch((err) => {
        return err === false ? false : Promise.reject(err)
      })
    },
    // 创建
    onCreate(payload) {
      console.log('create', payload)
      return request({
        url: '/api/user/create',
        method: 'POST',
        data: payload
      })
    },
    // 更新
    onUpdate(payload) {
      console.log('update', payload)
      return request({
        url: '/api/user/update',
        method: 'POST',
        data: payload
      })
    }
  })

  const rules = {
    username: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
    ],
    nickname: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ]
  }

  return () => (
    <>
      <Button.Group>
        <Button type={unref(mode) === 'new' ? 'primary' : 'default'} onClick={() => reset({ mode: 'new' })}>
          新增
        </Button>
        <Button type={unref(mode) === 'edit' ? 'primary' : 'default'} onClick={() => reset({ mode: 'edit' })}>
          编辑
        </Button>
      </Button.Group>

      <Form model={data} rules={rules} ref={formRef}>
        <Form.Item v-if={unref(mode) === 'edit'} label="ID" name="id">
          {data.id}
        </Form.Item>

        <Form.Item label="用户名" name="username">
          <Input
            value={data.username}
            onInput={(evt) => (data.username = (evt.target as HTMLInputElement).value.trim())}
          />
        </Form.Item>

        <Form.Item label="昵称" name="nickname">
          <Input
            value={data.nickname}
            onInput={(evt) => (data.nickname = (evt.target as HTMLInputElement).value.trim())}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" loading={unref(loading)} onClick={submit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default defineComponent({
  name: 'Form',
  setup: FormPage
})
