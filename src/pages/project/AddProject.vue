<template>
    <div  class="extend-h-w">
               <el-container class="extend-h-w minc-height" direction = "vertical">
                   <el-row>
                     <router-link to = "../project">返回</router-link>
                   </el-row>
                   
                   <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                             <h2 class = "sl-title">{{$route.meta.title}}</h2>
                    </el-row>
                     
                          <el-container class="extend-h-w" direction = "vertical">
                            <el-row type = "flex" justify = "center">
                                <el-col :span = "10">
                                   <el-form ref="form" :model="sizeForm"  label-width="120px" :rules="rules" size="small">
                                        <el-form-item label="项目名称" prop = "name">
                                                  <el-input v-model="sizeForm.name"></el-input>
                                        </el-form-item>
                                        <el-form-item label="项目类型" prop = "typeId">
                                              <el-select 
                                                filterable
                                                clearable 
                                                v-model="sizeForm.typeId" 
                                                placeholder="请选择" class="extend-w">
                                              <el-option
                                                v-for="item in typeList"
                                                :key="item.projecttypeId"
                                                :label="item.typeName"
                                                :value="item.projecttypeId">
                                              </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="优先级" prop = "priorityId">
                                            <el-select 
                                                filterable
                                                clearable 
                                                v-model="sizeForm.priorityId" 
                                                placeholder="请选择" class="extend-w">
                                              <el-option
                                                v-for="item in priorityList"
                                                :key="item.priorityId"
                                                :label="item.priorityName"
                                                :value="item.priorityId">
                                              </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="需求提出人" prop = "needperson">
                                              <el-select 
                                                 filterable
                                                  clearable 
                                                 v-model="sizeForm.needperson" 
                                                 placeholder="请选择" class="extend-w">
                                              <el-option 
                                                v-for = "(item) in rdList"
                                                :key = "item.userId"

                                              :label="item.userName" :value="item.userId"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="项目负责人" prop = "chargeperson">
                                              <el-select 
                                                 filterable
                                                clearable 
                                                 v-model="sizeForm.chargeperson" 
                                                 placeholder="请选择" class="extend-w">
                                              <el-option 
                                                v-for = "(item) in rdList"
                                                :key = "item.userId"

                                              :label="item.userName" :value="item.userId"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="开始时间" prop = "starttime">
                                                  <el-date-picker
                                                    class = "extend-w"
                                                    type="date"
                                                    placeholder="开始时间"
                                                    value-format = "yyyy-MM-dd"
                                                    v-model = "sizeForm.starttime"
                                                    
                                                    >
                                                   </el-date-picker>
                                                   <!-- :picker-options="pickerStart" -->
                                        </el-form-item>
                                        <el-form-item label="计划完成时间" prop = "finshtime">
                                                    <el-date-picker
                                                    class = "extend-w"
                                                    type="date"
                                                    placeholder="开始时间"
                                                    value-format = "yyyy-MM-dd"
                                                    v-model = "sizeForm.finshtime"
                                                    :picker-options="datePickerOptions"
                                                    >
                                                   </el-date-picker>
                                        </el-form-item>
                                        <el-form-item label="项目推迟天数" prop = "delaydays">
                                                  <el-input v-model.number="sizeForm.delaydays"></el-input>
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
                                           <el-col class = "min-h-formItem"><el-tag
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
                                        <el-form-item label="备注" prop = "var3">
                                             <el-input v-model="sizeForm.var3"
                                             type="textarea"
                                             :rows="2"
                                             placeholder="请输入内容" 
                                             ></el-input>
                                        </el-form-item>
                                        <el-form-item size="large">
                                            <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                                            <el-button @click = "cancleBtn('form')">取消</el-button>
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
     let checkDeyDate = (rule, value, callback) =>{
          
     }
    /**
     * 
     * projectId	否	string	项目ID
      name	否	string	项目名称
      priorityId	否	string	项目优先级
      typeId	否	string	项目类型
      needperson	否	string	需求提出人（是人员姓名，不是人员ID）
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
     const rules = {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { max:100, message: '最多不超过100个字符', trigger: 'blur' }
          ],
        typeId: [
           { required: true, message: '请选择类型', trigger: 'change' }],
        priorityId: [
           { required: true, message: '请上优先级',trigger: 'change' }],    
        needperson: [
           { required: true, message: '请选择项目需求人', trigger: 'change'}], 
        // chargeperson: [
        //    { required: true, message: '请选择项目负责人', trigger: 'change'}], 
        var3: [
           { max:200, message: '最多不超过200个字符', trigger: 'blur' }], 
        delaydays: [
           {type: 'number', message: '推迟天数不能为空', trigger: 'blur' },
          //  {type: 'number', message: '必须为数字', trigger: 'blur' },
           { type: 'number',message: '必须为数字', trigger: 'blur',transform (value){
              if(value){
                return value
              } 
           } },
           
           ]  
      }
     // 级联显示的属性 
    const allprotype ={
      value :'value',
      label :'label',
      children :'versionList'
    }
    return {
      rdList: [],
      typeList: [],
      priorityList: [],
      allprotype: allprotype,
      allPudPjc: [], // 说有关联版本
      proverList: [], // 选中的多版本项目
      selectedOptions: [], // 选中的值
      pickerStart:{
        disabledDate(time){
          // console.log(time)
        }
      },
      sizeForm: {
        name: "",
        priorityId: "",
        typeId: "",
        needperson: "", //needperson
        starttime: "",
        finshtime: "",
        delaydays: 0, // 版本名称
        chargeperson: "", // 研发负责人
        productVer: "", // 多个产品版本
        var2: "", //  文档上传路径
        var3: "" // 备注
      },
      rules: rules,
      uploadUrl: "/dev/file/upload",
      isSuccess: false, // 是否禁用
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date('2000/01/01 00:00:00').getTime();
        }
      }
    };
  },
  watch: {},

  mounted() {
    this.getTypeAndPriority();
  },
  methods: {
    /**
     * 时间校验
     * 
     */
    // pickerStart(){
    //   return {
    //     disabledDate(time){
    //       //  console.log(time)
    //     }
    //   }
    // },
    handleClose(index) {
      this.proverList.splice(index, 1);
      if (this.proverList.length === 0) {
        this.selectedOptions = [];
      }
    },
    handleChange(value) {
      if (value.length === 0) {
        return;
      }
      let obj = {};
      let label = this.$refs.cascaderInput.currentLabels;
      let checkRepeat = (t)=>{
         let itemvalue = JSON.stringify(t.value);
         return itemvalue === JSON.stringify(value)
      }   
      if (!this.proverList.some(checkRepeat)) {
        obj.value = value;
        obj.label = label[label.length - 1];
        this.proverList.push(obj);
      }
    },
    /**
     * 优先级列表
     * 所属类型列表
     *
     */
    getTypeAndPriority() {
       this.allPudPjc =[];
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
          url: "api/pdc/product/findAllProductVersion",
          method: "post"
        }
      ];
      if (this.type === "edit") {   
          // 查询回显数据
        getList.push({
          url: "api/pjc/project/findProject",
          method: "post",
          data: {
            projectId: this.$route.query.projectId
          }
        });
      }

      this.$http.all(getList, (res1, res2, res3, res4, res5) => {
        if (res1.status&&res1.status === 200) {
          if (res1.data.code === 200) {
            this.typeList = res1.data.data;
          }
        }
        if (res2.status&&res2.status === 200) {
          if (res2.data.code === 200) {
            this.priorityList = res2.data.data;
          }
        }
        if (res3.status&&res3.status === 200) {
          if (res3.data.code === 200) {
            this.rdList = res3.data.data;
          }
        }
        if (res4.status&&res4.status === 200) {
          if (res4.data.code === 200) {
            let list = res4.data.data.list;
            this.allPudPjc = list;
          }
        }
        // 是 编辑时
        if (this.type === "edit" ) {
          // 回显的数据
          if (res5.status&&res5.status === 200) {
            if (res5.data.code === 200) {
              let data = res5.data.data;
              let obj = this.sizeForm;
              for (let k in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, k)) {
                  obj[k] = data[k];
                }
              }

              this.sizeForm = obj;
              this.proverList = [];
              if (data.productVrelList.length > 0) {
                let arr = [];
                data.productVrelList.forEach(t => {
                  let value = [],
                    label = [];
                  ["project", "product", "version"].forEach(k => {
                    if (t[`${k}Id`]) {
                      value.push(t[`${k}Id`]);
                      if (t[`${k}Name`]) {
                        label.push(t[`${k}Name`]);
                      }
                    }
                  });

                  arr.push({ value, label: label[label.length - 1] });
                });
                this.proverList = arr;
              }
            }
          }
        }
      });
    },
    /**
     *
     * 保存信息
     *
     */
    onSubmit(formName) {
      let obj, url, msger, msgsuc, productVer, userName, needName;
      productVer = this.proverList.map(t => {
        return t.value.join("#");
      });
      obj = this.sizeForm;
      obj.productVer = productVer.join("&");
      if (this.rdList.length > 0) {
        for (let i = 0, len = this.rdList.length; i < len; i++) {
          let checkObj = this.rdList[i];
          if (checkObj.userId === this.sizeForm.chargeperson) {
            userName = checkObj.userName;
          }
          if (checkObj.userId === this.sizeForm.needperson) {
            needName = checkObj.userName;
          }
          if (userName && needName) {
            break;
          }
        }
        obj.var1 = userName; // 负责人名称
        obj.var4 = needName; // 需求人名称
      }

      // 获取项目负责人 name值
      if (this.type === "add") {
        url = "api/pjc/project/addProject";
        msgsuc = "添加成功";
        msger = "添加失败";
      } else {
        obj.projectId = this.$route.query.projectId;
        url = "api/pjc/project/updateProject";
        msgsuc = "修改成功";
        msger = "修改失败";
      }
      this.$refs[formName].validate((valid,result)=>{
          if(valid){
              this.$http.post(url, obj, res => {
                  if (res.status === 200) {
                    if (res.data.code === 200) {
                      this.$message({
                        message: msgsuc,
                        type: "success"
                      });
                      this.$router.back(); 
                      // if (this.type === "add") {
                      //   this.$refs[formName].resetFields();
                      //   let sizeForm = this.sizeForm;
                      //   for (let k in sizeForm) {
                      //     if (Object.prototype.hasOwnProperty.call(sizeForm, k)) {
                      //       sizeForm[k] = "";
                      //     }
                      //   }
                      //   this.sizeForm = sizeForm;
                      //   this.proverList = [];
                      //   this.selectedOptions = [];
                      // }
                    } else {
                      this.$message.error(res.data.msg);
                    }
                  }
                  });
          }else{
            return false
          }
      })  
      
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
      this.proverList = [];
      this.selectedOptions = [];
    },
    /**
     * 取消 离开
     * 
     */
    cancleBtn(){
      this.$router.back();
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


