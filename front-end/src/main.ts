import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.config.productionTip = false
export const SocketInstance =  socketio('http://127.0.0.1:3000');
export const GameSocket =  socketio('http://127.0.0.1:3000/test');

Vue.use(new VueSocketIO({
	debug: true,
	connection: SocketInstance
}))



Vue.prototype.$http = axios;
Vue.prototype.$public = GameSocket;
Vue.use(VueAxios, axios)

axios.defaults.baseURL = "http://" + location.hostname + ":" + 3000;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
