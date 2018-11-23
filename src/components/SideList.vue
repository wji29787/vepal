<template>
    <div class="extend-h-w">
         <el-menu
            ref = "elMenu" 
            :default-active  = "activeIndex"
            class = "extend-h-w"
            router
            @select = "handleSelect"
            @open = "handleOpen"
            @close = "handleClose">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>产品管理</span>
                    </template>
                    <el-menu-item index="1-1"
                        :route = "{name:'product'}"
                    >产品列表</el-menu-item>
                    <el-menu-item index="1-2"
                        :route = "{name:'product/addproduct'}"
                    >产品新增</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                     <template slot="title">
                         <i class="el-icon-menu"></i>
                         <span>项目管理</span>
                      </template> 
                    <el-menu-item index="2-1"
                      :route = "{name:'project'}"
                      > 项目列表</el-menu-item>
                      <el-menu-item index="2-2"
                      :route = "{name:'project/addproject'}"
                      > 项目新增</el-menu-item>     
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-document"></i>
                        <span>套装管理</span>
                    </template>         
                    <el-menu-item index="3-1"
                     :route = "{name:'suit'}"
                    >套装列表</el-menu-item>
                    <el-menu-item index="3-2"
                     :route = "{name:'suit/addsuit'}"
                    >套装新增</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>报表管理</span>
                    </template>
                    <el-menu-item index="4-1"
                    :route="{name: 'report/suitProjectView'}">
                    套装项目报表
                    </el-menu-item>
                    <el-menu-item index="4-2"
                    :route="{name: 'report/suitProductView'}">
                    套装产品报表
                    </el-menu-item>
                    <el-menu-item index="4-3"
                    :route="{name: 'report/vepal'}">
                    套装展示
                    </el-menu-item>
                    <el-menu-item index="4-4"
                    :route="{name: 'report/pptView'}">
                    横图
                    </el-menu-item>
                    <el-menu-item index="4-5"
                    :route="{name: 'report/projectProductView'}">
                    项目产品报表
                    </el-menu-item>
                </el-submenu>
                 <!-- <el-submenu index="5">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>系统设置</span>
                    </template>
                    <el-menu-item index="5-1"
                    >样式设置</el-menu-item>
                </el-submenu> -->
        </el-menu>
    </div>
</template>
<script>
 const routeMap = {
     'product':'1-1',
     'product/addproduct':'1-2',
     'product/editversion':'1-1',
     'product/addversion':'1-1',
     'project':'2-1',
     'project/addproject':'2-2',
     'project/editproject':'2-1',
     'suit':'3-1',
     'suit/addsuit':'3-2',
     'suit/editsuit':'3-1',
     'report/vepal':'4-3',
     'report/pptView':'4-4',
     'report/uitProductView':'4-2',
     'report/suitprojectview':'4-1',
     'report/projectproductview':'4-5',
 }
export default {
    name:'sl-sides',
    data(){
        return {
            activeIndex:'4-4'
        }
    },
    watch:{
        '$route'(){
            // console.log(11)
            this.currentRoute()
        }
    },
    created(){
        //获取当前路由
       this.currentRoute()
    },
    mounted(){
        //  console.log(this.$route)
    },
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleSelect(index,indexPath){
      },
       // 获取当前要激活的选项
      currentRoute(){
          let path = this.$route.path;
        //   console.log(this.$route)
          let keys = Object.keys(routeMap);
          let sign = keys.some(key=>{
              let str = `^/home/${key}$`   
              let reg = new RegExp(str)
              if(reg.test(path)){
                  this.activeIndex = routeMap[key]
                  return true
              }else{
                  return false
              }
          })

      }
    }
}
</script>
<style scoped>
/* .extend-h-w{
    background: #f5f5f5;
} */
/* .el-menu-item{
    background: #f9f9f9;
}
.el-menu-item.is-active{
    background: #f9f9f9;
} */
</style>
