<template>
    <div class="extend-h-w">
        <el-container class="extend-h-w" direction = "vertical">
            <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                 <h2 class = "sl-title">套装产品报表</h2>
             </el-row>
               <el-container class="extend-h-w" direction = "vertical">
                    <el-row :gutter = "10">
                                <el-col :lg = "3"  :md= "6">
                                    <el-select clearable placeholder="请选择产品">
                                     </el-select>
                                </el-col>  
                                <el-col :lg = "3"  :md= "5">
                                     <el-select clearable placeholder="请选择项目">
                                     </el-select>
                                </el-col> 
                                <el-col :lg = "3"  :md= "4" >
                                  <el-select clearable placeholder="请选择套装">
                                      <!-- <el-option
                                        v-for="item in typeList"
                                        :key="item.projecttypeId"
                                        :label="item.typeName"
                                        :value="item.projecttypeId">
                                      </el-option> -->
                                    </el-select>
                                  </el-col>  
                                 <el-col :span = "1.5"><el-button>搜索</el-button></el-col>    
                                 <el-col :span = "1.5" ><el-button>导出</el-button></el-col>    
                            </el-row>
                            <el-row type = "flex" class="extend-h-w">
                             <el-table
                                :data="list"
                                border
                                style="width: 100%">
                             <el-table-column
                                label="序号"
                                width="80">
                            </el-table-column>
                            <el-table-column
                                label="套装名称"
                                width="80">
                            </el-table-column>

                            </el-table>
                            </el-row>
               </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  }
};
</script>

<style scoped>
.sl-item-h100 {
  height: 1rem;
}
.sl-title {
  font-size: 20px;
  font-family: "PingFang SC", "微软雅黑";
}
</style>