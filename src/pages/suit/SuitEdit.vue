<template>
  <div class="extend-h-w">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="套装名称" prop="suitName">
          <el-input v-model="form.suitName" :maxlength="60" size="small"></el-input>
      </el-form-item>
      <el-form-item label="套装时间" prop="suitDate">
        <el-date-picker type="date"
                        placeholder="选择日期"
                        v-model="form.suitDate"
                        style="width: 100%;"
                        size="small"
                        :picker-options="datePickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="测试负责人" prop="testPerson">
        <el-select v-model="form.testPerson" placeholder="请选择测试负责人" filterable clearable size="small">
          <el-option v-for="item in testUserList"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联调负责人" prop="adjustPerson">
          <el-select v-model="form.adjustPerson" placeholder="请选择测试负责人" filterable clearable size="small">
          <el-option v-for="item in debuggingUserList"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId">
          </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="已关联项目及产品" v-if="$route.query.suitId?true:false">
        <div class="suitedit-list">
          <div v-for="(item, index) in infoTreeData" :key="item.id" class="list-item">
            <div class="item-project"><span>项目名称</span> : {{item.projectName}}</div>
            <div class="item-product"><span>产品名称</span> : {{item.productName}}</div>
            <div class="item-version"><span>版本</span> : {{item.verName}}</div>
            <el-button type="danger" icon="el-icon-close" circle @click="handleItemDeleteBtnClick(item, index)"></el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="关联项目及产品" >
        <template>
          <div>
            <treetransfer :from_data="projectList"
                          node_key="id"
                          :title="title"
                          :to_data="toData"
                          :defaultProps="{label:'label'}"
                          @addBtn="handleTransferAdd"
                          @removeBtn="handleTransferRemove"
                          :mode="mode" height="380px" filter openAll>
              </treetransfer>
            </div>
          </template>
      </el-form-item>
      <el-form-item label="详细描述" prop="suitDesc">
        <el-input type="textarea" v-model="form.suitDesc" :maxlength="240" size="small"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark" :maxlength="240" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmitSave" size="small">保存</el-button>
        <el-button @click="handleCancelBtnClick" size="small">取消</el-button>
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
        ],
        testPerson: [
          {required: true, message: '请选择测试负责人', trigger: 'blur'}
        ],
        adjustPerson: [
          {required: true, message: '请选择联调负责人', trigger: 'blur'}
        ],
        suitDesc: [
          {required: true, message: '请填写描述', trigger: 'blur'}
        ]
      }, // 表单验证
      form: {
        suitName: '',
        testPerson: '',
        adjustPerson: '',
        suitDate: '',
        suitDesc: '',
        remark: '',
        toData: []
      }, // 表单数据
      mode: "transfer", // transfer addressList 穿梭款模式转换
      title:['未关联列表', '已关联列表'], // 穿梭款两侧标题
      toData: [], // 已关联的数据
      infoTreeData: [], // 穿梭款上方已关联数据
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date('2000/01/01 00:00:00').getTime();
        }
      } // 日期的配置选项
    };
  },
  mounted () {
    Promise.all([this._getUserList(), this._getPorjectList()]).then(res => {
      if (this.$route.query.suitId) {
        this.suitInfo();
      } else {
        this.resetData();
      }
    });
  },
  methods: {
    // 获取用户类列表
    _getUserList () {
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
            }
            resolve(res);
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
            reject(res.data.msg);
          }
        });
      });
    },
    // 获取项目及产品及版本的列表
    _getPorjectList () {
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
    // 删除已有数据事件
    handleItemDeleteBtnClick (item, index) {
      this.infoTreeData.splice(index, 1);
    },
    // 向projectList合并已删除的数据
    concatFromData (item) {
      if (this.form.toData.length) {
        this.form.toData.forEach(element => {
          if (element.projectId === item.projectId) {
            if (element.versions.length) {
              if (item.productId) {
                element.children.push({});
              }
            } else {
              if (item.productId) {
                element.versions = [{
                  productId: item.productId,
                  productName: item.productName
                }];
              }
            }
            element.versions.forEach(productItem => {
              if (productItem.versions.length) {
                if (item.verId) {
                  productItem.versions.push({
                    versionId: item.verId,
                    verName: item.verName
                  });
                }
              } else {
                if (item.verId) {
                  productItem.versions = [{
                    verName: item.verName,
                    verId: item.verId
                  }];
                }
              }
            });
          } else {}
        });
      } else {
        this.form.toData.push({
          projectId: item.projectId,
          id: '1',
          pid: 0,
          label: item.productName,
          children: [{
            productid: item.productId,
            label: item.productName,
            id: '1-1',
            pid: '1',
            children: [{
              versionId: item.verId,
              label: item.verName,
              id: '1-1-1',
              pid: '1-1'
            }]
          }]
        });
      }
    },
    // 用于合并formData的version方法
    versionDataConcat (element, item) {
      element.versions.forEach(productItem => {
        if (productItem.versions.length) {
          if (item.verId) {
            productItem.versions.push({
              versionId: item.verId,
              verName: item.verName
            });
          }
        } else {
          if (item.verId) {
            productItem.versions = [{
              verName: item.verName,
              verId: item.verId
            }];
          }
        }
      });
    },
    // 点击提交表单
    handleSubmitSave () {
      if (this.$route.query.suitId) {
        this.handleEditSuit();
      } else {
        this.handleAddSuit();
      }
    },
    // 取消新增返回列表页面
    handleCancelBtnClick () {
      this.$router.replace({
        name: 'Suit'
      });
    },
    // 新建套装点击事件
    handleAddSuit () {
      if (!this.form.toData.length) {
        this.$message({
          message: '请选择要关联的数据',
          type: 'warning'
        });
        return false;
      }
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
              this.$router.replace({
                name: 'Suit'
              });
            });
          });
        }
      });
    },
    // 合并数据用于编辑中
    concatData () {
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
    },
    // 去重toData中数据
    removalToData () {
      if (this.infoTreeData.length && this.projectList.length) {
        let delProjectArr = [];
        this.projectList.forEach((element, index) => {
          this.infoTreeData.forEach(treeEle => {
            if (element.projectId === treeEle.projectId) {
              if (element.children.length) {
                let productArr = [];
                element.children.forEach((item, index) => {
                  if (item.productId === treeEle.productId) {
                    productArr.push(index);
                    let verItemArr = [];
                    if (item.children.length) {
                      item.children.forEach((verItem, verIndex) => {
                        if (verItem.versionId === treeEle.verId) {
                          verItemArr.push(verIndex);
                        }
                      });
                    }
                    if (verItemArr.length) {
                      verItemArr.forEach((verItem, verIndex) => {
                        item.children.splice(verItem - verIndex, 1);
                      });
                    }
                  }
                });
                if (productArr.length) {
                  productArr.forEach((productItem, productIndex) => {
                    element.children.splice(productItem - productIndex, 1);
                  });
                }
              }
              if (!element.children.length) {
                delProjectArr.push(index);
              }
            }
          });
        });
        if (delProjectArr.length) {
          delProjectArr.forEach((element, index) => {
            this.projectList.splice(element - index, 1);
          });
        }
      }
    },
    // 编辑套装事件
    handleEditSuit () {
      if (!this.infoTreeData.length && !this.form.toData.length) {
        this.$message({
          message: '请选择要关联的数据',
          type: 'warning'
        });
        return false;
      }
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
              this.$router.replace({
                name: 'Suit'
              });
            });
          });
        }
      });
    },
    // 已关联的数据拼接成字符串
    setCheckedData () {
      if (this.form.toData.length) {
        let arr = [];
        for(let i = 0; i < this.form.toData.length; i++) {
          let products = this.form.toData[i].children.length;
          let productList = this.form.toData[i].children;
          if(products > 0) {
            for(let s = 0; s < products; s++) {
              let versions = productList[s].children.length;
              let versionList = productList[s].children;
              if(versions > 0){
                for(let k = 0; k < versions; k++) {
                  arr.push(`${this.form.toData[i].projectId}#${productList[s].productId}#${versionList[k].versionId}`);
                }
              } else {
                arr.push(`${this.form.toData[i].projectId}#${productList[s].productId}`);
              }
            }
          } else {
            arr.push(`${this.form.toData[i].projectId}`);
          }
        }
        let string = arr.join('&');
        return string;
      } else {
        return '';
      }
    },
    // 获取套装详情用于编辑时展示数据
    suitInfo () {
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
            this.removalToData();
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        });
      });
    },
    // 重置表单数据
    resetData () {
      for (const key in this.form) {
        if (Array.isArray(this.form[key])) {
          this.form[key] = [];
        } else {
          this.form[key] = '';
        }
      }
    },
      // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode () {
      if (this.mode == "transfer") {
        this.mode = "addressList";
      } else {
        this.mode = "transfer";
      }
    },
    // 将后端给的数据添加一些必要key
    setDataForTree (data) {
      data.forEach((element, index) => {
        element.pid = 0;
        element.id = (index + 1).toString();
        element.label = element.name === null ? '' : element.name;
        element.children = element.products;
        delete element.products;
        if (Array.isArray(element.children) && element.children.length) {
          element.children.forEach((item, itemIndex) => {
            item.label = item.productName === null ? '' : item.productName;
            item.id = `${element.id}-${itemIndex + 1}`;
            item.pid = element.id;
            item.children = item.versions;
            delete item.versions;
            if (Array.isArray(item.children) && item.children.length) {
              item.children.forEach((verItem, verIndex) => {
                verItem.label = verItem.verName === null ? '' : verItem.verName;
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
    compareData (params) {
      return function (obj1, obj2) {
        let val1 = obj1[params];
        let val2 = obj2[params]; 
        if (val1 < val2 ) { //正序
          return 1;
        } else if (val1 > val2 ) { 
          return -1; 
        } else { 
          return 0; 
        }
      }
    },
    // 监听穿梭框组件添加
    handleTransferAdd (fromData, toData, obj) {
      this.form.toData = toData;
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
    },
    // 监听穿梭框组件移除
    handleTransferRemove (fromData, toData, obj) {
      this.form.toData = toData;
      this.projectList = fromData.sort(this.compareData('id'));
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
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
  width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  overflow-y: auto;
}
.list-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;
  border-bottom: #ebeef5;
}
.list-item:hover {
  background: rgba(245, 247, 250);
}
.list-item>div {
  width: auto;
  line-height: 40px;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #606266;
  padding-left: 5px;
  margin-right: 10px;
}
.list-item>div>span {
  font-weight: 600;
}
.suitedit-list .el-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  padding: 5px;
}
</style>