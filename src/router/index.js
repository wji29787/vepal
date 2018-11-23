import Vue from 'vue'
import Router from 'vue-router'


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
import Vepal from '@/pages/vepal/vepal'

//视图
import pptView from '@/pages/report/pptview'
import suitProjectView from '@/pages/report/suitProject';
import suitProductView from '@/pages/report/suitProduct';
import projectProductView from '@/pages/report/projectProduct';
Vue.use(Router)

export default new Router({
  routes: [
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
          redirect: 'report/pptView'
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
          name: 'suit',
          component: Suit,
          meta:{
            title:'套装管理'
          }  
        },
        // 套装新增
        {
          path: 'suit/addsuit',
          name: 'suit/addsuit',
          component: addSuit,
          meta:{
            title:'套装新增'
          },
          props:{
            type:'add'
          }  
        },
        // 套装编辑
        {
          path: 'suit/editsuit',
          name: 'suit/editsuit',
          component: addSuit,
          meta:{
            title:'套装编辑'
          },
          props:{
            type:'edit'
          }  
        },
        // 报表管理
        {
          path:'report/vepal',
          name:'report/vepal',
          component:Vepal,
          meta:{
            title:'图表展示'
          }
        },{
          path:'report/pptView',
          name:'report/pptView',
          component:pptView,
          meta:{
            title:'ppt横图'
          }
        },{
          path:'report/suitprojectview',
          name: 'report/suitProjectView',
          component: suitProjectView,
          meta: {
            title: '套装项目报表'
          }
        },{
          path: 'report/suitProductView',
          name: 'report/suitProductView',
          component: suitProductView,
          meta: {
            title: '套装产品报表'
          }
        },{
          path: 'report/projectproductview',
          name: 'report/projectProductView',
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
