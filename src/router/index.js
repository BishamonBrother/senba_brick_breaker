import { createRouter, createWebHashHistory } from 'vue-router'
import BrickBreaker from '@/components/BrickBreaker.vue'
import StartMenu from '@/components/StartMenu.vue'

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
  }
]

const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes
})

export default router