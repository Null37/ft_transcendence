import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Community from '../views/Community.vue';
import Login from '../views/Login.vue';
import Game from '../views/Game.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/Community',
    component: Community
  },
  {
    path: '/Game',
    component: Game
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
