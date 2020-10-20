import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.addRoute({
  path: '/',
  redirect: '/TableList'
})

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.router = router
}

export default router
