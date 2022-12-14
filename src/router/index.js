import { createRouter, createWebHashHistory } from 'vue-router'
import BrickBreaker from '@/components/BrickBreaker.vue'
import StartMenu from '@/components/StartMenu.vue'
import Setting from '@/components/Setting.vue'
import Information from '@/components/Information.vue'

const routes = [
  {
    path: '/',
    name: 'startMenu',
    component: StartMenu
  },
  {
    path: '/bb',
    name: 'brickBreaker',
    component: BrickBreaker
  },
  {
    path: '/setting',
    name: 'setting',
    component: Setting
  },
  {
    path: '/information',
    name: 'information',
    component: Information
  }
]

const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes
})

export default router