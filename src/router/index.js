import Vue from 'vue'
import Router from 'vue-router'
import Vepal from '@/vepal/vepal'
import AddVepal from '@/vepal/addvepal'
import vepalMain from '@/vepal/main'

import Home from '@/home/Home'
// project
import Project from '@/pages/project/Project'
import ProjectEdit from '@/pages/project/ProjectEdit'
import AddProject from '@/pages/project/AddProject'

// product
import Product from '@/pages/product/Product'
import ProductEdit from '@/pages/product/ProductEdit'
import AddProduct from '@/pages/product/AddProduct'
import AddVersion from '@/pages/product/AddVersion'

// suit
import Suit from '@/pages/suit/SuitList'
import Login from '@/login/login'
import addsuit from '@/pages/suit/SuitEdit'

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
          name: 'Project',
          component: Project,
          meta:{
            title:'项目管理'
          }  
        },
        // 项目管理
        {
          path: 'addproject',
          name: 'addproject',
          component: AddProject,
          meta:{
            title:'新增项目'
          },
          props:{
            type:'add'
          }  
        },
        {
          path: 'editproject',
          name: 'editproject',
          component: AddProject,
          meta:{
            title:'编辑项目'
          },
          props:{
            type:'edit'
          }  
        },
        {
          path: 'projectedit',
          name: 'ProjectEdit',
          component: ProjectEdit
        },
        // 产品管理
        {
          path: 'product',
          name: 'Product',
          component: Product,
          meta:{
            title:'产品管理'
          }  
        },
        {
          path:'addproduct',
          name:'addproduct',
          component:AddProduct,
          meta:{
            title:'产品新增'
          }
        },
        {
          path:'addversion',
          name:'addversion',
          component:AddVersion,
          meta:{
            title:'版本新增'
          },
          props:{
            type:'add'
          }
        },
        {
          path:'editversion',
          name:'editversion',
          component:AddVersion,
          meta:{
            title:'版本编辑'
          },
          props:{
            type:'edit'
          }
        },
        {
          path: 'productEdit',
          name: 'productEdit',
          component: ProductEdit
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
          name: 'addsuit',
          component: addsuit,
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
    {
      path:'*',
      redirect: '404'
    }

  ]
})
