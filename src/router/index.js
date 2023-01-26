import Vue from 'vue'
import VueRouter from 'vue-router'
import SerialTabContainer from '../views/SerialTabContainer.vue'
import MainWindow from '../views/MainWindow.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MainWindow',
    component: MainWindow
  }
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
