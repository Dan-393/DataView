import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式
import './assets/css/global.less'
import './assets/lib/theme/chalk'
// 引入全局echarts
import echarts from 'echarts'
import axios from 'axios'
// 请求基准路径 都需要加上api 
axios.defaults.baseURL = 'http://10.22.48.255:8080/api/'
// 全局挂载
Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
