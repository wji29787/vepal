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
          <el-option v-for="item in testUserList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联调负责人">
          <el-select v-model="form.adjustPerson" placeholder="请选择测试负责人">
          <el-option v-for="item in debuggingUserList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="已关联项目及产品" v-if="$route.query.suitId?true:false">
        <div class="suitedit-list">
          <div v-for="item in infoTreeData" :key="item.id" class="list-item">
            <div class="item-project">项目名称 : {{item.projectName}}</div>
            <div class="item-product">产品名称 : {{item.productName}}</div>
            <div class="item-version">版本 : {{item.verName}}</div>
            <el-button type="danger" icon="el-icon-close" circle @click="handleItemDeleteBtnClick"></el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="关联项目及产品" >
        <template>
          <div>
            <treetransfer :from_data='projectList'
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
import moment,{ relativeTimeRounding } from 'moment';

const GET_USER_LIST = '/api/umc/user/findUserByUser';
const PROJECT_LIST = '/api/pjc/project/findAllProjectProductVer';
const ADD_SUIT = '/api/suit/suit/addSuit';
const EDIT_SUIT = '/api/suit/suit/findSuit';
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
      toData: [], // 已关联的数据
      infoTreeData: []
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
    handleItemDeleteBtnClick(item, index) {
      this.infoTreeData.splice(index, 1);
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
          let selectTest = this.testUserList.filter(element => {
            return element.userId === this.form.testPerson;
          });
          let selectAd = this.debuggingUserList.filter(element => {
            return element.userId === this.form.adjustPerson;
          });
          let _data = {
            suitName: this.form.suitName,
            suitDate: moment(this.form.suitDate).format('YYYY-MM-DD'),
            adjustPerson: this.form.adjustPerson,
            testPerson: this.form.testPerson,
            suitProjectProdctVer: this.setCheckedData(),
            suitDesc: this.form.suitDesc,
            var1: this.form.remark,
            var2: selectTest[0].userName,
            var3: selectAd[0].userName
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
    concatData() {
      if (this.form.toData.length) {
        this.form.toData.forEach(element => {
          if (this.infoTreeData.length) {
            this.infoTreeData.forEach(infoEle => {
              if (element.projectId === infoEle.projectId) {
                if (element.children.length) {
                  let itemCount = 0;
                  element.children.forEach(item => {
                    if (item.productId === infoEle.productId) {
                      itemCount++;
                    }
                    if (item.children.length) {
                      let verCount = 0;
                      item.children.forEach(verItem => {
                        if (verItem.versionId === infoEle.verId) {
                          verCount++;
                        }
                      });
                      if (!verCount) {
                        item.children.push({
                          versionId: infoEle.verId,
                          label: infoEle.verName
                        });
                      }
                    }
                  });
                  if (!itemCount) {
                    element.children.push({
                      productId: infoEle.productId,
                      label: infoEle.productName
                    });
                  }
                }
              } else {
                this.form.toData.push({
                  projectId: infoEle.projectId,
                  children: [{
                    productId: infoEle.productId,
                    label: infoEle.productName,
                    children: [{
                      versionId: infoEle.verId,
                      label: infoEle.verName
                    }]
                  }]
                });
              }
            });
          }
        });
      } else {
        if (this.infoTreeData.length) {
          this.infoTreeData.forEach(infoEle => {
            this.form.toData.push({
              projectId: infoEle.projectId,
              children: [{
                productId: infoEle.productId,
                label: infoEle.productName,
                children: [{
                  versionId: infoEle.verId,
                  label: infoEle.verName
                }]
              }]
            });
          })
        } else {
          this.form.toData = [];
        }
      }
      console.log(this.form.toData, 'toData');
    },
    handleEditSuit() {
      this.concatData();
      this.$refs['form'].validate(valid => {
        if (valid) {
          let selectTest = this.testUserList.filter(element => {
            return element.userId === this.form.testPerson;
          });
          let selectAd = this.debuggingUserList.filter(element => {
            return element.userId === this.form.adjustPerson;
          });
          let _data = {
            suitId: this.$route.query.suitId,
            suitName: this.form.suitName,
            suitDate: moment(this.form.suitDate).format('YYYY-MM-DD'),
            adjustPerson: this.form.adjustPerson,
            testPerson: this.form.testPerson,
            suitProjectProdctVer: this.setCheckedData(),
            suitDesc: this.form.suitDesc,
            var1: this.form.remark,
            var2: selectTest[0].userName,
            var3: selectAd[0].userName
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
                  element.children.children.forEach((children, chIndex) => {
                    children.versionId
                  });
                }
              }
            }
          }
        });
      });
    },
    setCheckedData() {
      if (this.form.toData.length) {
        let arr = [];
        for(let i = 0; i < this.form.toData.length; i++) {
          let clen = this.form.toData[i].children.length;
          let clist = this.form.toData[i].children;
          if(clen > 0){
            for(let s = 0; s < clen; s++){
              let cclen = clist[s].children.length;
              let cclist = clist[s].children;
              if(cclen > 0){
                for(let k = 0; k < cclen; k++){
                  let obj = {
                    projectId: this.form.toData[i].projectId,
                    productId: clist[s].productId,
                    verId: cclist[k].versionId
                  };
                  arr.push(`${this.form.toData[i].projectId}#${clist[s].productId}#${cclist[k].versionId}`);
                }
              }
            }
          }
        }
        let string = arr.join('&');
        console.log(string, 'string');
        return string;
      } else {
        return '';
      }
    },
    suitInfo() {
      let _data = {
        suitId: this.$route.query.suitId
      };
      this.$http.post(EDIT_SUIT, _data, res => {
        this.$nextTick(() => {
          if (res.data.code === RESPONSE_SUCCESS_CODE) {
            let responseData = res.data.data;
            this.form.adjustPerson = responseData.adjustPerson;
            this.form.suitDate = responseData.suitDate;
            this.form.suitDesc = responseData.suitDesc;
            this.form.suitName = responseData.suitName;
            this.form.testPerson = responseData.testPerson;
            this.form.remark = responseData.var1;
            this.infoTreeData = responseData.projectProductVers;
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
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
.suitedit-list {
  position: relative;
  height: 200px;
  width: 280px;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  overflow-y: auto;
}
.list-item {
  position: relative;
  height: 120px;
  width: 100%;
  border-bottom: #ebeef5;
}
.list-item:hover {
  background: rgba(245, 247, 250);
}
.list-item>div {
  padding-left: 5px;
  padding-right: 26px;
  line-height: 40px;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #606266;
}
.suitedit-list .el-button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  padding: 5px;
}
</style>