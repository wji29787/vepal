<template>
  <el-container class="r-suit-product extend-h-w">
    <el-header class="r-suit-product__header">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-row :gutter="24">
            <el-col :span="7" style="padding-top:13px;">套装名称</el-col>
            <el-col :span="17">
              <el-select v-model="searchObj.suitId" filterable clearable>
                <el-option v-for="(item, index) in suitSelectList"
                            :key="index"
                            :label="item.suitName"
                            :value="item.suitId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row :gutter="24">
            <el-col :span="7" style="padding-top:13px;">项目名称</el-col>
            <el-col :span="17">
              <el-select v-model="searchObj.projectId" filterable clearable>
                <el-option v-for="(item, index) in selectProjectNameList"
                          :key="index"
                          :label="item.name"
                          :value="item.projectId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row :gutter="24">
            <el-col :span="7" style="padding-top:13px;">产品名称</el-col>
            <el-col :span="17">
              <el-select v-model="searchObj.productId" filterable clearable>
                <el-option v-for="(item, index) in productNameSelectList"
                          :key="index"
                          :label="item.productName"
                          :value="item.productId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" @click="searchData">搜索</el-button>
            <el-button type="primary" @click= "tableExport">导出</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-container class="r-suit-product__main extend-h-w" >
         <el-table
                 
                  :data="list"
                  :span-method="objectSpanMethod"
                  border
                  ref="multipleTable"
                  height = "98%"
                  v-scroll = "{el:'.el-table__body-wrapper',scrollfn:scrollfn}"
                  style="width: 100%;">
                  <el-table-column
                      v-for = "(item, index) in renderTableList"
                      :key = "index"
                      :width = "item.width"
                      :render-header="customRenderH(item,index)"
                      >
                      <template slot-scope="scope1">
                         
                            <template v-if = "index === 0">
                              {{setTableIndex(scope1['$index'])}}
                            </template>
                            <!-- <template v-else-if = "index === 3">
                            
                                <el-popover
                                    placement="top-start"
                                    width="260"
                                    trigger="hover"
                                    >
                                    <p class="eloverflow">{{scope1['row'][item['prop']]}}</p>
                                    <p slot="reference" class = "mousecur">{{formatter(item,index,scope1)}}</p>
                                </el-popover>


                            </template> -->
                            <template v-else>
                              <!-- scope1['row'][item['prop']] -->
                                {{formatter(item,index,scope1)}}
                            </template>
                        </template>


                  </el-table-column>
              </el-table>
    </el-container>
    <!-- <el-footer class="r-suit-product__footer">
      <el-pagination background
        layout="prev, pager, next"
        :total="totalNumer"
        @current-change="handleCurrentPageChange">
      </el-pagination>
    </el-footer> -->
  </el-container>
</template>
<script>
import tableList from "./suitAndPjcAndPdcTable.js";
import {StandardPost} from '../../assets/js/util.js'
// 表格导出
const TABLE_EXPORT = "/api/suit/report/exportSuitAndProject"
const GET_SUIT_PRODUCT = "/api/suit/report/findSuitAndProductList";
// const GET_SUIT_PRODUCT = "/vdev/report/findSuitAndProductList";
const PRODUCT_NAME_SELECT = "/api/pdc/product/findAllProduct";
const PROJECT_NAME_SELECT = "/api/pjc/project/findAllProjectName";
const SUIT_NAME_SELECT = "/api/suit/suit/findAllSuitName";
const RESPONSE_SUCCESS_CODE = 200;
export default {
  name: "suitProduct",
  data() {
    return {
      bscroll: true, // 是否加载
      pageNo: 1, // 初始加载页数
      pageSize: 10, // 初始每页数据数
      lastPage: false, //最后一页
      moveY: 0, // 滚动元素的总告诉
      scrollctx: null, // 滚动元素的上下文
      concatArr:{}, // 合并项
      list: [],
      searchObj: {
        suitId: "",
        projectId: "",
        productId: ""
      },
      renderTableList: tableList,
      suitSelectList: [],
      selectProjectNameList: [],
      productNameSelectList: []
    };
  },
  mounted() {
    this.getAllNameList();
    this.getData();
  },
  methods: {
    getAllNameList() {
      let list = [
        { url: SUIT_NAME_SELECT },
        { url: PROJECT_NAME_SELECT },
        { url: PRODUCT_NAME_SELECT }
      ];
      this.$http.all(list, (res1, res2, res3) => {
        if (res1.status && res1.status === 200) {
          // 套装
          if (res1.data.code === 200) {
            this.suitSelectList = res1.data.data.list;
          } else {
            this.$message.error(res1.data.msg);
          }
          // 项目
          if (res2.data.code === 200) {
            this.selectProjectNameList = res2.data.data.list;
          } else {
            this.$message.error(res2.data.msg);
          }
          // 产品
          if (res3.data.code === 200) {
            this.productNameSelectList = res3.data.data.list;
          } else {
            this.$message.error(res3.data.msg);
          }
        } else {
           if(res1.status){
             this.$message.error(res1.status);
           }else{
             this.$message.error(res1);
           }
        }
      });
    },
    // 获取列表数据
    getData(pageNo) {
      if (!this.bscroll) {
        return;
      }
      this.bscroll = false;
      let searchObj = this.searchObj;
      let obj = {
        pageNo: pageNo ? pageNo : 1,
        pageSize: this.pageSize,
        ...searchObj
      };

      this.$http.get(GET_SUIT_PRODUCT, obj, res => {
        // 使可以加载
        setTimeout(() => {
          this.bscroll = true;
        }, 350);

        if (res.status === 200) {
          if (res.data.code === 200) {
            let data = res.data.data;
            let list = data.list;
            // 最后一页
            if (list && (list.length < this.pageSize || data.isLastPage)) {
              this.lastPage = true;
            }

            let arr = [];
              
            if (list.length > 0) {
              arr = this.formaterData(list);
            }
            if (this.list.length === 0) {
              this.list = arr;
            } else {
              this.list = this.list.concat(arr);
            }
             this.concatArr = this.setData(this.list);
            //  this.$nextTick(()=>{
            //    let tablediv = this.$refs.multipleTable.$el
            //    let table = tablediv.querySelector('.el-table__body')
               
            //    console.dir(table.rows[2].cells)
            //   //  document.querySelector 
            //  })
            // console.log() 
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
     * 展开嵌套的数据
     * 
     */
    formaterData(data) {

      function  _serialize(data,opt){
           let arr = [];
           let name = opt.name;
          //  let type = opt.type;
           let list = opt.list
          //  let reg = new RegExp(`^${type}`)
          for(let i = 0,len = data.length;i<data.length,i<len ;i++){
              let  item = data[i]
              let  obj = {};  
              list.forEach(t=>{
                obj[t] = item[t]
              })  
              if((item !=null) && (item[name] !=null)&& Array.isArray(item[name])&& item[name].length>0){
                  let value = item[name];
                   value = value.map( t =>{
                    if(t != null|| t !='null' ){
                      return Object.assign({},t,obj)
                    }
                  })
                  arr = arr.concat(value)
              } 
          }
          return arr;
      }
  
      let list  = ['suitName','suitId','suitDate'];
      let _data = _serialize(data,{name:'projectVos',list:list,type:'suit'}) ; // 项目集合
       list = ['name','projectId','priorityName','priorityId','projectdesc',...list]
      _data = _serialize(_data,{name:'productVos',list:list,type:'project'})  // 产品集合
      list = ['productName','productId',...list]
      _data = _serialize(_data,{name:'versionVos',list:list,type:'product'})  // 版本集合
      return _data;
    },
    /**
     * 过滤合并项
     * 
     */
    setData(data){
      if(data.length===0) return
      let suit = [],project=[],product=[];
      let suitId = data[0].suitId, projectId = data[0]['projectId'], productId = data[0]['productId'] ;
      let suitIndex = 0,projectIndex = 0,productIndex = 0;
      data.forEach((t,i) =>{
          if(i ===0){
            suit[suitIndex] =1;
            project[projectIndex] =1;
            product[productIndex] =1;
          }else{
           // suit
            if(t.suitId === suitId){
                 suit[suitIndex] =suit[suitIndex]+=1; 
                 suit[i] = 0
            }else{
               suitIndex = i;
               suit[suitIndex] = 1
               suitId = t.suitId
            }
            // project
            if(t.projectId === projectId){
                 project[projectIndex] =project[projectIndex]+=1; 
                 project[i] = 0
            }else{
               projectIndex = i;
               project[projectIndex] = 1
               projectId = t.projectId
            }
            // product
            if(t.productId === productId){
                 product[productIndex] =product[productIndex]+=1; 
                 product[i] = 0
            }else{
               productIndex = i;
               product[productIndex] = 1
               productId = t.productId
            }
          }

      })
      return {suit,project,product}
    },
    /**
     * 合并回调
     */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
       
       if (columnIndex === 0 || columnIndex === 1||columnIndex ===2 ) {
        const _row = this.concatArr['suit'][rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if(columnIndex ===3||columnIndex ===4||columnIndex ===5){
         const _row = this.concatArr['project'][rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if(columnIndex ===6){
         const _row = this.concatArr['product'][rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    /**
     * 自定义索引
     * 
     */
    setTableIndex(index){
      let text=0
        let suitList = this.concatArr['suit']
        for(let i = 0,len =suitList.length;i<len;i++){
          if(suitList[i]!==0){
            text+=1
          }
          if(index===i){
            break;
          }
        }
        return text
    },
    /**
     * 格式化text
     * 
     */
    formatter(item, k, scoped) {
       let _this = this;
        let text ;
       if(k !==0){
          text = scoped["row"][item["prop"]];
          return text 
       } 
     
    },
    customRenderH(item, index) {
      let _this = this;
      return (h, { column, $index }) => {
        let header = h("span", item["label"]);
        return header;
      };
    },
    /**
     * 
     *  导出表格
     */
    tableExport(){
        //  let searchObj = this.searchObj;
         let obj ={};
          // searchObj.typeId && (obj.typeId = searchObj.typeId); // 类型
          // searchObj.priorityId && (obj.priorityId = searchObj.priorityId);
          // searchObj.needPerson && (obj.needPerson = searchObj.needPerson); // 需求人
          // searchObj.name && (obj.name = searchObj.name); // 项目名
          // searchObj.startTime && (obj.startTime = searchObj.startTime); // 开始时间
          // searchObj.finshTime && (obj.finshTime = searchObj.finshTime); // 结束时间
        StandardPost(TABLE_EXPORT,obj)
    }
  }
};
</script>
<style>
.r-suit-product {
  height: 100%;
}
</style>
