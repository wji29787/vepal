import Vue from 'vue'
import Router from 'vue-router'
import Vepal from '@/vepal/vepal'
import AddVepal from '@/vepal/addvepal'
import vepalMain from '@/vepal/main'

import Home from '@/home/Home'
// project
import Project from '@/pages/project/Project'
// import ProjectEdit from '@/pages/project/ProjectEdit'
import AddProject from '@/pages/project/AddProject'

// product
import Product from '@/pages/product/Product'
// import ProductEdit from '@/pages/product/ProductEdit'
import AddProduct from '@/pages/product/AddProduct'
import AddVersion from '@/pages/product/AddVersion'

// suit
import Suit from '@/pages/suit/SuitList'
import Login from '@/login/login'
import addSuit from '@/pages/suit/SuitEdit'

// vepal
import testVepal from '@/pages/vepal/testVepal'

//视图
import productIndexView from '@/pages/report/productIndex';
import pptview from '@/pages/report/pptview'
import suitProjectView from '@/pages/report/suitProject';
import suitProductView from '@/pages/report/suitProduct';
import projectProductView from '@/pages/report/projectProduct';
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
      component: Login,
      meta:{
        title:'登陆'
      }
    },
    //主页面
    {
      path:'/',
      redirect: 'Home'
    },
    {
      path:'/home',
      name:'Home',
      component:Home,
      children:[
        {
          path:'/',
          redirect: 'project'
        },
        {
          path: 'vepal',
          name: 'Vepal',
          component: Vepal,
          meta:{
            title:'图表展示'
          }
        },
        // 项目管理
        {
          path: 'project',
          name: 'project',
          component: Project,
          meta:{
            title:'项目管理'
          },

        },
        // 项目新增
        {
          path: 'project/addproject',
          name: 'project/addproject',
          component: AddProject,
          meta:{
            title:'新增项目'
          },
          props:{
            type:'add'
          }  
        },
         // 项目编辑
        {
          path: 'project/editproject',
          name: 'project/editproject',
          component: AddProject,
          meta:{
            title:'编辑项目'
          },
          props:{
            type:'edit'
          }  
        },
        // 产品管理
        {
          path: 'product',
          name: 'product',
          component: Product,
          meta:{
            title:'产品管理'
          }  
        },
        {
          path:'product/addproduct',
          name:'product/addproduct',
          component:AddProduct,
          meta:{
            title:'产品新增'
          }
        },
        {
          path:'product/addversion',
          name:'product/addversion',
          component:AddVersion,
          meta:{
            title:'版本新增'
          },
          props:{
            type:'add'
          }
        },
        {
          path:'product/editversion',
          name:'product/editversion',
          component:AddVersion,
          meta:{
            title:'版本编辑'
          },
          props:{
            type:'edit'
          }
        },
        // 套装管理
        {
          path: 'suit',
          name: 'Suit',
          component: Suit,
          meta:{
            title:'套装管理'
          }  
        },
        {
          path: 'addsuit',
          name: 'addSuit',
          component: addSuit,
          meta:{
            title:'套装管理'
          }  
        },
        {
          path:'testVepal',
          name:'testVepal',
          component:testVepal,
          meta:{
            title:'图标展示'
          }
        },{
          path: 'productindexview',
          name: 'productIndexView',
          component: productIndexView,
          meta: {
            title: '套装产品首页'
          }
        },{
          path:'suitprojectview',
          name: 'suitProjectView',
          component: suitProjectView,
          meta: {
            title: '套装项目报表'
          }
        },
        {
          path: 'projectproductview',
          name: 'projectProductView',
          component: projectProductView,
          meta: {
            title: '项目产品报表'
          }
        }
      ]
    },
    // 404 页面
    {
      path:'/404',
      component:()=>import('@/components/404')
    },
    // {
    //   path:'*',
    //   redirect: '404'
    // }

  ]
})
