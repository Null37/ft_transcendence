import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

Vue.config.productionTip = false
export const SocketInstance =  socketio('http://localhost:3000');
Vue.use(new VueSocketIO({
	debug: true,
	connection: SocketInstance
}))
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
