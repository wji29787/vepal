<template>
  <el-container class="r-suit-project">
    <el-header class="r-suit-project__header">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-row :gutter="24">
            <el-col :span="7" style="padding-top:13px;">套装名称</el-col>
            <el-col :span="17">
              <el-select v-model="searchParams.suitName" filterable clearable>
                <el-option v-for="(item, index) in selectSuitNameList"
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
        <el-col :span="12">
          <div style="width:128px;float:right;">
            <el-button type="primary" size="small" @click="handleSearchBtnClick">搜索</el-button>
            <el-button type="primary" size="small" :disabled="true">导出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="r-suit-project__main">
      <el-table
      :data="dataSource"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="index"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="suitName"
        label="套装名称">
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称">
      </el-table-column>
    </el-table>
    </el-main>
    <el-footer class="r-suit-project__footer">
      <el-pagination background
        layout="prev, pager, next"
        :total="totalNumber"
        @current-change="handleCurrentPageChange">
      </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
const SUIT_NAME_SELECT = '/api/suit/suit/findAllSuitName';
const PROJECT_NAME_SELECT = '/api/pjc/project/findAllProjectName';
const GET_SUIT_PROJECT = '/api/suit/report/findSuitAndProjectList';
const RESPONSE_SUCCESS_CODE = 200;
export default {
  name: 'SuitProject',
  data () {
    return {
      searchParams: {
        suitName: '',
        projectName: '',
        currentPage: 1,
        limit: 10
      },
      totalNumber: 10,
      dataSource: [],
      concatArr: [],
      pos: 0,
      selectSuitNameList: [],
      selectProjectNameList: [],
      selectPageParams: {
        pageSize: 10,
        totalNumber: 0
      }
    };
  },
  mounted () {
    this.getSuitProjectList();
    Promise.all([this.getSuitNameSelectList(), this.getPorjectNameList()]).then(res => {}).catch(err => {});
  },
  methods: {
    getSuitNameSelectList () {
      return new Promise((resovle, reject) => {
        let _data = {};
        this.$http.post(SUIT_NAME_SELECT, _data, res => {
          this.$nextTick(() => {
            this.selectSuitNameList = [];
            if (res.data.code === RESPONSE_SUCCESS_CODE) {
              let listData = res.data.data.list;
              if (listData && Array.isArray(listData) && listData.length) {
                this.selectSuitNameList = listData;
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
    getSuitProjectList () {
      let _data = {
        pageNo: this.searchParams.currentPage,
        pageSize: this.searchParams.limit,
        suitId: this.searchParams.suitName,
        projectId: this.searchParams.projectName
      };
      this.$http.get(GET_SUIT_PROJECT, _data, res => {
        this.$nextTick(() => {
          this.dataSource = [];
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
        if (Array.isArray(element.projectVos) && element.projectVos.length) {
          element.projectVos.forEach((subEle, subIndex) => {
            let obj = {
              suitName: element.suitName,
              projectName: subEle.name,
              pos: index
            };
            arr.push(obj);
          });
        } else if (element.projectVos === null || !element.projectVos.length) {
          let obj = {
            suitName: element.suitName === null ? '空' : element.suitName,
            projectName: '',
            pos: index
          };
          arr.push(obj);
        }
      });
      arr.forEach((element, index) => {
        element.index = index + 1;
      });
      this.dataSource = arr;
      this.reSetData(arr);
      console.log(arr, 'arr');
    },
    reSetData (data) {
      this.concatArr = [];
      this.pos = 0;
      data.forEach((element, index) => {
        if (index === 0) {
          this.concatArr.push(1);
        } else {
          if (element.pos === data[index - 1].pos) {
            this.concatArr[this.pos] += 1;
            this.concatArr.push(0);
          } else {
            this.concatArr.push(1);
            this.pos = index;
          }
        }
      });
    },
    handleCurrentPageChange (val) {
      this.searchParams.currentPage = val;
      this.getSuitProjectList();
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.concatArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    handleSearchBtnClick () {
      this.getSuitProjectList();
    }
  }
}
</script>
<style>
.r-suit-project {
  height: 100%;
}
</style>
