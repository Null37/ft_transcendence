import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Community from '../views/Community.vue';
import Login from '../views/Login.vue';
import Game from '../views/Game.vue';
import axios from 'axios';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/Login',
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

router.beforeEach(async (to, from, next) => {

  if (to.path === "/Community" && to.query.token !== undefined)
  {
    console.log(to.query.token);
    axios.defaults.headers.common['Authorization'] = "Bearer " + to.query.token;

    
    axios.get('/verify')
      .then(function (response) {
        // handle success
        console.log(response);
        next("/Community");
      })
      .catch(function (error) {
        // handle error
        console.log(error);
    })

    next("/");
    
  }
  else if (to.path === "/" && axios.defaults.headers.common['Authorization'] !== "")
    next("/Community");
  else if (to.path === "/")
    next("/Login");
  else if (to.path === "/Logout")
  {
    axios.defaults.headers.common['Authorization'] = "";
    next("/");
  }
  next();
})



export default router
