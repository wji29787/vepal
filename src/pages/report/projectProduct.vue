<template>
  <el-container class="r-project-product">
    <el-header class="r-project-product__header" height="40px">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-row :gutter="24">
            <el-col :span="7" style="padding-top:13px;">项目名称</el-col>
            <el-col :span="17">
              <el-select v-model="searchParams.projectName" filterable clearable size="small">
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
              <el-select v-model="searchParams.productName" filterable clearable size="small">
                <el-option v-for="(item, index) in productNameSelectList"
                          :key="index"
                          :label="item.productName"
                          :value="item.productId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" size="small" @click="handleSearchBtnClick">搜索</el-button>
          <el-button type="primary" size="small" @click="handleExportBtnClick">导出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="r-project-product__main">
      <el-table :data="dataSource" :border="true" style="width: 100%" :span-method="objectSpanMethod">
        <el-table-column prop="number" label="序号" width="180"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" width="180">
          <template slot-scope="scope">
            <el-popover el-popover trigger="hover" placement="top">
              项目名称 : {{scope.row.projectName}}
              <span slot="reference">{{scope.row.projectName}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称">
          <template slot-scope="scope">
            <el-popover el-popover trigger="hover" placement="left">
              产品名称 : {{scope.row.productName}}
              <span slot="reference">{{scope.row.productName}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本号">
          <template slot-scope="scope">
            <el-popover el-popover trigger="hover" placement="left">
              版本号 : {{scope.row.version}}
              <span slot="reference">{{scope.row.version}}</span>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="r-project-product__footer" height="40px">
      <el-pagination background
        layout="prev, pager, next"
        :total="totalNumber"
        @current-change="handleCurrentPageChange">
      </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
import { StandardPost } from '@/assets/js/util.js';
const EXPORT_PROJECT_PRODUCT = '/pjc/report/exportProjectAndProduct';
const GET_PROJECT_PRODUCT = '/api/pjc/report/findProjectAndProductList';
const PRODUCT_NAME_SELECT = '/api/pdc/product/findAllProduct';
const PROJECT_NAME_SELECT = '/api/pjc/project/findAllProjectName';
const RESPONSE_SUCCESS_CODE = 200;
export default {
  name: 'projectProduct',
  data () {
    return {
      dataSource: [], // 数据源
      selectProjectNameList: [], // 用于项目下拉列表的数据源
      productNameSelectList: [], // 用于产品下拉列表的数据源
      searchParams: {
        projectName: '',
        productName: '',
        currentPage: 1,
        limit: 10
      }, // 搜索数据
      concatRowArr: [], // 记录第一个要合并行的array
      subConcatRowArr: [], // 记录第二个要合并行的array
      currentIndex: 0, // 当前索引
      subCurrentIndex: 0, // 当前索引
      totalNumber: 0 // 总页数
    };
  },
  mounted () {
    Promise.all([this.getProductNameList(), this.getPorjectNameList()]).then(res => {}).catch(err => {});
    this.getProjectProductList();
  },
  methods: {
    getProductNameList () {
      return new Promise((resovle, reject) => {
        let _data = {};
        this.$http.post(PRODUCT_NAME_SELECT, _data, res => {
       
          this.$nextTick(() => {
            this.productNameSelectList = [];
            if (res.data.code === RESPONSE_SUCCESS_CODE) {
              let listData = res.data.data.list;
              if (listData && Array.isArray(listData) && listData.length) {
                this.productNameSelectList = listData;
                // console.log(listData, 'productList');
              }
            }
          });
        });
      });
    },
    getPorjectNameList () {
      return new Promise((resovle, reject) => {
        let _data = {};
        this.$http.post(PROJECT_NAME_SELECT, _data, res => {
          this.$nextTick(() => {
            this.selectProjectNameList = [];
            if (res.data.code === RESPONSE_SUCCESS_CODE) {
              let listData = res.data.data.list;
              if (listData && Array.isArray(listData) && listData) {
                this.selectProjectNameList = listData;
                // console.log(listData, 'projectList');
              }
            }
          });
        });
      });
    },
    getProjectProductList () {
      let _data = {
        pageNo: this.searchParams.currentPage,
        pageSize: this.searchParams.limit,
        projectId: this.searchParams.projectName,
        productId: this.searchParams.productName
      };
      this.$http.get(GET_PROJECT_PRODUCT, _data, res => {
        this.$nextTick(() => {
          this.totalNumber = 0;
          if (res.data.code === RESPONSE_SUCCESS_CODE) {
            let listData = res.data.data.list;
            if (listData && Array.isArray(listData) && listData.length) {
              this.totalNumber = res.data.data.total;
              this.setData(listData);
            }
          }
        });
      });
    },
    setData (list) {
      let arr = [];
      list.forEach((element, index) => {
        if (element.products !== null && element.products.length) {
         element.products.forEach((proItem, proIndex) => {
           if (proItem.versions !== null && proItem.versions.length) {
              proItem.versions.forEach((verItem, verIndex) => {
                let obj = {
                  projectName: element.name,
                  productName: proItem.productName,
                  version: verItem.verName,
                  index: proIndex,
                  subIndex: verIndex
                };
                arr.push(obj);
             });
           } else if (proItem.versions === null || !proItem.versions.length) {
             let obj = {
               projectName: element.name,
               productName: proItem.productName,
               version: '',
               index: proIndex,
               subIndex: ''
             };
             arr.push(arr);
           }
         });
        } else if (element.products === null || !element.products.length) {
          let obj = {
            projectName: element.name,
            productName: '',
            version: '',
            index: '',
            subIndex: ''
          };
          arr.push(obj);
        }
      });
      arr.forEach((element, index) => {
        element.number = index + 1;
      });
      this.dataSource = arr;
      this.reSetData(arr);
    },
    reSetData (data) {
      this.concatRowArr = [];
      this.subConcatRowArr = [];
      this.currentIndex = 0;
      this.subCurrentIndex = 0;
      data.forEach((element, index) => {
        if (index === 0) {
          this.concatRowArr.push(1); 
        } else {
          if (element.index !== '' && data[index - 1].index !=='') {
            if (element.index === data[index - 1].index) {
              this.concatRowArr[this.currentIndex] += 1;
              this.concatRowArr.push(0);
            } else {
              this.concatRowArr.push(1);
              this.currentIndex = index;
            }
          } else {
            this.concatRowArr.push(1);
            this.currentIndex = index;
          }
        }
      });
      data.forEach((element, index) => {
        if (index === 0) {
          this.subConcatRowArr.push(1);
        } else {
          if (element.subIndex !== '' && data[index - 1].subIndex !== '') {
            if (element.subIndex === data[index - 1].subIndex) {
              this.subConcatRowArr[this.subCurrentIndex] += 1;
              this.subConcatRowArr.push(0);
            } else {
              this.subConcatRowArr.push(1);
              this.subCurrentIndex = index;
            }
          } else {
            this.subConcatRowArr.push(1);
              this.subCurrentIndex = index;
          }
        }
      });
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.subConcatRowArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 2) {
        const _row = this.concatRowArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    handleSearchBtnClick () {
      this.getProjectProductList();
    },
    handleExportBtnClick () {
      StandardPost(EXPORT_PROJECT_PRODUCT, {projectName: this.searchParams.projectName, productName: this.searchParams.productName}, 'get');
    },
    handleCurrentPageChange (val) {
      this.searchParams.currentPage = val;
      this.getProjectProductList();
    }
  }
};
</script>
<style>
  .r-project-product {
    height: 100%;
  }
  .r-project-product__footer {
    padding-top: 4px;
  }
</style>