<template>
    <div class="extend-h-w">
         <el-menu
            default-active ="2-1"
            class = "extend-h-w"
            router
            @open = "handleOpen"
            @close = "handleClose">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>产品管理</span>
                    </template>
                    <el-menu-item index="1-1"
                        :route = "{path:'product'}"
                    >产品列表</el-menu-item>
                    <!-- <el-menu-item index="1-2"
                        :route = "{path:'addproduct'}"
                    >产品新增</el-menu-item> -->
                     <!-- <el-menu-item index="1-3"
                        :route = "{path:'productEdit'}"
                    >版本新增</el-menu-item> -->
                </el-submenu>
                <el-submenu index="2">
                     <template slot="title">
                         <i class="el-icon-menu"></i>
                         <span>项目管理</span>
                      </template> 
                    <el-menu-item index="2-1"
                      :route = "{path:'project'}"
                      > 项目列表</el-menu-item>    
                    <!-- <el-menu-item index="2-2"
                        :route = "{path:'projectedit'}"
                    > 项目新增</el-menu-item> -->
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-document"></i>
                        <span>套装管理</span>
                    </template>         
                    <el-menu-item index="3-1"
                     :route = "{path:'suit'}"
                    >套装列表</el-menu-item>    
                    <el-menu-item index="3-2"
                    :route = "{path:'addsuit'}"
                    >套装新增</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>报表管理</span>
                    </template>
                    <!-- <el-menu-item index="4-1"
                     :route="{path:'suitproductview'}"
                    >套装产品报表</el-menu-item> -->
                    <el-menu-item index="4-2"
                    :route = "{path:'vepal'}"
                    >套装产品竖图</el-menu-item>
                     <el-menu-item index="4-3"
                     :route = "{path:'pptview'}"
                    >套装产品横图</el-menu-item>
                        <!-- <el-menu-item index="4-4"
                    >套装项目报表</el-menu-item>
                        <el-menu-item index="4-5"
                    >项目产品报表</el-menu-item> -->
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
export default {
    name:'sl-sides',
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
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
