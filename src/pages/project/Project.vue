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
                                 <el-col :span = "2"  class="fr"><el-button class="fr" @click="addProject">新增</el-button></el-col>    
                                 
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
                              <!-- :formatter = "formatter(item,index)"  
                                      @header-click = "handleClickheader"
                                      :label= "item.label" 
                               -->
                                    <el-table
                                        :data="list"
                                        :span-method="objectSpanMethod"
                                        border 
                                        height = "98%"
                                        header-cell-class-name = ""
                                        v-scroll = "{el:'.el-table__body-wrapper',scrollfn:scrollfn}"
                                        style="width: 100%; margin-top: 20px">
                                        <el-table-column
                                            v-for = "(item, index) in renderTableList" 
                                            :key = "index"
                                            :width = "item.width" 
                                            :render-header="customRenderH(item,index)"          
                                            >
                                            <template slot-scope="scope1">
                                                  <template v-if = "index === 9">
                                                      <el-button type="text" @click="editProject(scope1.row)" icon = "el-icon-tickets" ></el-button>
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
                                                  <template v-else-if = "index === 0">
                                                    {{scope1['$index']+1}}
                                                  </template>
                                                  <template v-else>
                                                      {{formatter(item,index,scope1)}}
                                                  </template>
                                             </template>
                                             
                                              
                                        </el-table-column>
                                    </el-table> 
                       
                            </el-row>
                         </el-container >
               </el-container>
          

    </div>
</template>
<script>
import tableList from "./projectTableList.js";
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
        priorityId: "", // 优先级
        typeId: "", // 类型
        needPerson: "", // 需求人
        name: "", // 项目名
        startTime: "", // 开始时间
        finshTime: "", // 结束时间
        prioritySort: true, // 排序   asc desc
        typeSort: true, // 类型排序
        startTimeSort: true, // 开始时间排序
        finishTimeSort: true // 结束时间排序
      },
      renderTableList: tableList,
      typeList: [],
      priorityList: [],
      options: [
        { name: "MVP1", value: "value1" },
        { name: "MVP2", value: "value2" },
        { name: "MVP3", value: "value3" }
      ],
      list: []
    };
  },
  mounted() {
    // this.getTypeList();
    // var aa = this.getPriorityList();
    this.getTypeAndPriority()
    this.getData();
  },
  methods: {
     // 项目新增
    addProject() {
      this.$router.push({
        path: "addproject"
      });
    },
    // 项目编辑
    editProject(row) {
      this.$router.push({
        name: "editproject",
        params: {
          data: row
        }
      });
    },
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
    // customFieldColumn(h, { column, $index }) {
    //   console.log(column, $index);
    //   //  <i :class = "[searchObj.prioritySort?'el-icon-sort-down':'el-icon-sort-up']"></i>

    //   let className = this.searchObj.prioritySort
    //     ? "el-icon-sort-down"
    //     : "el-icon-sort-up";
    //   return h(
    //     "span",
    //     {
    //       style: {
    //         cursor: "pointer"
    //       }
    //     },
    //     [
    //       h("i", {
    //         class: "el-icon-sort"
    //       }),
    //       "优先级"
    //     ]
    //   );
    // },

    getData(pageNo) {
      if (!this.bscroll) {
        return;
      }
      this.bscroll = false;
      let searchObj = this.searchObj;
      let obj = {
        pageNo: pageNo ? pageNo : 1,
        pageSize: this.pageSize,
        prioritySort: searchObj.prioritySort ? "asc" : "desc", // 排序
        typeSort: searchObj.typeSort ? "asc" : "desc", // 类型排序
        startTimeSort: searchObj.startTimeSort ? "asc" : "desc", // 开始时间排序
        finishTimeSort: searchObj.finishTimeSort ? "asc" : "desc" // 结束时间排序
      };
      searchObj.typeId && (obj.typeId = searchObj.typeId); // 类型
      searchObj.priorityId && (obj.priorityId = searchObj.priorityId);
      searchObj.needPerson && (obj.needPerson = searchObj.needPerson); // 需求人
      searchObj.name && (obj.name = searchObj.name); // 项目名
      searchObj.startTime && (obj.startTime = searchObj.startTime); // 开始时间
      searchObj.finshTime && (obj.finshTime = searchObj.finshTime); // 结束时间

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
    searchData() {
      this.list = [];
      this.moveY = 0;
      this.pageNo = 1;
      this.lastPage = false;
      this.getData();
    },
    handleClickheader(item, column) {
      // console.log(column);
      // let propertys = ["starttime", "finshtime", "priorityName", "typeName"];
      // let property = column["property"];
      // let searchObj = this.searchObj;
      // if (!propertys.includes(property)) {
      //   return;
      // }
      // switch (property) {
      //   case "starttime":
      //     this.searchObj.startTimeSort = !searchObj.startTimeSort;
      //     break;
      //   case "finshtime":
      //     this.searchObj.finishTimeSort = !searchObj.finishTimeSort;
      //     break;
      //   case "priorityName":
      //     this.searchObj.prioritySort = !searchObj.prioritySort;
      //     break;
      //   case "typeName":
      //     this.searchObj.typeSort = !searchObj.typeSort;
      //     break;
      // }

      // this.list = [];
      // this.moveY = 0;
      // this.pageNo = 1;
      // this.lastPage = false;
      // this.getData();
      // let propertys = ["starttime", "finshtime", "priorityName", "typeName"];

      return () => {
        let property = item["prop"];
        let searchObj = this.searchObj;
        switch (property) {
          case "starttime":
            this.searchObj.startTimeSort = !searchObj.startTimeSort;
            break;
          case "finshtime":
            this.searchObj.finishTimeSort = !searchObj.finishTimeSort;
            break;
          case "priorityName":
            this.searchObj.prioritySort = !searchObj.prioritySort;
            break;
          case "typeName":
            this.searchObj.typeSort = !searchObj.typeSort;
            break;
        }
        this.list = [];
        this.moveY = 0;
        this.pageNo = 1;
        this.lastPage = false;
        this.getData();
      };
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
     * 所属类型列表
     *
     */
    getTypeAndPriority() {
      let getList = [
        {
          url: "api/pjc/project/findAllProjectType",
          method: "get"
        },
        {
          url: "api/pjc/project/findAllPriority",
          method: "get"
        }
      ]; 
      this.$http.all(getList, (res1, res2) =>{
        if (res1.status === 200) {
          if (res1.data.code === 200) {
            this.typeList = res1.data.data;
          }
        }
        if (res2.status === 200) {
          if (res2.data.code === 200) {
            this.priorityList = res2.data.data;
          }
        }
 
      });
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
    // formatTime(row, column, cellValue, index) {
    //   // switch(index){
    //   //   case 5:
    //   //   case 6:
    //   //   return this.$moment(cellValue).format("YYYY-MM-DD");
    //   //   default:
    //   //   return cellValue
    //   // }
    //   if (cellValue) {
    //   }
    //   return this.$moment(cellValue).format("YYYY-MM-DD");
    //   // return this.$moment(cellValue).format("YYYY-MM-DD h:mm:ss");
    // },
    formatter(item, k, scoped) {
      let _this = this;
      switch (k) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 7:
        case 8:
          // return (row, column, cellValue, index) => {
          //   return row[item.prop];
          // };
          return scoped["row"][item["prop"]];
        case 5:
        case 6:
          let cellValue = scoped["row"][item["prop"]];
          return _this.$moment(cellValue).format("YYYY-MM-DD");
        // return (row, column, cellValue, index) => {
        //   return _this.$moment(cellValue).format("YYYY-MM-DD");
        // };
      }
    },
    customRenderH(item, index) {
      let _this = this;
      return (h, { column, $index }) => {
     
        let header;
        switch (index) {
          case 1:
          case 3:
          case 5:
          case 6:
            header = h(
              "span",
              {
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: _this.handleClickheader(item, column)
                }
              },
              [
                h("i", {
                  class: "el-icon-sort"
                }),
                item["label"]
              ]
            );
            break;
          default:
            header = h("span", item["label"]);
        }
        return header;
      };
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


