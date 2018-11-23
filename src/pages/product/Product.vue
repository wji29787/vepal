<template>
    <div  class="extend-h-w">
               <el-container class="extend-h-w" direction = "vertical">
                   <!-- <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                             <h2 class = "sl-title">产品管理列表</h2>
                    </el-row> -->

                          <el-container class="extend-h-w" direction = "vertical">
                            <el-row :gutter = "10" type="flex">
                             <!--  remote
                                        :remote-method="productobj.remoteMethod"
                                        :loading="productobj.loading"  -->
                                <el-col :lg = "7"  :md= "9">
                                    <span>产品名称：</span>
                                   <el-select
                                       filterable
                                       clearable
                                       v-model = "searchObj.productName"
                                       placeholder="请输入"
                                       size = 'small'
                                        class = "itemL7">
                                        <el-option
                                          v-for="item in productobj.list"
                                          :key="item.productId"
                                          :label="item.productName"
                                          :value="item.productName">
                                        </el-option>
                                      </el-select>
                                  </el-col>
                                <el-col :lg = "6"  :md= "8">
                                   <span>版本号：</span>
                                  <el-input placeholder="请输入版本号" size = 'small' v-model = "searchObj.verName" class = "itemL6"></el-input>

                                  </el-col>

                                 <el-col :span = "1.5"><el-button size = 'small' @click = "searchData()">搜索</el-button></el-col>

                                 <el-col :span = "6"  class="fr">
                                   <!-- <div class="fr"> -->
                                   <el-button size = 'small' @click = "addProduct">新增产品</el-button>
                                   <!-- <el-popover
                                      placement="left"
                                      width="160"
                                      v-model = "visible"
                                    >
                                      <p>{{delMsg}}</p>
                                      <div style="text-align: right; margin: 0">
                                        <el-button size="mini" type="text" @click = "delcancle('all')">取消</el-button>
                                        <el-button type="primary" size="mini" @click = "delsure('all')">确定</el-button>
                                      </div>
                                      
                                  </el-popover> -->
                                  <el-button  type="primary" size = 'small'  @click= "deletebtn('all')">批量删除</el-button>
                                   <!-- </div> -->
                                   </el-col>

                            </el-row>
                            <el-row type = "flex" class="extend-h-w">
                              <!-- :formatter = "formatter(item,index)"
                                      @header-click = "handleClickheader"
                                      :label= "item.label"
                               -->
                                    <el-table
                                        @selection-change = "elSelectionChange"
                                        :data="list"
                                        :span-method="objectSpanMethod"
                                        border
                                        ref="multipleTable"
                                        height = "98%"
                                        header-cell-class-name = ""
                                        row-class-name = "row-text"
                                        v-scroll = "{el:'.el-table__body-wrapper',scrollfn:scrollfn}"
                                        :header-cell-style = "setHeaderStyle"
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
                                                  <template v-if = "index === 4">
                                                      <el-button type="text" @click="editVersion(scope1.row)" icon = "el-icon-tickets" ></el-button>
                                                      <el-button slot="reference" type="text"  class = "textColor" @click= "deletebtn(scope1)" icon = "el-icon-delete"></el-button>
                                                  </template>
                                                  <template v-else-if = "index === 0">
                                                    {{setTableindex(scope1['$index'])}}
                                                  </template>
                                                  <template v-else-if = "index === 3">
                                                    <!--  popper-class = "eloverflow" -->
                                                     <el-popover
                                                          placement="top-start"
                                                          width="260"
                                                          trigger="hover"

                                                          >
                                                          <p class="eloverflow">{{scope1['row'][item['prop']]}}</p>
                                                          <!-- <el-scrollbar style="height:100%;">

                                                         </el-scrollbar> -->

                                                          <p slot="reference" class = "mousecur">{{formatter(item,index,scope1)}}</p>
                                                      </el-popover>


                                                  </template>
                                                  <template v-else-if = "index === 5">
                                                    <el-button type="text" @click="addVersion(scope1.row)" >新增版本</el-button>
                                                  </template>
                                                  <template v-else>
                                                    <!-- scope1['row'][item['prop']] -->
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
const DELETE_PRODUCT_ALL = '/api/pdc/product/delProduct'
const DELETE_PRODUCT = '/api/pdc/version/delVersionById'
import tableList from "./productTableList.js";
import { mapMutations } from 'vuex'
import{CHANGE_TITLE} from '../../model/store/storetypes.js'
export default {
  data() {
    return {
      loading:false,
      bscroll: true, // 是否加载
      pageNo: 1, // 初始加载页数
      pageSize: 20, // 初始每页数据数
      lastPage: false, //最后一页
      moveY: 0, // 滚动元素的总告诉
      scrollctx: null, // 滚动元素的上下文
      multipleSelection: [], // 批量删除的数据
      delMsg:'确定删除所有选中产品(产品删除时版本也会删除)吗？',
      searchObj: {
        productName: "", // 优先级
        verName: "" // 类型
      },
      renderTableList: tableList,
      list: [],
      arrname: [],
      productobj: {
        list: [], // 产品列表
        loading: ""
      }
    };
  },
  mounted() {
    this[CHANGE_TITLE]('产品管理列表');
    this.getProductList();
    this.getData();
  },
  methods: {
    ...mapMutations([CHANGE_TITLE]),
    addProduct() {
      this.$router.push({
        path: "product/addproduct"
      });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {},

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
        // columnIndex === 1 ||
        columnIndex === 2 ||
        columnIndex === 6
      ) {
        let _col = 0,
          _row = 0;
        this.arrname.forEach(t => {
          if (t.index === rowIndex) {
            _row = t.listLen;
            _col = 1;
          }
        });
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    setTableindex(index){
        let text=0;
        this.arrname.forEach((t,i)=>{
          if(index === t.index){
            text =i+1;
          }
        })
        // return text
        return index+1
    },
    getData(pageNo) {
      if (!this.bscroll) {
        return;
      }
      this.bscroll = false;
      let searchObj = this.searchObj;
      let obj = {
        pageNo: pageNo ? pageNo : 1,
        pageSize: this.pageSize,
        productName: searchObj.productName || "", // 优先级
        verName: searchObj.verName || "" // 类型
      };
      // 滚动加载loading
      this.loading = true 
      this.$http.post("/api/pdc/product/findAllProductVersion", obj, res => {
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
            if (list && (list.length < this.pageSize || data.isLastPage)) {
              this.lastPage = true;
            }
            // 添加 删除按钮属性
            let arr = [],
              arrname = [];
            list.forEach((t, i) => {
              if (t.versionList.length > 0) {
                let obj = {};
                if (i === 0) {
                  (obj.index = 0), (obj.listLen = t.versionList.length);
                } else {
                  obj.index =
                    arrname[arrname.length - 1].index +
                    arrname[arrname.length - 1].listLen;
                  obj.listLen = t.versionList.length;
                }
                arrname.push(obj);
                t.versionList.forEach(k => {
                  k.name = t.productName;
                  k.productId = t.productId;
                });
                arr = arr.concat(t.versionList);
              }
            });
            if (this.list.length === 0) {
              this.list = arr;
              this.arrname = arrname;
            } else {
              this.list = this.list.concat(arr);
              let obj = this.arrname[this.arrname.length - 1];
              let num = obj.index + obj.listLen;
              arrname.forEach(t => {
                t.index += num;
              });
              this.arrname = this.arrname.concat(arrname);
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
    getProductList(pageNo) {
      this.$http.get(
        "/api/pdc/product/findAllProduct",
        {
          pageNo: 0,
          pageSize: 0
        },
        res => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              this.productobj.list = res.data.data.list;
            }
          }
        }
      );
    },
    // 删除按钮
    deletebtn(value) {
      let _this = this;
      if (value === "all") {
          if(this.multipleSelection.length===0){
          this.$message({
                message: '请选择至少一项',
                type: 'warning'
            });
          }else{
            let productId = this.multipleSelection.join(",");
            del(DELETE_PRODUCT_ALL,{productId})
          }
      } else {
        del(DELETE_PRODUCT,{
          productId:value.row.productId,
          versionId:value.row.versionId
        })
      }
      function del (url,_data){   
              _this.$confirm('此操作将删除选中项目，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                   _this.$http.instance.post(url,_data)
                   .then(res=>{
                      if(res.data.code === 200){
                         _this.searchData();
                         _this.$message({
                            message: res.data.data,
                            type: "success"
                         });
                      }else{
                        _this.$message.error(res.data.data)
                      }
                   }).catch( err =>{  
                        _this.$message.error(err.toString())
                   })   
              }).catch((err) => {
                  _this.$message({
                      type: 'info',
                      message: '已取消删除'
                  });          
              });
          
      }   

    
    },
    // 选择change 时的回调
    elSelectionChange(selection) {
      //  console.log(selection)
      let arr = [];
      selection.forEach(t => {
        arr.push(t.productId);
      });
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
          return scoped["row"][item["prop"]];
        case 3:
          let cellValue = scoped["row"][item["prop"]] || "";
          return cellValue.length > 20
            ? cellValue.substr(0, 17) + "..."
            : cellValue;
      }
    },
    customRenderH(item, index) {
      let _this = this;
      return (h, { column, $index }) => {
        let header;
        switch (index) {
          case 4:
            // header = h(
            //   "span",
            //   {
            //     style: {
            //       cursor: "pointer"
            //     },
            //     on: {
            //       click: _this.handleClickheader(item, column)
            //     }
            //   },
            //   [
            //     h("i", {
            //       class: "el-icon-sort"
            //     }),
            //     item["label"]
            //   ]
            // );
            // column.colSpan =2
            // console.log(column)
            header = h("span", item["label"]);
            break;
          default:
            header = h("span", item["label"]);
        }
        return header;
      };
    },
    setHeaderStyle({ row, column, rowIndex, columnIndex }) {},
    addVersion(row) {
      this.$router.push({
        name: "product/addversion",
        query: {
          productId: row.productId,
          productName :row.productName 
        }
      });
    },
    editVersion(row) {
      this.$router.push({
        name: "product/editversion",
        // params: {
        //   data: row
        // },
        query: {
          versionId: row.versionId,
          productId: row.productId
        }
      });
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


