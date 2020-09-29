import 'ant-design-vue/dist/antd.css'

import axios from 'axios'

import { createApp } from 'vue'

import './mocks/index'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router).mount('#app')

if (import.meta.hot) {
  import.meta.hot.accept()
}

if (import.meta.env.MODE === 'development') {
  // @ts-ignore
  window.axios = axios
}
