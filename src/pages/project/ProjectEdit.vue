<template>
    <div class="extend-h-w">
               <el-container class="extend-h-w" direction = "vertical">
                        <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                             <h2 class = "sl-title">项目编辑</h2>
                        </el-row>
                        <el-container class="extend-h-w" direction = "vertical">
                            <el-row :gutter = "10">
                                 <el-col :lg = "4"  :md= "6">
                                      <el-input/></el-col>  
                                 <el-col :lg = "4"  :md= "6"> 
                                   <el-date-picker
                                    v-model="value1"
                                    class = "extend-w"
                                    type="date"
                                    placeholder="选择日期">
                                  </el-date-picker>
                                </el-col>  
                                 <el-col :lg = "3"  :md= "4"><el-button>搜索</el-button></el-col>    
                                 <el-col :span = "3" class="fr"><el-button class="fr" @click="addsuit">新增</el-button></el-col>    
                                 
                            </el-row>
                            <el-row type = "flex" class="extend-h-w">
                                  <el-table
                                        :data="tableData6"
                                        :span-method="objectSpanMethod"
                                        border 
                                        height = "98%"
                                        style="width: 100%; margin-top: 20px"
                                        v-scroll = "{el:'.el-table__body-wrapper',scrollfn:scrollfn}"
                                        >
                                        <el-table-column
                                            prop="id"
                                            label="ID"
                                            width="180">
                                        </el-table-column>
                                        <el-table-column
                                            prop="name"
                                            label="套装名称">
                                        </el-table-column>
                                        <el-table-column
                                            prop="amount1"
                                            label="日期">
                                        </el-table-column>
                                        <el-table-column
                                            prop="amount2"
                                            label="套装描述">
                                        </el-table-column>
                                        <el-table-column
                                            prop="amount3"
                                            width="200"
                                            label="操作">
                                            <template slot-scope="scope">
                                                  <el-button type="text" @click="productDown(scope.row)" size="small">Edit</el-button>
                                                  <el-button type="text" @click="productDown(scope.row)" size="small">Delete</el-button>
                                             </template>
                                        </el-table-column>
                                  </el-table> 
                                <!-- </el-scrollbar> -->
                       
                            </el-row>
                         </el-container >
               </el-container>
          
               <!-- 新增 -->
               <el-dialog
                  :visible="projectEdit.visible"
                  @close="projectEdit.visible=false"
                  :title = "projectEdit.title"
                  center
                  >
                  <el-container direction="vertical">
                    <el-row  class = "sl-row-item" :gutter = 20
                      >
                        <el-col class="text-r" :span = "4">套装名称:</el-col>
                        <el-col  :span = "20"><el-input size="small" v-model="projectEdit.projectName"></el-input></el-col>
                    </el-row>
                      <el-row  class = "sl-row-item" :gutter = 20
                      >
                        <el-col class="text-r" :span = "4">日期:</el-col>
                        <el-col :span = "20">
                          <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            class = "extend-w"
                            size="small"
                            >
                            </el-date-picker>
                        </el-col>
                      </el-row>
                      <el-row  class = "sl-row-item" :gutter = 20
                      >
                        <el-col class="text-r" :span = "4">描述:</el-col>
                        <el-col  :span = "20">
                          <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容">
                          </el-input>
                        </el-col>
                    </el-row>
                    <el-row class = "sl-row-item" :gutter = 20>
                       <el-col class="text-r" :span = "4">关联:</el-col>
                       <el-col class="" :span = "20">
                          <sl-selectcheck v-model = "checkObj" ></sl-selectcheck>
                       </el-col>
                    </el-row>
                  </el-container>
                  <div slot="footer" class ="sp-footer">
                    <el-button @click="projectEdit.visible=false">取 消</el-button>
                    <el-button type="primary">确 定</el-button>
                  </div>
               </el-dialog>
    </div>
</template>
<script>
import SelectCheck from '../../components/SelectCheck'
export default {
  name:'projectEdit',
  components:{
    'sl-selectcheck':SelectCheck
  },   
  data() {
    const item = {
          id: "12987122",
          name: "王小虎",
          amount1: "234",
          amount2: "3.2",
          amount3: 10
        }
    return {
      aa:'ddd',
      tableData6: [
        ...new Array(11).fill(item),
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
        },
        {
          id: "12987126",
          name: "王小虎",
          amount1: "539",
          amount2: "4.1",
          amount3: 15
        }
      ],
      projectEdit:{
        visible:false,
        projectName:'',
        title:"套装编辑"
      },
      checkObj:{},
      value1:''
    };
  },
  watch:{
    checkObj(val,vall){
      console.log(val,vall)
    }
  },
  mounted(){
    // console.log(this.checkObj)
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
    },
    addsuit(){
      this.projectEdit.visible = true
    },
    scrollfn(value){
      console.log(11)
    }
  }
};
</script>
<style scoped>
.fr{
  float: right;
}
.sl-item-h100{
  height: 1rem;
}
.sl-title{
  font-size: 20px;
  /* font-weight: bold; */
  font-family: "PingFang SC","微软雅黑";
}
.sl-row-item{
  margin: 0.1rem 0 ;
  
}
</style>


