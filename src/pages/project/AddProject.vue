<template>
    <div  class="extend-h-w">
               <el-container class="extend-h-w" direction = "vertical">
                   <router-link to = "project">返回</router-link>
                   <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                             <h2 class = "sl-title">{{$route.meta.title}}</h2>
                    </el-row>
                     
                          <el-container class="extend-h-w" direction = "vertical">
                            <el-row type = "flex" justify = "center">
                                <el-col :span = "10">
                                   <el-form ref="form" :model="sizeForm"  label-width="100px" :rules="rules" size="small">
                                        <el-form-item label="项目名称">
                                                  <el-input v-model="sizeForm.name"></el-input>
                                        </el-form-item>
                                        <el-form-item label="项目类型">
                                              <el-select v-model="sizeForm.typeId" placeholder="请选择" class="extend-w">
                                              <el-option
                                                v-for="item in typeList"
                                                :key="item.projecttypeId"
                                                :label="item.typeName"
                                                :value="item.projecttypeId">
                                              </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="优先级">
                                            <el-select v-model="sizeForm.priorityId" placeholder="请选择" class="extend-w">
                                              <el-option
                                                v-for="item in priorityList"
                                                :key="item.priorityId"
                                                :label="item.priorityName"
                                                :value="item.priorityId">
                                              </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="需求提出人">
                                              <el-select v-model="sizeForm.needPerson" placeholder="请选择" class="extend-w">
                                              <el-option 
                                                v-for = "(item) in rdList"
                                                :key = "item.userId"

                                              :label="item.userName" :value="item.userId"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="项目负责人">
                                              <el-select v-model="sizeForm.chargeperson" placeholder="请选择" class="extend-w">
                                              <el-option 
                                                v-for = "(item) in rdList"
                                                :key = "item.userId"

                                              :label="item.userName" :value="item.userId"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="开始时间">
                                                  <el-date-picker
                                                    class = "extend-w"
                                                    type="date"
                                                    placeholder="开始时间"
                                                    value-format = "yyyy-MM-dd"
                                                    v-model = "sizeForm.starttime"
                                                    >
                                                   </el-date-picker>
                                        </el-form-item>
                                        <el-form-item label="计划完成时间">
                                                    <el-date-picker
                                                    class = "extend-w"
                                                    type="date"
                                                    placeholder="开始时间"
                                                    value-format = "yyyy-MM-dd"
                                                    v-model = "sizeForm.finshtime"
                                                    >
                                                   </el-date-picker>
                                        </el-form-item>
                                        <el-form-item label="项目推迟天数">
                                                  <el-input v-model="sizeForm.delaydays"></el-input>
                                        </el-form-item>
                                        <el-form-item label="关联产品">
                                         
                                           <el-cascader
                                            
                                            ref = "cascaderInput"
                                           clearable
                                           filterable
                                            class = "extend-w"
                                            expand-trigger="hover"
                                            :options="allPudPjc"
                                            :props = "allprotype"
                                            v-model="selectedOptions"
                                            @change="handleChange">
                                            
                                          </el-cascader>
                                           <el-col><el-tag
                                            :key="index"
                                            v-for="(item,index) in proverList"
                                            class = "margin-r5"
                                            closable
                                            :disable-transitions="false"
                                            size="small"
                                            @close="handleClose(index)">
                                            {{item.label}}
                                          </el-tag></el-col>
                                        </el-form-item>
                                      <el-form-item label="SVN文档地址">
                                                  <el-input v-model="sizeForm.var2"></el-input>
                                        </el-form-item>
                                        <el-form-item label="备注">
                                             <el-input v-model="sizeForm.var3"
                                             type="textarea"
                                             :rows="2"
                                             placeholder="请输入内容" 
                                             ></el-input>
                                        </el-form-item>
                                        <el-form-item size="large">
                                            <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                                            <el-button @click = "resetForm('form')">重置</el-button>
                                        </el-form-item>
                                </el-form>
                                </el-col>
                                       
                            </el-row>
                        
                         </el-container >
                          <el-footer>
                            <sl-foot></sl-foot>
                          </el-footer>
               </el-container>
          

    </div>
</template>
<script>
/**
 * http://192.168.95.93:8089/product/addProduct?
 *         productName=xxx&verName=xxx&verRdperson=xxx&verRemark=xxx&verDescription=xxx&userId=xxx

 *    
      http://192.168.95.93:8089/product/findProductByName?
                productName=启明2
      
      http://192.168.95.93:8089/product/findAllProduct  
              --产品名称下拉列表(支持分页)
 * 
 * 
 * 
 * 
 */
import Slfoot from "../../components/Foot";
// import options from "./optionList.js";
export default {
  name: "addproduct",
  components: {
    "sl-foot": Slfoot
  },
  props: ["type"],
  data() {
    // let checkName = (rule, value, callback) => {
    //   this.$http.get(
    //     "/vdev/product/findProductByName",
    //     {
    //       productName: value
    //     },
    //     res => {
    //       if (res.status === 200) {
    //         if (res.data.code === 200) {
    //           callback();
    //         } else {
    //           callback(new Error("名称重复"));
    //         }
    //       } else {
    //       }
    //     }
    //   );
    // };
    /**
     * 
     * projectId	否	string	项目ID
      name	否	string	项目名称
      priorityId	否	string	项目优先级
      typeId	否	string	项目类型
      needPerson	否	string	需求提出人（是人员姓名，不是人员ID）
      starttime	否	string	项目开始时间
      finshtime	否	string	项目结束时间
      delaydays	否	string	项目推迟天数
      chargeperson	否	string	项目负责人
      productVer	否	string	项目关联产品（产品ID-版本ID，多个组合用&拼接）
      var2	否	string	项目svn文档路劲
      var3
     * 
     * 
     */

    return {
      // options: options,

      rdList: [],
      typeList: [],
      priorityList: [],
      allprotype: {
        value: "value",
        label: "label",
        children: "products"
      },
      allPudPjc: [], // 说有关联版本
      proverList: [],  // 选中的多版本项目
      selectedOptions: [], // 选中的值
      sizeForm: {
        // projectId: "",
        name: "",
        priorityId: "",
        typeId: "",
        needPerson: "", //needperson
        starttime: "",
        finshtime: "",
        delaydays: "", // 版本名称
        chargeperson: "", // 研发负责人
        productVer: "", // 备注
        var2: "", //  文档上传路径
        var3: "" // 备注
      },
      rules: {
        // productName: [{ validator: checkName, trigger: "blur" }]
      },
      uploadUrl: "/dev/file/upload",
      isSuccess: false // 是否禁用
    };
  },
  watch: {
    // $route(to, from) {
    //   //   console.log(to);
    // }
  },

  mounted() {
    this.getTypeAndPriority();
    // this.getRdList();
    if (this.type === "edit") {
      // let obj = this.sizeForm;
      // for (let k in obj) {
      //   if (Object.prototype.hasOwnProperty.call(obj, k)) {
      //     obj[k] = this.$route.params.data[k];
      //   }
      // }
      // obj.needPerson = this.$route.params.data['needperson']
      // // console.log(this.$route.params.data)
      // this.sizeForm = obj;
       console.log(this.$route.query.projectId)
      this.getSigleProject(this.$route.query.projectId)
    }
  },
  methods: {
    handleClose(index) {
      this.proverList.splice(index, 1);
      if(this.proverList.length ===0){
        this.selectedOptions =[]
      }
    },
    handleChange(value) {
      if (value.length === 0) {
        return;
      }
      let obj = {};
      let label = this.$refs.cascaderInput.currentLabels;
      let flag = true;
      for (let i = 0, len = this.proverList.length; i < len; i++) {
        let item = this.proverList[i];
        let itemvalue = JSON.stringify(item.value);
        if (itemvalue === JSON.stringify(value)) {
          flag = false;
          break;
        }
      }
      if (flag) {
        obj.value = value;
        obj.label = label[label.length-1];
        this.proverList.push(obj);
      }
    },
    /**
     * 优先级列表
     * 所属类型列表
     *
     */
    getTypeAndPriority() {
      let getList = [
        // 优先级
        {
          url: "api/pjc/project/findAllProjectType",
          method: "get"
        },
        // 所属类型
        {
          url: "api/pjc/project/findAllPriority",
          method: "get"
        },
        // 级联关系
        {
          url: "api/umc/user/findUserByUser",
          method: "get"
        },
        // 查询所有项目及关联的版本
        {
          url: "api/pjc/project/findAllProjectProductVer",
          method: "post"
        }
      ];
      this.$http.all(getList, (res1, res2, res3, res4) => {
        if (res1.status === 200) {
          if (res1.data.code === 200) {
            this.typeList = res1.data.data;
          }
        }
        // console.log(res2)
        if (res2.status === 200) {
          if (res2.data.code === 200) {
            this.priorityList = res2.data.data;
          }
        }
        if (res3.status === 200) {
          if (res3.data.code === 200) {
            this.rdList = res3.data.data;
          }
        }
        if (res4.status === 200) {
          if (res4.data.code === 200) {
            let list = res4.data.data;
            this.allPudPjc = list;
          }
        }
      });
    },
    formatData(data) {
      let obj = [
        {
          value: "projectId",
          label: "name"
        },
        {
          value: "productId",
          label: "productName"
        },
        {
          value: "versionId",
          label: "verName"
        }
      ];
    },
    /**
     *
     * 保存信息
     *
     */
    onSubmit(formName) {
      let obj, url, msger, msgsuc, productVer;
      productVer = this.proverList.map(t => {
        return t.value.join("#");
      });
      productVer = productVer.join("&");
      if (this.type === "add") {
        obj = this.sizeForm;
        // obj.productId = this.$route.params.data.productId;
        // let  productVer
        obj.productVer = productVer;
        url = "api/pjc/project/addProject";
        msgsuc = "添加成功";
        msger = "添加失败";
      } else {
        obj = this.sizeForm;
        obj.productVer = productVer;
        obj.projectId = this.$route.query.projectId;
        // obj.versionId = this.$route.params.data.versionId;
        url = "api/pjc/project/updateProject";
        msgsuc = "修改成功";
        msger = "修改失败";
      }

      this.$http.post(url, obj, res => {
        // console.log(res)
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.$message({
              message: msgsuc,
              type: "success"
            });

            if (this.type === "add") {
              this.$refs[formName].resetFields();
              let sizeForm = this.sizeForm;
              for (let k in sizeForm) {
                if (Object.prototype.hasOwnProperty.call(sizeForm, k)) {
                  sizeForm[k] = "";
                }
              }
              this.sizeForm = sizeForm;
              this.proverList =[]
              this.selectedOptions =[]
            }
          } else {
            this.$message.error(msger);
          }
        }
      });
    },
    /**
     * 重置
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      let obj = this.sizeForm;
      for (let k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          obj[k] = "";
        }
      }
      this.sizeForm = obj;
      this.proverList =[]
      this.selectedOptions =[]
    },
    /**
     * 详情的获取
     * 
     * 
     */
    getSigleProject(projectId){
      this.$http.post('api/pjc/project/findProject',{
        projectId:projectId
      },res =>{
        if(res.status ===200){
          if(res.data.code ===200){
            let data = res.data.data;
            let obj = this.sizeForm;
            for(let k in obj){
              if(Object.prototype.hasOwnProperty.call(obj,k)){
                obj[k] = data[k] 
              }
            }
            obj.needPerson = data['needperson']
            this.sizeForm = obj;
            this.proverList = []
            if(data.productVrelList.length>0){
               let arr =[]
              data.productVrelList.forEach(t =>{
                let value=[],label=[];
                ['project','product','version'].forEach(k =>{
                  if(t[`${k}Id`]){
                      value.push(t[`${k}Id`])
                      label.push(t[`${k}Name`])
                  }
                })
              
               arr.push({value,label})
             
              })   
              this.proverList = arr;
            }
            
          }
        }
      })
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


