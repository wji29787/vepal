import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Vepal from '@/vepal/vepal'
// import Login from '@/login/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/vepal',
      name: 'Vepal',
      component: Vepal
    }
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login
    // }
  ]
})
