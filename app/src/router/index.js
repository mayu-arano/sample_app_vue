import { createRouter, createWebHistory } from 'vue-router'
import OrderView from '../views/OrderView.vue'
import HistoryView from '../views/HistoryView.vue'
import SettingView from '../views/SettingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'order',
      component: OrderView
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingView
    }
  ]
})

export default router
