<template>
    <div  class="extend-h-w">
               <el-container class="extend-h-w" direction = "vertical">
                   <!-- <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                             <h2 class = "sl-title">项目管理列表</h2>
                    </el-row> -->

                          <el-container class="extend-h-w" direction = "vertical">
                            <el-row :gutter = "10" type="flex">
                                <el-col :lg = "3"  :md= "5">
                                    <el-select clearable filterable v-model = "searchObj.name" placeholder="请选择项目名称">
                                      <el-option v-for = "item in selectProjectNameList"
                                                :key = "item.projectId"
                                                :label = "item.name"
                                                :value = "item.name">
                                      </el-option>
                                    </el-select>
                                </el-col>
                               <el-col :lg = "3"  :md= "5">
                                    <el-select clearable filterable v-model = "searchObj.needPerson" placeholder="请选择需求提出人">
                                      <el-option
                                          v-for = "item in rdList"
                                          :key = "item.userId"
                                          :label = "item.userName" 
                                          :value = "item.userName">
                                      </el-option>
                                    </el-select>
                               </el-col>                                    
                                <el-col :lg = "3"  :md= "5">
                                    <el-date-picker
                                        class = "extend-w"
                                        type="date"
                                        placeholder="开始时间"
                                        value-format = "yyyy-MM-dd"
                                        v-model = "searchObj.startTime"
                                        :picker-options="datePickerOptions">
                                      </el-date-picker>  
                                  
                                </el-col>
                                <el-col :lg = "3"  :md= "5">
                                  <el-date-picker
                                        class = "extend-w"
                                        type="date"
                                        value-format = "yyyy-MM-dd"
                                        placeholder="结束时间"
                                        v-model = "searchObj.finshTime"
                                        >
                                      </el-date-picker>
                                </el-col>
                                <el-col :lg = "2"  :md= "4" >
                                  <el-select clearable v-model = "searchObj.typeId" placeholder="项目类型">
                                      <el-option
                                        v-for="item in typeList"
                                        :key="item.projecttypeId"
                                        :label="item.typeName"
                                        :value="item.projecttypeId">
                                      </el-option>
                                    </el-select>

                                  </el-col>
                                 <el-col :lg = "2"  :md= "4">
                                    <el-select clearable v-model = "searchObj.priorityId" placeholder="优先级">
                                        <el-option
                                          v-for="item in priorityList"
                                          :key="item.priorityId"
                                          :label="item.priorityName"
                                          :value="item.priorityId">
                                        </el-option>
                                      </el-select>
                                   
                                   </el-col>  
                                  
                                 <el-col :span = "1.5"><el-button @click = "searchData">搜索</el-button></el-col>    
                                 <el-col :span = "1.5" ><el-button @click = "tableExport">导出</el-button></el-col>    
                                 <!-- <el-col :span = "4"  class="fr"> -->
                                   <div class="addbtn">
                                      <el-button class="" @click="addProject">新增项目</el-button>
                                      <el-popover
                                          placement="left"
                                          width="160"
                                          v-model = "visible"
                                        >
                                          <p>{{delMsg}}</p>
                                          <div style="text-align: right; margin: 0">
                                            <el-button size="mini" type="text" @click = "delcancle('all')">取消</el-button>
                                            <el-button type="primary" size="mini" @click = "delsure('all')">确定</el-button>
                                          </div>
                                          <el-button slot="reference" type="primary"  class = "" @click= "deletebtn('all')">批量删除</el-button>
                                      </el-popover>
                                   </div>
                                  
                                <!-- </el-col>     -->
                                 
                            </el-row>
                            <el-row type = "flex" class="extend-h-w">
                              <!-- :formatter = "formatter(item,index)"
                                      @header-click = "handleClickheader"
                                      :label= "item.label"
                               -->
                                    <el-table
                                       
                                        @selection-change = "elSelectionChange"
                                        ref="multipleTable"
                                        :data="list"
                                        border 
                                        height = "98%"
                                        header-cell-class-name = ""
                                        v-scroll = "{el:'.el-table__body-wrapper',scrollfn:scrollfn}"
                                        style="width: 100%; margin-top: 20px">
                                        <el-table-column
                                            type = "selection"
                                            width="50"
                                        ></el-table-column>
                                        <el-table-column
                                            v-for = "(item, index) in renderTableList"
                                            :key = "index"
                                            :width = "item.width"
                                            :render-header="customRenderH(item,index)"
                                             
                                            >
                                            <template slot-scope="scope1">
                                                  <template v-if = "index === 8">
                                                      <el-button type="text" @click="editProject(scope1.row)" icon = "el-icon-tickets" ></el-button>
                                                      <el-popover
                                                          placement="left"
                                                          width="160"
                                                          v-model = "scope1.row.visible"
                                                        >
                                                          <p>确定删除此项目吗？</p>
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
                                       <div slot = "append" class="table-loading"
                          
                                         v-show = "loading" v-loading = "loading">
                                         <!-- sdfsf  element-loading-spinner="el-icon-loading"-->
                                       </div>
                                    </el-table>

                            </el-row>
                         </el-container >
               </el-container>


    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import{CHANGE_TITLE} from '../../model/store/storetypes.js'
import tableList from "./projectTableList.js";
import {StandardPost} from '../../assets/js/util.js'
// const PROJECT_NAME_SELECT = "/api/pjc/project/findAllProjectName";
export default {
  data() {
    return {
      loading:false,
      visible2: -1,
      bscroll: true, // 是否加载
      pageNo: 1, // 初始加载页数
      pageSize: 15, // 初始每页数据数
      lastPage: false, //最后一页
      moveY: 0, // 滚动元素的总告诉
      scrollctx: null, // 滚动元素的上下文
      visible:false,  // 批量删除弹框显隐
      multipleSelection: [], // 批量删除的数据
      delMsg:'确定删除所有选中项目吗？',
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
      selectProjectNameList: [], // 项目名称
      rdList :[],                // 用户表
      renderTableList: tableList,
      typeList: [],    //所属类型
      priorityList: [], // 优先级
      options: [
        { name: "MVP1", value: "value1" },
        { name: "MVP2", value: "value2" },
        { name: "MVP3", value: "value3" }
      ],
      list: [],
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date('2000/01/01 00:00:00').getTime();
        }
      }
    };
  },
  computed:{

  },
  mounted() {
    this[CHANGE_TITLE]('项目管理列表');
    this.getTypeAndPriority();
    this.getData();
  },
  methods: {
     ...mapMutations([CHANGE_TITLE]),
    // 项目新增
    addProject() {
      this.$router.push({
        path: "project/addproject"
      });
    },
    // 项目编辑
    editProject(row) {
      this.$router.push({
        name: "project/editproject",
        // params: {
        //   projectId: row.projectId
        // },
        query: {
          projectId: row.projectId
        }
      });
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
      // 滚动加载loading
      this.loading = true  
      this.$http.post("/api/pjc/project/findAllProject", obj, res => {
        // 使可以加载
        setTimeout(() => {
          this.bscroll = true;
        }, 350);
         this.loading = false
        if (res.status === 200) {
          if (res.data.code === 200) {
            let data = res.data.data;
            let list = data.list;
            // 最后一页
            if ((list && list.length < this.pageSize)||data.isLastPage) {
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
          }else{
            this.$message.error(res.data.msg)
          }
        }else{
           this.$message.error(res.status)
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
        // 所属类型
        { url: "api/pjc/project/findAllProjectType", },
        // 优先级
        {url: "api/pjc/project/findAllPriority", },
        // 项目名称
        {url: "api/pjc/project/findAllProjectName", },
        // 需求人列表
        {url: "api/umc/user/findUserByUser", }
      ];
      this.$http.all(getList, (res1, res2,res3,res4) => {
        if(res1.status && res1.status === 200){
            if (res1.data.code === 200) {
                this.typeList = res1.data.data;
            }else{
              this.$message.error(res1.data.msg);
            }

            if (res2.data.code === 200) {
              this.priorityList = res2.data.data;
            }else{
              this.$message.error(res2.data.msg);
            }
            if (res3.data.code === 200) {
               this.selectProjectNameList = res3.data.data.list;
            }else{
              this.$message.error(res3.data.msg);
            }
            if (res4.data.code === 200) {
              this.rdList = res4.data.data;
            }else{
              this.$message.error(res4.data.msg);
            }
            
        }else{
            if(res1.status){
             this.$message.error(res1.status);
           }else{
             this.$message.error(res1);
           }
        }
      });
    },
    // 删除按钮
    deletebtn(value) {
      if(value === 'all'){
        if(this.multipleSelection.length===0){
         this.delMsg = '请选择至少一项'
        }else{
           this.delMsg = '确定删除所有选中项目吗？'
        }
        this.visible = !this.visible
        if(!this.visible){
        this.multipleSelection = [];
        this.$refs.multipleTable.clearSelection();
        }
      }else{
        value.row.visible = true;
      }
      
    },
    delcancle(value) {
      if(value === 'all'){
        this.visible = false
        this.multipleSelection = [];
        this.$refs.multipleTable.clearSelection();
      }else{
        value.row.visible = false;
      }
    },
    delsure(value) {
      let projectIds ;
      if(value === 'all'){
        if(this.multipleSelection.length===0){
          // this.$message.error('请选择至少一项')
          return;
        }else{
          projectIds = this.multipleSelection.join(',');
        }
      }else{
        projectIds = value.row.projectId
      }
      this.$http.post(
        "/api/pjc/project/delProject",
        {
          projectId: projectIds
        },
        res => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              this.searchData();
              if(value === 'all'){
                this.visible = false;
              }else{
                 value.row.visible = false;
              }
             
              this.$message({
                message: "删除成功",
                type: "success"
              });
            } else {
              this.$message.error(res.data.msg);
            }
          }
        }
      );
    },
        // 单击选中的回调
    elSelect(selection, row){
      //  console.log(selection) 
    },
     // 全选的回调
    elSelectAll(selection){
      //  console.log(selection) 
    },
    // 选择change 时的回调
    elSelectionChange(selection){
      //  console.log(selection) 
      let arr = [];
      selection.forEach(t =>{
         arr.push(t.projectId)
      })
      this.multipleSelection = arr;
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
        // case 8:
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
    },
    /**
     * 
     *  导出表格
     */
    tableExport(){
         let url = 'api/pjc/project/exportExcelProject';
         let searchObj = this.searchObj;
         let obj ={};
          searchObj.typeId && (obj.typeId = searchObj.typeId); // 类型
          searchObj.priorityId && (obj.priorityId = searchObj.priorityId);
          searchObj.needPerson && (obj.needPerson = searchObj.needPerson); // 需求人
          searchObj.name && (obj.name = searchObj.name); // 项目名
          searchObj.startTime && (obj.startTime = searchObj.startTime); // 开始时间
          searchObj.finshTime && (obj.finshTime = searchObj.finshTime); // 结束时间
        StandardPost(url,obj)
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


