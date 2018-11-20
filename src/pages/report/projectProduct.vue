<template>
  <el-container class="r-project-product">
    <el-header class="r-project-product__header">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-row :gutter="24">
            <el-col :span="7" style="padding-top:13px;">项目名称</el-col>
            <el-col :span="17">
              <el-select v-model="searchParams.projectName" filterable clearable>
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
              <el-select v-model="searchParams.productName" filterable clearable>
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
          <el-button type="primary" @click="handleSearchBtnClick">搜索</el-button>
          <el-button type="primary">导出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="r-project-product__main">
      <el-table :data="dataSource" :border="true" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </el-main>
    <el-footer class="r-project-product__footer">
      <el-pagination background
        layout="prev, pager, next"
        :total="totalNumber"
        @current-change="handleCurrentPageChange">
      </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
const GET_PROJECT_PRODUCT = '/api/suit/report/findProjectAndProductList';
const PRODUCT_NAME_SELECT = '/api/pdc/product/findAllProduct';
const PROJECT_NAME_SELECT = '/api/pjc/project/findAllProjectName';
const RESPONSE_SUCCESS_CODE = 200;
export default {
  name: 'projectProduct',
  data () {
    return {
      dataSource: [],
      selectProjectNameList: [],
      productNameSelectList: [],
      searchParams: {
        projectName: '',
        productName: '',
        currentPage: 1,
        limit: 10
      },
      totalNumber: 0
    };
  },
  mounted () {
    Promise.all([this.getProductNameList(), this.getPorjectNameList()]).then(res => {
       
    }).catch(err => {});
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
          this.dataSource = [];
          if (res.data.code === RESPONSE_SUCCESS_CODE) {}
        });
      });
    },
    handleSearchBtnClick () {},
    handleCurrentPageChange (val) {}
  }
};
</script>
