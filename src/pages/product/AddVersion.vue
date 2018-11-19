<template>
    <div  class="extend-h-w">
               <el-container class="extend-h-w  minc-height" direction = "vertical">
                   <router-link to = "../product">返回</router-link>
                   <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                             <h2 class = "sl-title">{{$route.meta.title}}</h2>
                    </el-row>

                          <el-container class="extend-h-w" direction = "vertical">
                            <el-row type = "flex" justify = "center">
                                <el-col :span = "10">
                                   <el-form ref="form" :model="sizeForm"  label-width="100px" :rules="rules" size="small">
                                         <el-form-item label="产品名称" v-if = "type === 'edit'"  prop = "productName">
                                                  <el-input v-model="sizeForm.productName"></el-input>
                                        </el-form-item>
                                        <el-form-item label="版本名称" prop = "verName">
                                                  <el-input v-model="sizeForm.verName"></el-input>
                                        </el-form-item>
                                        <el-form-item label="研发负责人" prop = "verRdperson">
                                           <el-select 
                                             filterable
                                             clearable 
                                             v-model="sizeForm.verRdperson" 
                                             placeholder="请选择" class="extend-w">
                                              <el-option
                                                v-for = "(item) in rdList"
                                                :key = "item.userId"

                                              :label="item.userName" :value="item.userId"></el-option>
                                            </el-select>

                                        </el-form-item>
                                        <el-form-item label="版本文件" prop = "verUploadpath">
                                             <el-upload
                                                  :action = "uploadUrl"
                                                  :on-success = "uploadSuccess"
                                                  :on-error = 'uploadError'
                                                  :on-progress = "uploadProg"

                                                  :show-file-list = "false"
                                                  :disabled = "isSuccess"
                                                  :before-upload = "beforeUpload"
                                                  ref = "upload"
                                                  >
                                                  <el-button size="small" type="primary" :loading="isSuccess" @click = "productUpload">选择文件</el-button>
                                                  <span style="width :">{{sizeForm.verUploadpath}}</span>
                                                </el-upload>

                                        </el-form-item>
                                        <el-form-item label="备注">
                                             <el-input v-model="sizeForm.verRemark"
                                             type="textarea"
                                             :rows="2"
                                             placeholder="请输入内容"
                                             ></el-input>
                                        </el-form-item>
                                        <el-form-item label="产品描述">
                                            <el-input v-model="sizeForm.verDescription"
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
export default {
  name: "addproduct",
  components: {
    "sl-foot": Slfoot
  },
  props: ["type"],
  data() {
    let checkName = (rule, value, callback) => {
      this.$http.get(
        "api/pdc/product/findProductByName",
        {
          productName: value
        },
        res => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              callback();
            } else {
              callback(new Error("名称重复"));
            }
          } else {
          }
        }
      );
    };
    const sizeForm = {
        verName: "", // 版本名称
        verRdperson: "", // 研发负责人
        verRemark: "", // 备注
        verDescription: "", // 描述
        verUploadpath: "" // 版本上传路径
      } 

    const rules = {
        verName: [
          { required: true, message: '请输入产品版本', trigger: 'blur' },
          { max:20, message: '最多不超过20个字符', trigger: 'blur' }
          ],
        verRdperson: [
           { required: true, message: '请选择负责人', trigger: 'blur' }],
        // verUploadpath: [
        //    { required: true, message: '请上传文件'}],    
        verRemark: [
           { required: true, message: '最多不超过200个字符', trigger: 'blur' }], 
        verDescription: [
           { required: true, message: '最多不超过200个字符', trigger: 'blur' }], 
      }
     if(this.type === "edit"){
       sizeForm.productName =''; // 产品名称
       rules.productName = [
         { required: true, message: '请输入产品名称', trigger: 'blur' },
         { validator: checkName, trigger: "blur" }];
     } 
    return {
      rdList: [],
      sizeForm:sizeForm,
      rules:rules,
      uploadUrl: "/api/file/upload",
      isSuccess: false // 是否禁用
    };
  },
  watch: {
    $route(to, from) {
      //   console.log(to);
    }
  },

  mounted() {
    this.getInitData();
  },
  methods: {
    /**
     * 上传文件
     */
    productUpload(res) {
      this.$refs.upload.submit();
    },
    /**
     * 上传之前
     */
    beforeUpload() {
      this.sizeForm.verUploadpath='';
      this.isSuccess = true;
    },
    /**
     * 上传成功
     */
    uploadSuccess(res) {
      if (res.code === 200) {
        this.sizeForm.verUploadpath = res.data;
        this.$message({
          message: res.msg,
          type: 'success'
        });
      }
      this.isSuccess = false;
    },
    /**
     * 上传进度
     */
    uploadProg(press) {},
    /**
     * 上传失败
     */
    uploadError(res) {
      this.isSuccess = false;
      this.$message.error("上传失败");
    },
    /**
     * 上传终止 取消上传
     */
    uploadPause() {
      this.$refs.upload.abort();
    },

    /**
     * 级联关系表
     *
     *
     */
    getInitData(){
     
        let getList = [
        // 级联关系
          {
            url: "api/umc/user/findUserByUser",
            method: "get"
          }
        ];
        if (this.type === "edit") {
          getList.push({
            url: "api/pdc/version/findVersionById",
            method: "post",
            data: {
              versionId: this.$route.query.versionId
            }
          });
        }
         
        this.$http.all(getList, (res1, res2) => {
          //  console.log(11)
          if (res1.status === 200) {
            if (res1.data.code === 200) {
              this.rdList = res1.data.data;
            }
          }
          if(this.type === "edit" && res2){
            if (res2.status === 200) {
            
              if (res2.data.code === 200) {
                  let obj = this.sizeForm;
                  
                  for (let k in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, k)) {
                      obj[k] = res2.data.data[k]||'';
                    }
                  }
                  this.sizeForm = obj;
              }else{
                 this.$message.error(res2.data.msg);
              }
            }else{
              this.$message.error(res2.status);
            }
          }else{
            
          }
        })
        
    },
    /**
     *
     * 保存信息
     *
     */
    onSubmit(formName) {
      let obj, url, msger, msgsuc;
      if (this.type === "add") {
        obj = this.sizeForm;
        obj.productId = this.$route.query.productId;
        url = "api/pdc/version/addVersion";
        msgsuc = "添加成功";
        msger = "添加失败";
      } else {
        obj = this.sizeForm;
        obj.productId = this.$route.query.productId;
        obj.versionId = this.$route.query.versionId;
        url = "api/pdc/version/updateVersion";
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
                    // }else{
                    //   this.$router.back()
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


