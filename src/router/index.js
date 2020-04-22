import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import FileList from '../views/FileList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'filelist',
    component: FileList
  },
  {
    path: '/filelist',
    name: 'home',
    component: Home
  },
]

const router = new VueRouter({
  routes
})

export default router
