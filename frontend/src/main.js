import Vue from 'vue'
import App from './App.vue'
import io from 'socket.io-client';
const socket = io('http://localhost:3001'); //연결하고자 하는 서버의 url. 백엔드 쪽 socket port와 동일해야 함

Vue.prototype.$socket = socket; //socket을 vue 인스턴스 변수로 등록하여 컴포넌트에서 사용할 수 있도록 함

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
