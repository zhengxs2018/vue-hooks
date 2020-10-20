# @zhengxs/vue-hooks-pure

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![NPM version](https://img.shields.io/npm/v/@zhengxs/vue-hooks-pure.svg?style=flat)
![NPM downloads](https://img.shields.io/npm/dm/@zhengxs/vue-hooks-pure.svg?style=flat)
![License](https://img.shields.io/npm/l/@zhengxs/vue-hooks-pure.svg?style=flat-square)

基于 vue2 开发的纯 JavaScript 逻辑的 hook，无任何生命周期的功能，必须在 data 中使用。


## 📦 安装

```bash
$ npm install @zhengxs/vue-hooks-pure --save
```

## Hooks 列表

- **UI 状态**
  - useList 分页列表
  - useForm 表单逻辑

## 使用

```jsx
<template>
  <el-form :model="userForm.data" :rules="userForm.rules" label-width="100px" ref="userForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="userForm.data.username" data-ctr-key="username"></el-input>
    </el-form-item>

    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="userForm.data.nickname"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="userForm.loading" @click="userForm.submit()">
        {{ userForm.mode === 'new' ? '新增' : '保存' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { Message } from 'element-ui'

import { useForm } from '@zhengxs/vue-hooks-pure'

import { getUser } from '@/services/user'

export default {
  name: 'Form',
  props: {
    id: [String, Number]
  },
  data() {
    return {
      // 表单管理
      userForm: useForm({
        mode: 'new',
        data() {
          return {
            id: null,
            username: null,
            nickname: null
          }
        },
        rules: {
          username: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
          ],
          nickname: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ]
        },
        // 获取
        onFetch: () => {
          return getUser({ userId: this.userId })
        },
        // 提交前的数据处理
        // serialize(data) {
        //   const startDate = data.startDate.getTime()
        //   return { ...data,  startDate }
        // },
        // 表单验证
        onValidate: data => {
          return this.$refs.userForm.validate().catch(err => {
            return err === false ? false : Promise.reject(err)
          })
        },
        // 提交
        onCreate(data) {
          // data 的数据是经过 serialize 过滤的
          return http.post('/api/user/create', data)
        },
        // 更新
        onUpdate(data) {
          // data 的数据是经过 serialize 过滤的
          return http.post('/api/user/update', data)
        },
        onError(err) {
          // 如果是 axios 的 cancel 方法导致是不会到这里来的
          // useForm 已经判断过了的
          Message.error(err.message)
        }
      })
    }
  }
}
</script>
```

## License

* MIT
