// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './assets/css/base.css'
import './element'
import './assets/css/common.css'
import App from './App'
import router from './router'

// store Vuex
import Vuex from 'vuex'
import storejs from './model/store'
Vue.use(Vuex)
const store = new Vuex.Store(storejs)

// 全局 路由 导航前回调
router.beforeEach((to, from, next) => {
  
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next()
})

Vue.config.productionTip = false
// 引入axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
