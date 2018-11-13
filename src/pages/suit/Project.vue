<template>
    <div>
               <el-container class="extend-h-w" direction = "vertical">
                   <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                             <h2 class = "sl-title">发布版本的项目及套装表</h2>
                    </el-row>
                     
                          <el-container class="extend-h-w" direction = "vertical">
                            <el-row :gutter = "10">
                                 <el-col :lg = "4"  :md= "6">
                                      <el-input/></el-col>  
                                 <el-col :lg = "4"  :md= "6"> <el-input/></el-col>  
                                 <el-col :span = "2"><el-button>搜索</el-button></el-col>    
                                 <el-col :span = "3" ><el-button>导出</el-button></el-col>    
                                 
                            </el-row>
                            <el-row type = "flex" class="extend-h-w">
                                    <el-table
                                        :data="tableData6"
                                        :span-method="objectSpanMethod"
                                        border 
                                        height = "100%"
                                        style="width: 100%; margin-top: 20px">
                                        <el-table-column
                                            prop="id"
                                            label="ID"
                                            width="180">
                                        </el-table-column>
                                        <el-table-column
                                            prop="name"
                                            label="姓名">
                                        </el-table-column>
                                        <el-table-column
                                            prop="amount1"
                                            label="数值 1（元）">
                                        </el-table-column>
                                        <el-table-column
                                            prop="amount2"
                                            label="数值 2（元）">
                                        </el-table-column>
                                        <el-table-column
                                            prop="amount3"
                                            label="数值 3（元）">
                                        </el-table-column>
                                    </el-table> 
                       
                            </el-row>
                         </el-container >
               </el-container>
          

    </div>
</template>
<script>
export default {
  data() {
    return {
      tableData6: [
        {
          id: "12987122",
          name: "王小虎",
          amount1: "234",
          amount2: "3.2",
          amount3: 10
        },
        {
          id: "12987123",
          name: "王小虎",
          amount1: "165",
          amount2: "4.43",
          amount3: 12
        },
        {
          id: "12987124",
          name: "王小虎",
          amount1: "324",
          amount2: "1.9",
          amount3: 9
        },
        {
          id: "12987125",
          name: "王小虎",
          amount1: "621",
          amount2: "2.2",
          amount3: 17
        },
        {
          id: "12987126",
          name: "王小虎",
          amount1: "539",
          amount2: "4.1",
          amount3: 15
        }
      ]
    };
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>
<style scoped>
.sl-item-h100{
  height: 1rem;
}
.sl-title{
  font-size: 20px;
  /* font-weight: bold; */
  font-family: "PingFang SC","微软雅黑";
}
</style>


