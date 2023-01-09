import Vue from 'vue'
import VueRouter from 'vue-router'
import SerialTabContainer from '../views/SerialTabContainer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SerialTabContainer',
    component: SerialTabContainer
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
