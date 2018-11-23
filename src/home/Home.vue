<template>
    <div class="extend-h-w">
        <el-container class="extend-h-w"> 
             <!--header  -->
            <el-header>
                vepal.信息系统
                <span class="version">v1.0</span>
                <span class = "fr title">{{title}}</span>
            </el-header>  
            <!-- main -->
            
                    <!-- <sl-vepal/> -->
                   <el-container class="extend-h-w">
                        <!-- left -->
                        <el-aside width = "2rem">
                            <sl-sides/>
                        </el-aside>
                        <!-- right -->
                        <el-main>
                            <router-view></router-view>
                        </el-main>
                    </el-container>                  
        </el-container>           
    </div>    
</template>
<script>
// import menu from "./menu";
// import vepal from "./vepal";
import SideList from '../components/SideList'
export default {
  name: "vepalmain",
  components: {
      'sl-sides':SideList
    // "sl-vepal": vepal,
    // "sl-menu": menu
  },
  data() {
    return {
      active: "active"
    };
  },
  computed:{
    title(){
      return this.$store.state.title
    }
  },
  created() {},
  methods: {
    // itemClick() {}
  }
};
</script>
<style>
.extend-h-w{
    height: 100%;
    /* width: 100%; */
}
.container {
  /* border:  1px solid red */
  height: 100%;
  width: 100%;
}
.sl-menu-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-left: 1rem;
}
</style>
<style scoped>
.sl-meun-item li {
  padding: 0.1rem 0;
  cursor: pointer;
  font-size: 0.18rem;
}
.sl-meun-item li.active {
  color: #409eff;
}
.sl-meun-item li:hover {
  color: #409eff;
}
.el-header{
  font-size:0.3rem;
  line-height:0.5rem;
  background:#495A80;
  font-family:微软雅黑;
  color:#fff;
}
.version{
  font-size:0.14rem;
}
.title{
   font-size:0.2rem;
}
</style>

