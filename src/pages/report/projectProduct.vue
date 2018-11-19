<template>
  <el-container class="r-project-product">
    <el-header class="r-project-product__header">
      <el-row :gutter="24">
        <el-col :span="4">
          <el-form-item label="项目名称">
            <el-input v-model="searchParams.projectName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="产品名称">
            <el-input v-model="searchParams.productName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">主要按钮</el-button>
        </el-col>
        <el-col :span="12">
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
    <el-footer class="r-project-product__footer"></el-footer>
  </el-container>
</template>
<script>
const GET_PROJECT_PRODUCT = '/api/suit/report/findProjectAndProductList';
const RESPONSE_SUCCESS_CODE = 200;
export default {
  name: 'projectProduct',
  data () {
    return {
      dataSource: [],
      searchParams: {
        projectName: '',
        productName: '',
        currentPage: 1,
        limit: 10
      },
      pageParams: {
        pageSize: 10,
        totalNumber: 0
      }
    };
  },
  methods: {
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
          if (res.data.code === RESPONSE_SUCCESS_CODE) {
          }
        });
      });
    }
  }
};
</script>
