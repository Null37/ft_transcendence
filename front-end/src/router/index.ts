import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Community from '../views/Community.vue';
import Login from '../views/Login.vue';
import Game from '../views/Game.vue';
import axios from 'axios';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    name: 'Login',
    path: '/Login',
    component: Login
  },
  {
    name: 'Community',
    path: '/Community',
    component: Community
  },
  {
    name: 'Game',
    path: '/Game',
    component: Game
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

async function verify() {
  const token = localStorage.getItem('token');
  var loggeIn = false;
  if (token) {
    await axios.get('/verify', {
      headers: {
        Authorization: token
    }}).then(res => {
      loggeIn = true;
    })
    .catch(error => {
      loggeIn = false;
    });
  }
  return (loggeIn);
}

router.beforeEach(async (to, from, next) => {
  if (to.path === "/Logout")
  {
    localStorage.removeItem("token");
    return next({ name: 'Login' });
  }
  verify().then(loggedIn => {
    if (to.path === "/Login" && !loggedIn)
      return next();
    else if (to.path === "/" && !loggedIn)
      return next({ name: 'Login' });
    else if (to.path === "/" && loggedIn)
      return next({ name: 'Game' });
    else if (to.path === "/Game" && to.query.token !== undefined)
    {
      localStorage.setItem("token", "Bearer " + to.query.token);

      return next({ name: 'Game' });
    }
    else if (!loggedIn)
      return next({ name: 'Login' });
    next();
  })
})



export default router
