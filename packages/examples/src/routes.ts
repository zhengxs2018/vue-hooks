import { RouteRecordRaw } from 'vue-router'

import TableList from './views/TableList'
import Form from './views/Form'

export default [
  <RouteRecordRaw>{
    path: '/TableList',
    component: TableList
  },
  <RouteRecordRaw>{
    path: '/Form',
    component: Form
  }
]
