import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import NotFound from '@/components/404'
import Vepal from '@/vepal/vepal'
import AddVepal from '@/vepal/addvepal'
import vepalMain from '@/vepal/main'

import { homedir } from 'os';
import Home from '@/home/Home'
// project
import Project from '@/pages/project/Project'
import ProjectEdit from '@/pages/project/ProjectEdit'

// product
import Product from '@/pages/product/Product'

// suit
import Suit from '@/pages/suit/Suit'
// import Login from '@/login/login'
const Login ={
  template:`<div>login</div>`
}


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/vepal',
      name: 'Vepal',
      component: Vepal
    },
    {
      path: '/addvepal',
      name: 'AddVepal',
      component: AddVepal
    },
    {
      path :'/main',
      name:'vepalMain',
      component:vepalMain
    },
    //登陆页面
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    //主页面
    {
      path:'/',
      redirect: 'home'
    },
    {
      path:'/home',
      name:'Home',
      component:Home,
      children:[
        {
          path:'/',
          redirect: 'vepal'
        },
        {
          path: 'vepal',
          name: 'Vepal',
          component: Vepal
        },
        {
          path: 'project',
          name: 'Project',
          component: Project  
        },
        {
          path: 'projectedit',
          name: 'ProjectEdit',
          component: ProjectEdit
        },
        {
          path: 'product',
          name: 'Product',
          component: Product
        },
        {
          path: 'suit',
          name: 'Suit',
          component: Suit
        },
      ]
    },
    // 404 页面
    {
      path:'/404',
      component:()=>import('@/components/404')
    },
    {
      path:'*',
      redirect: '404'
    }

  ]
})
