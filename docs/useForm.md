# useForm

抽象表单操作

## 适用场景

* 任何表单

## 使用

```typescript
import { useForm } from '@zhengxs/vue-hooks'

// 表单引用
const formRef = ref<Form>()

const { mode, loading, data, reset, submit } = useForm<User>({
  //  表单模式，new: 新增，edit: 编辑
  mode: 'new',
  // 表单数据
  // 当 mode=new 的时候，仅初始化
  // 当 mode=edit 的时候，会调用 onFetch 方法
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
  // 表单验证
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
```

**DEMO**

```plan
packages/examples/src/views/Form.ts
```

## API

### 参数

```typescript
export interface ListOptions<T> {
  /**
   * 列表变更模式
   *
   * new: 新增，仅初始化
   * edit: 编辑，会调用 onFetch 获取数据
   * manual：手动处理列表数据
   */
  mode?: 'new' | 'edit'
  // 表单初始化数据
  data: InitialState<T>
  // 序列化数据，提交的数据会使用这个先处理下
  serialize?: Serialize<T>
  // 获取编辑数据
  onFetch: FetchHandler<T>
  // 提交前的验证
  onValidate?: ValidateHandler<T>
  // 提交创建数据
  onCreate: SubmitHandler<T>
  // 提交修改数据
  onUpdate: SubmitHandler<T>
  // 自定义处理错误
  onError?: (error: Error) => Promise<any> | never
}
```

### 属性

```typescript
export interface ListState<T> {
  loading: Ref<boolean>,
  mode: Ref<'new' | 'edit'>,
  // 表单数据
  data: T
}
```

### 方法

```typescript
export interface ListState<T> {
  submit(data: Partial<T>): Promise<null | undefined | T>
  reset(options?: { mode: 'new' | 'edit' }): Promise<void>
  toJSON(): Partial<T>
}
```
