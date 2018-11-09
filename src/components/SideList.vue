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
                        <span>产品</span>
                    </template>
                    <el-menu-item index="1-1">产品管理</el-menu-item>
                    <el-menu-item index="1-2">发布版本相关</el-menu-item>
                    <el-menu-item index="1-3">发部项目相关</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                     <template slot="title">
                         <i class="el-icon-menu"></i>
                         <span>项目</span>
                      </template> 
                    <el-menu-item index="2-1"
                      :route = "{path:'project'}"
                      > 项目管理</el-menu-item>    
                    <el-menu-item index="2-2"
                        :route = "{path:'projectedit'}"
                    > 项目列表</el-menu-item>
                    <el-menu-item index="2-3"> 大部项目相关</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-document"></i>
                        <span>套装</span>
                    </template>         
                    <el-menu-item index="3-1">套装管理</el-menu-item>    
                    <el-menu-item index="3-2">套装产品表</el-menu-item>
                    <el-menu-item index="3-3">套装项目表</el-menu-item>
                </el-submenu>
                <el-menu-item index="4">
                    <i class="el-icon-setting"></i>
                    <span slot="title">设置</span>
                </el-menu-item>
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

</style>
