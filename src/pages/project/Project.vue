<template>
    <div  class="extend-h-w">
               <el-container class="extend-h-w" direction = "vertical">
                   <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                             <h2 class = "sl-title">项目管理列表</h2>
                    </el-row>
                     
                          <el-container class="extend-h-w" direction = "vertical">
                            <el-row :gutter = "10">
                                <el-col :lg = "4"  :md= "6"><el-input placeholder="请输入项目名称" v-model = "searchObj.name" ></el-input></el-col>  
                                <el-col :lg = "4"  :md= "5"><el-input placeholder="请输入需求提出人" v-model = "searchObj.needPerson"></el-input></el-col> 
                                <el-col :lg = "3"  :md= "4" >
                                  <el-select clearable v-model = "searchObj.typeId" placeholder="项目类型">
                                      <el-option
                                        v-for="item in typeList"
                                        :key="item.projecttypeId"
                                        :label="item.typeName"
                                        :value="item.projecttypeId">
                                      </el-option>
                                    </el-select>
                                  
                                  </el-col>  
                                 <el-col :lg = "3"  :md= "4">
                                    <el-select clearable v-model = "searchObj.priorityId" placeholder="优先级">
                                        <el-option
                                          v-for="item in priorityList"
                                          :key="item.priorityId"
                                          :label="item.priorityName"
                                          :value="item.priorityId">
                                        </el-option>
                                      </el-select>
                                   
                                   </el-col>  
                                  
                                 <el-col :span = "1.5"><el-button @click = "searchData()">搜索</el-button></el-col>    
                                 <el-col :span = "1.5" ><el-button>导出</el-button></el-col>    
                                 <el-col :span = "2"  class="fr"><el-button class="fr">新增</el-button></el-col>    
                                 
                            </el-row>
                            <br>
                            <el-row :gutter = "10">
                               <el-col :lg = "4"  :md= "6"> 
                                    <el-date-picker
                                      class = "extend-w"
                                      type="date"
                                      placeholder="开始时间"
                                      value-format = "yyyy-MM-dd"
                                      v-model = "searchObj.startTime"
                                      >
                                    </el-date-picker>
                                </el-col> 
                                <el-col :lg = "4"  :md= "6"> 
                                    <el-date-picker
                                      class = "extend-w"
                                      type="date"
                                      value-format = "yyyy-MM-dd"
                                      placeholder="结束时间"
                                       v-model = "searchObj.finshTime"
                                      >
                                    </el-date-picker>
                                </el-col>   
                            </el-row>
                            <el-row type = "flex" class="extend-h-w">
                                    <el-table
                                        :data="list"
                                        :span-method="objectSpanMethod"
                                        border 
                                        height = "98%"
                                        header-cell-class-name = ""
                                        v-scroll = "{el:'.el-table__body-wrapper',scrollfn:scrollfn}"
                                        @header-click = "handleClickheader"
                                        style="width: 100%; margin-top: 20px">
                                        <el-table-column
                                            prop="id"
                                            label="序号"
                                            type = "index"
                                            width="80">
                                        </el-table-column>
                                        <el-table-column
                                            prop="typeName"
                                            width="100"
                                            label="所属类型">
                                        </el-table-column>
                                        <el-table-column
                                            prop="name"
                                            label="项目名称">
                                          
                                        </el-table-column>
                                        <el-table-column
                                            prop="priorityName"
                                            width="100"
                                            label="优先级">
                                            <template slot="header" slot-scope="slot">
                                              <span :class = "[searchObj.prioritySort?'el-icon-sort-down':'el-icon-sort-up']">优先级11</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="needperson"
                                             width="100"
                                            label="需求提出人">
                                        </el-table-column>
                                         <el-table-column
                                            prop="starttime"
                                            :formatter = "formatTime"
        
                                            label="开始时间">
                                        </el-table-column>
                                         <el-table-column
                                            prop="finshtime"
                                            :formatter = "formatTime"
                                            label="计划完成时间">
                                        </el-table-column>
                                        <el-table-column
                                            prop="chargeperson"
                                              width="100"
                                            label="项目负责人">
                                        </el-table-column>
                                        <el-table-column
                                            prop="delaydays"
                                             width="120"
                                            label="项目延迟天数">
                                        </el-table-column>
                                        <el-table-column
                                             prop="amount3"
                                             width="150"
                                             label="操作">
                                            <template slot-scope="scope1">
                                                  <el-button type="text" @click="productDown(scope1.row)" icon = "el-icon-tickets" ></el-button>
                                                  <el-popover
                                                      placement="left"
                                                      width="160"
                                                      v-model = "scope1.row.visible"
                                                     >
                                                      <p>这是一段内容这是一段内容确定删除吗？</p>
                                                      <div style="text-align: right; margin: 0">
                                                        <el-button size="mini" type="text" @click = "delcancle(scope1)">取消</el-button>
                                                        <el-button type="primary" size="mini" @click = "delsure(scope1)">确定</el-button>
                                                      </div>
                                                      <el-button slot="reference" type="text"  class = "textColor" @click= "deletebtn(scope1)" icon = "el-icon-delete"></el-button>
                                                  </el-popover>
                                             </template>
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
      visible2: -1,
      bscroll: true, // 是否加载
      pageNo: 1, // 初始加载页数
      pageSize: 10, // 初始每页数据数
      lastPage: false, //最后一页
      moveY: 0, // 滚动元素的总告诉
      scrollctx: null, // 滚动元素的上下文
      searchObj: {
        priorityId: '',  // 优先级
        typeId :'',    // 类型
        needPerson:'',  // 需求人
        name:'',       // 项目名
        startTime:'',  // 开始时间
        finshTime:'',  // 结束时间
        prioritySort:true, // 排序   asc desc
        typeSort:true,     // 类型排序 
        startTimeSort:true,  // 开始时间排序
        finishTimeSort:true, // 结束时间排序
      },
      typeList:[],
      priorityList:[],
      options: [
        { name: "MVP1", value: "value1" },
        { name: "MVP2", value: "value2" },
        { name: "MVP3", value: "value3" }
      ],
      list: [],
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
  mounted() {
    this.getTypeList()
    this.getPriorityList()
    this.getData();
    // console.log(11)
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (rowIndex % 2 === 0) {
      //   if (columnIndex === 0) {
      //     return [1, 2];
      //   } else if (columnIndex === 1) {
      //     return [0, 0];
      //   }
      // }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0) {
      //   if (rowIndex % 2 === 0) {
      //     return {
      //       rowspan: 2,
      //       colspan: 1
      //     };
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     };
      //   }
      // }
    },
    getData(pageNo) {
      if (!this.bscroll) {
        return;
      }
      this.bscroll = false;
      //  typeId 、needPerson、name、startTime、finshTime、prioritySort、typeSort、startTimeSort、finishTimeSort
      let searchObj = this.searchObj 
      let obj = {
        pageNo: pageNo ? pageNo : 1,
        pageSize: this.pageSize,
        // typeId :''||searchObj.typeId||'',    // 类型
        //  :searchObj.needPerson,  // 需求人
        // name:searchObj.name,       // 项目名
        // startTime:searchObj.startTime,  // 开始时间
        // finshTime:searchObj.finshTime,  // 结束时间
        prioritySort:searchObj.prioritySort?'asc':'desc', // 排序
        typeSort:searchObj.typeSort ? 'asc':'desc',     // 类型排序 
        startTimeSort:searchObj.startTimeSort ? 'asc':'desc',  // 开始时间排序
        finishTimeSort:searchObj.finishTimeSort ? 'asc':'desc', // 结束时间排序
      };
      searchObj.typeId && (obj.typeId = searchObj.typeId)
      searchObj.priorityId && (obj.priorityId = searchObj.priorityId)
      searchObj.needPerson && (obj.needPerson = searchObj.needPerson)
      searchObj.name && (obj.name = searchObj.name)
      searchObj.startTime && (obj.startTime = searchObj.startTime)
      searchObj.finshTime && (obj.finshTime = searchObj.finshTime)
    
      this.$http.post("/api/pjc/project/findAllProject", obj, res => {
        // 使可以加载
        setTimeout(() => {
          this.bscroll = true;
        }, 350);

        if (res.status === 200) {
          if (res.data.code === 200) {
            let data = res.data.data;
            let list = data.list;
            // 最后一页
            if (list && list.length < this.pageSize) {
              this.lastPage = true;
            }
            // 添加 删除按钮属性
            list.forEach(t => {
              t.visible = false;
            });
             // 搜索或者加载 
            // if(!pageNo){
                // 搜索时 重置数据
               
                
            // }

            if (this.list.length === 0) {
              this.list = list;
            } else {
              this.list = this.list.concat(list);
            }
          }
        }
      });
    },
    searchData(){
      this.list = []
      this.moveY = 0
      this.pageNo = 1
      this.lastPage =false;
      this.getData()
    },
    handleClickheader(column, event){
      console.log(column,event)
      let propertys =['starttime','finshtime','priorityName','typeName'];
      let property = column['property']
      let searchObj = this.searchObj
      // if(propertys.includes(property)){
          // prioritySort:true, // 排序   asc desc
        //typeSort:true,     // 类型排序 
        //startTimeSort:true,  // 开始时间排序
        //finishTimeSort:true,

      // } 
       if(!propertys.includes(property)){
        
         return ;
       } 
      switch(property){
        case 'starttime':
          this.searchObj.startTimeSort = !searchObj.startTimeSort;
          break;
        case 'finshtime':
          this.searchObj.finishTimeSort = !searchObj.finishTimeSort;
          break;  
        case 'priorityName':
          this.searchObj.prioritySort = !searchObj.prioritySort;
          break;
        case 'typeName':
          this.searchObj.typeSort = !searchObj.typeSort;
          break;   
      }
     
       this.list = []
          this.moveY = 0
          this.pageNo = 1
          this.lastPage =false;
          this.getData() 

    },
    scrollfn(ctx, val) {
      if (this.lastPage) return;
      if (!this.bscroll) return;
      this.ctx = ctx;
      if (this.moveY < val) {
        this.moveY = val;
        this.pageNo += 1;
        this.getData(this.pageNo);
      }
    },

    /**
     * 优先级列表
     *  
     */
     getTypeList(){
       this.$http.get('api/pjc/project/findAllProjectType',res=>{
       
            if(res.status ===200){
              if(res.data.code ===200){
                  this.typeList = res.data.data
                  
              }
            }
       })
     },

    /**
     * 所属类型列表
     *   
     */
    getPriorityList(){
       this.$http.get('dev/project/findAllPriority',res=>{
          if(res.status===200){
              if(res.data.code ===200){
                 this.priorityList = res.data.data
              }
            }
       })
     },
    // 删除按钮
    deletebtn(value) {
      value.row.visible = true;
    },
    delcancle(value) {
      value.row.visible = false;
    },
    delsure(value) {
      value.row.visible = false;
    },
    /**
     * 格式化事件
     */
    formatTime(row, column, cellValue, index) {
      if (cellValue) {
      }
      return this.$moment(cellValue).format("YYYY-MM-DD");
      // return this.$moment(cellValue).format("YYYY-MM-DD h:mm:ss");
    }
  }
};
</script>
<style scoped>
.sl-item-h100 {
  height: 1rem;
}
.sl-title {
  font-size: 20px;
  /* font-weight: bold; */
  font-family: "PingFang SC", "微软雅黑";
}
.fr {
  float: right;
}
</style>


