<template>
    <div style="height:100%;width:100%;">
        <el-container class = "container">  
            <el-header >
                title
                </el-header>       
            <el-container>
                <el-aside>
                      <sl-menu class = "sl-menu-container">
                          <div slot = "items">
                                <ul class = "sl-meun-item">
                                    <li>新增套装</li>
                                    <li>设置</li>
                                    <li>图形</li>
                                </ul>
                          </div>
                          </sl-menu>  
                </el-aside>
                <el-main>
                    <sl-vepal/>
                   
                    
                </el-main>
            </el-container>
            
            </el-container>           
    </div>    
</template>
<script>
import menu from "./menu";
import vepal from "./vepal";

export default {
  name: "vepalmain",
  components: {
    "sl-vepal": vepal,
    "sl-menu": menu
  },
  data() {
    return {
      active: "active"
    };
  },
  created() {
   
  },
  methods: {
    itemClick() {}
  }
};
</script>
<style>
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
</style>

