<template>
  <div class="extend-h-w">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="套装名称" prop="suitName">
          <el-input v-model="form.suitName"></el-input>
      </el-form-item>
      <el-form-item label="套装时间" prop="suitDate">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.suitDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="测试负责人">
        <el-select v-model="form.testPerson" placeholder="请选择测试负责人">
          <el-option v-for="item in testUserList" :key="item.userId" :label="item.userName" :value="item.userName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联调负责人">
          <el-select v-model="form.adjustPerson" placeholder="请选择测试负责人">
          <el-option v-for="item in debuggingUserList" :key="item.userId" :label="item.userName" :value="item.userName"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="关联项目及产品" >
        <template>
          <div>
            <treetransfer
                :from_data='projectList'
                :title="title"
                :to_data='toData'
                :defaultProps="{label:'label'}"
                @addBtn='handleTransferAdd'
                @removeBtn='handleTransferRemove'
                :mode='mode' height='380px' filter openAll>
              </treetransfer>
            </div>
          </template>
      </el-form-item>
      <el-form-item label="详细描述">
        <el-input type="textarea" v-model="form.suitDesc"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmitSave">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import treetransfer from "el-tree-transfer";
import moment from 'moment';

const GET_USER_LIST = '/api/umc/user/findUserByUser';
const PROJECT_LIST = '/api/pjc/project/findAllProjectProductVer';
const ADD_SUIT = '/api/suit/suit/addSuit';
const EDIT_SUIT = '/api/suit/suit/findSuit?suitId=7a9166e6afcf4c11a06b587c64f27873';
const UPDATE_SUIT = '/api/suit/suit/updateSuit';
const SUIT_LIST = '/api/suit/suit/findAllProjectPage';
const RESPONSE_SUCCESS_CODE = 200;

export default {
    name: 'SuitEdit',
    components: {
      treetransfer
    },
    data() {
    return {
      testUserList: [], // 测试人员列表
      debuggingUserList: [], // 联调任务列表
      projectList: [], // 项目列表
      rules: {
        suitName: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],  
        suitDate: [
          {required: true, message: '请选择时间', trigger: 'blur'}
        ]
      },
      form: {
        suitName: '',
        testPerson: '',
        adjustPerson: '',
        suitDate: '',
        suitDesc: '',
        remark: '',
        toData: []
      },
      mode: "transfer", // transfer addressList
      title:['未关联列表', '已关联列表'],
      toData: [] // 已关联的数据
    };
  },
  mounted () {
    Promise.all([this._getUserList(), this._getPorjectList()]).then(res => {
      this.testFunc();
      if (this.$route.query.suitId) {
        this.suitInfo();
      } else {
        this.resetData();
      }
    });
  },
  methods: {
    testFunc() {
      let _data = {
        suitName: '',
        suitDate: ''
      };
      this.$http.post(SUIT_LIST, _data, res => {
        this.$nextTick(() => {
          console.log(res, 'list');
        });
      });
    },
    // 私有方法获取用户类列表
    _getUserList() {
      return new Promise((resolve, reject) => {
        let _data = {
          userId: '',
          userName: '',
          password: '',
          mobile: '',
          status: 1,
          var1: '',
          var2: '',
          var3: '',
          toUrl: '',
          roles: []
        };
        this.$http.get(GET_USER_LIST, {}, res => {
          this.testUserList = [];
          this.debuggingUserList = [];
          if (res.data.code === RESPONSE_SUCCESS_CODE) {
            let resList = res.data.data;
            if (resList && Array.isArray(resList) && resList.length) {
              this.testUserList = resList;
              this.debuggingUserList = resList;
              resolve(res);
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      });
    },
    _getPorjectList() {
      return new Promise((resolve, reject) => {
        this.$http.post(PROJECT_LIST, {}, res => {
          this.projectList = [];
          this.$nextTick(() => {
            if (res.data.code === RESPONSE_SUCCESS_CODE) {
              let resList = res.data.data;
              if (resList && Array.isArray(resList) && resList.length) {
                this.projectList = this.setDataForTree(resList);
                resolve(res);
              }
              console.log(this.projectList, 'list');
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          });
        });
      });
    },
    handleSubmitSave() {
      if (this.$route.query.suitId) {
        this.handleEditSuit();
      } else {
        this.handleAddSuit();
      }
    },
    handleAddSuit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let _data = {
            suitName: this.form.suitName,
            suitDate: moment(this.form.suitDate).format('YYYY-MM-DD'),
            adjustPerson: this.form.adjustPerson,
            testPerson: this.form.testPerson,
            suitProjectProdctVer: this.setCheckedData(),
            suitDesc: this.form.suitDesc,
            var1: this.form.remark
          };
          this.$http.post(ADD_SUIT, _data, res => {
            this.$nextTick(() => {
              this.$message({
                message: res.data.msg,
                type: res.data.code === RESPONSE_SUCCESS_CODE ? 'success' : 'error'
              });
            });
          });
        }
      });
    },
    handleEditSuit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let _data = {
            suitId: this.$route.query.suitId,
            suitName: this.form.suitName,
            suitDate: moment(this.form.suitDate).format('YYYY-MM-DD'),
            adjustPerson: this.form.adjustPerson,
            testPerson: this.form.testPerson,
            suitProjectProdctVer: this.setCheckedData(),
            suitDesc: this.form.suitDesc,
            var1: this.form.remark
          };
          this.$http.post(UPDATE_SUIT, _data, res => {
            this.$nextTick(() => {
              this.$message({
                message: res.data.msg,
                type: res.data.code === RESPONSE_SUCCESS_CODE ? 'success' : 'error'
              });
            });
          });
        }
      });
    },
    setEditTreeData(tree) {
      let toData = [];
      let project = JSON.parse(JSON.stringify(this.projectList));
      project.forEach(element => {
        tree.forEach(item => {
          if (element.projectId === item.projectId) {
            if (item.productId !== '') {
              let delProductIndex = [];
              element.children.forEach((productItem, index) => {
                if (productItem.productId !== item.productId) {
                  delProductIndex.push(index);
                }
              });
              if (delProductIndex.length) {
                delProductIndex.forEach((del, delIndex) => {
                  element.children.splice(del, 1);
                });
              }
              if (item.verId !== '') {
                if (element.children.children.length) {
                  let delVerIndex = [];
                  element.children.children.forEach((children, chIndex) => {});
                }
              }
            }
          }
        });
      });
      let delProductIndex = [];
      toData.forEach(element => {
        if (element.children.length) {
          element.children.forEach(item => {
            
          });
        }
      });
    },
    setCheckedData() {
      if (this.form.toData.length) {
        let string = '';
        this.form.toData.forEach(element => {
          if (string !== '') {
            string = `${string}&${element.projectId}`;
          } else {
            string += element.projectId;
          }
          if (element.children.length) {
            element.children.forEach(item => {
              string += ('#' + item.productId);
              if (item.children.length) {
                item.children.forEach(verItem => {
                  string += ('#' + verItem.versionId);
                });
              }
            });
          }
        });
        return string;
      }
    },
    suitInfo() {
      let _data = {
        suitId: this.$route.query.suitId || 'dbf73e9fbef94348bf2bee1a9ef4a2c7'
      };
      this.$http.post(EDIT_SUIT, _data, res => {
        this.$nextTick(() => {
          let responseData = res.data.data;
          this.form.adjustPerson = responseData.adjustPerson;
          this.form.suitDate = responseData.suitDate;
          this.form.suitDesc = responseData.suitDesc;
          this.form.suitName = responseData.suitName;
          this.form.testPerson = responseData.testPerson;
          this.form.remark = responseData.var1;
        });
      });
    },
    resetData() {
      for (const key in this.form) {
        if (Array.isArray(this.form[key])) {
          this.form[key] = [];
        } else {
          this.form[key] = '';
        }
      }
    },
      // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode() {
      if (this.mode == "transfer") {
        this.mode = "addressList";
      } else {
        this.mode = "transfer";
      }
    },
    setDataForTree(data) {
      data.forEach((element, index) => {
        element.key = index;
        element.pid = 0;
        element.id = (index + 1).toString();
        element.label = element.name;
        if (Array.isArray(element.products) && element.products.length) {
          element.children = element.products;
          element.children.forEach((item, itemIndex) => {
            item.label = item.productName;
            item.id = `${element.id}-${itemIndex + 1}`;
            item.pid = element.id;
            item.children = item.versions;
            if (Array.isArray(item.versions) && item.versions.length) {
              item.children.forEach((verItem, verIndex) => {
                verItem.label = verItem.verName;
                verItem.id = `${item.id}-${verIndex + 1}`;
                verItem.pid = item.id;
              });
            } else {
              item.children = [];
            }
          });
        } else {
          element.children = [];
        }
      });
      return data;
    },
    // 监听穿梭框组件添加
    handleTransferAdd(fromData, toData, obj) {
      this.form.toData = toData;
      console.log('add');
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    },
    // 监听穿梭框组件移除
    handleTransferRemove(fromData, toData, obj) {
      this.form.toData = toData;
      console.log('remove');
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    }
  }
};
</script>

<style scoped>
.el-transfer {
  width: 8rem;
}
</style>