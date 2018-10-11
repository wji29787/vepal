// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './assets/css/base.css'
import './element'
import App from './App'
import router from './router'
import axios from 'axios'
Vue.config.productionTip = false
// 引入axios
axios.defaults.baseURL = 'http://192.168.95.253:8085'
// axios.defaults.baseURL = 'http://localhost:8080'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
