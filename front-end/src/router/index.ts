import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Community from '../views/Community.vue';
import Login from '../views/Login.vue';
import Game from '../views/Game.vue';
import TWOFA from '../views/2FA.vue';
import Canvas from '../views/Canvas.vue';
import Speedy from '../views/Speedy.vue';
import axios from 'axios';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    name: 'Login',
    path: '/Login',
    component: Login
  },
  {
    name: 'Play',
    path: '/Play',
    component: Canvas
  },
  {
    name: 'Speedy',
    path: '/Speedy',
    component: Speedy
  },
  {
    name: '2FA',
    path: '/2FA',
    component: TWOFA
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
    }}).then(async (res) => {
      await axios.get('/user/me', {
        headers: {
          Authorization: token
      }}).then(res => {
        loggeIn = true;
      })
      .catch(error => {
        loggeIn = false;
      });
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
	// this.$socket.emit('disconnectUser');
    return next({ name: 'Login' });
  }
  else if (to.path === "/2FA" && to.query.id !== undefined)
  {
    localStorage.setItem("id", "?" + to.query.id);
    return next({ name: '2FA' });
  }
  else if (to.path === "/2FA")
  {
    return next();
  }
  verify().then(loggedIn => {
    if (to.path === "/Login" && !loggedIn)
      return next();
    else if (to.path === "/" && !loggedIn)
      return next({ name: 'Login' });
    else if (to.path === "/" && loggedIn)
      return next({ name: 'Game' });
    else if (to.path === "/Login" && loggedIn)
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
