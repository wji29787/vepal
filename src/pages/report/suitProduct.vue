<template>
  <el-container class="r-suit-product">
    <el-header class="r-suit-product__header">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-row :gutter="24">
            <el-col :span="7" style="padding-top:13px;">套装名称</el-col>
            <el-col :span="17">
              <el-select v-model="searchParams.suitName" filterable clearable>

              </el-select>
            </el-col>
          </el-row>
        </el-col>
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
                          :label="'22'"
                          :value="1">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" @click="handleSearchBtnClick">搜索</el-button>
            <el-button type="primary">导出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="r-suit-product__main">
      <el-table :data="dataSource" :border="true" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </el-main>
    <el-footer class="r-suit-product__footer">
      <el-pagination background
        layout="prev, pager, next"
        :total="totalNumer"
        :page-size="pageParams.pageSize"
        @current-change="handleCurrentPageChange">
      </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
const GET_SUIT_PRODUCT = '/api/report/findSuitAndProductList';
const PRODUCT_NAME_SELECT = '/api/pdc/product/findAllProduct';
const PROJECT_NAME_SELECT = '/api/pjc/project/findAllProjectName';
const RESPONSE_SUCCESS_CODE = 200;
export default {
  name: 'suitProduct',
  data () {
    return {
      tabPosition: '',
      searchParams: {
        suitName: '',
        projectName: '',
        productName: '',
        currentPage: 0,
        limit: 30
      },
      selectProjectNameList: [],
      productNameSelectList: [],
      dataSource: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
      }],
      totalNumer: 0
    };
  },
  mounted () {
    this.getProductList();
    Promise.all([this.getSuitNameList(), this.getPorjectNameListf()]).then(res => {}).catch(err => {});
  },
  methods: {
    getSuitNameList () {
      return new Promise((resovle, reject) => {
        let _data = {};
        this.$http.post(PRODUCT_NAME_SELECT, _data, res => {
          this.$nextTick(() => {
            this.productNameSelectList = [];
            if (res.data.code === RESPONSE_SUCCESS_CODE) {
              let listData = res.data.data;
              if (listData && Array.isArray(listData) && listData.length) {
                this.productNameSelectList = listData;
                console.log(listData, 'listData');
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
              }
            }
          });
        });
      });
    },
    getProductList () {
      let _data = {
        pageNo: this.searchParams.currentPage,
        pageSize: this.searchParams.limit,
        suitId: '',
        suitName: '',
        suitDates: '',
        adjustPerson: '',
        createTime: '',
        modifyTime: '',
        status: '',
        var1: '',
        var2: '',
        var3: '',
        suitDesc: ''        
      };
      this.$http.get(GET_SUIT_PRODUCT, _data, res => {
        this.$nextTick(() => {
          this.totalNumer = 0;
          if (res.data.code === RESPONSE_SUCCESS_CODE) {
            let listData = res.data.data;
            console.log(res, 'res');
            if (listData && Array.isArray(listData) && listData.length) {
              this.totalNumer = res.data.data.total;
            }
          }
        });
      });
    },
    setData (list) {
      let arr = [];
      list.forEach((element, index) => {});
    },
    handleSearchBtnClick () {},
    handleCurrentPageChange () {}
  }
};
</script>
<style>
.r-suit-product {
  height: 100%;
}
</style>
