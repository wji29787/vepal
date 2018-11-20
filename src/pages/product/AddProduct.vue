<template>
    <div  class="extend-h-w">
               <el-container class="extend-h-w  minc-height" direction = "vertical">
                 <router-link to = "../product">返回</router-link>
                   <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                             <h2 class = "sl-title">产品新增</h2>
                    </el-row>

                          <el-container class="extend-h-w" direction = "vertical">
                            <el-row type = "flex" justify = "center">
                                <el-col :span = "10">
                                   <el-form ref="form" :model="sizeForm"  label-width="100px" :rules="rules" size="small">
                                        <el-form-item label="产品名称" prop = "productName">
                                            <el-input v-model="sizeForm.productName"></el-input>
                                        </el-form-item>
                                        <el-form-item label="产品版本" prop = "verName">
                                                  <el-input v-model="sizeForm.verName"></el-input>
                                        </el-form-item>
                                        <el-form-item label="研发负责人" prop = "verRdperson">
                                           <el-select v-model="sizeForm.verRdperson"
                                               filterable
                                               clearable
                                               placeholder="请选择"
                                               class="extend-w">
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
                                        <el-form-item label="备注" prop = "verRemark">
                                             <el-input v-model="sizeForm.verRemark"
                                             type="textarea"
                                             :rows="2"
                                             placeholder="请输入内容"
                                             ></el-input>
                                        </el-form-item>
                                        <el-form-item label="产品描述" prop = "verDescription">
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
import tableList from "./productTableList.js";
export default {
  name: "addproduct",
  components: {
    "sl-foot": Slfoot
  },
  data() {
    let checkName = (rule, value, callback) => {

      this.$http.get(
        "/api/pdc/product/findProductByName",
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
    let checkText = (rule, value, callback) =>{
        if(/[\u4e00-\u9fa5]/.test(value)){
          callback(new Error('版本名称不能输入汉字'))
        }else{
          callback();
        }
    }
    // let checkVerUploadpath = (rule, value, callback)=>{
    //     if(!value){

    //     }
    // }
    return {
      rdList: [],
      sizeForm: {
        productName: "", // 名称
        verName: "", // 产品版本
        verRdperson: "", // 研发负责人
        verRemark: "", // 备注
        verDescription: "", // 描述
        verUploadpath: "" // 路径
      },
      rules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { validator: checkName, trigger: "blur" },
          { max:100, message: '最多不超过100个字符', trigger: 'blur' }],
        verName: [
          { required: true, message: '请输入产品版本', trigger: 'blur' },
          { validator:checkText, trigger: 'blur' },
          { max:10, message: '最多不超过10个字符', trigger: 'blur' }],
        verRdperson: [
           { required: true, message: '请选择负责人', trigger: 'change' },
           { required: true, message: '请选择负责人', trigger: 'blur' },
           ],
        // verUploadpath: [
        //    { required: true, message: '请上传文件'}],
        // verRemark: [
        //    { max:200, message: '最多不超过200个字符', trigger: 'blur' }],
        verDescription: [
           { required: true, message: '产品描述不能为空', trigger: 'blur' }],
      },
      uploadUrl: "fmc/file/upload",
      isSuccess: false, // 是否禁用
      userId: 11
    };
  },
  watch: {
    $route(to, from) {
      // console.log(to);
    }
  },

  mounted() {
    this.getRdList();
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
    getRdList() {
      this.$http.get("api/umc/user/findUserByUser", res => {
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.rdList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        } else {
          this.$message.error(res.status);
        }
      });
    },
    /**
     *
     * 保存信息
     *
     */
    onSubmit(formName) {
      let obj = this.sizeForm;
       this.$refs[formName].validate((valid,result)=>{
         if(valid){
               this.$http.post("api/pdc/product/addProduct", obj, res => {
                  if (res.status === 200) {
                    if (res.data.code === 200) {
                      this.$message({
                        message: "添加成功",
                        type: "success"
                      });
                      this.$router.back();
                      // this.$refs[formName].resetFields();
                      // for (let k in obj) {
                      //   if (Object.prototype.hasOwnProperty.call(obj, k)) {
                      //     obj[k] = "";
                      //   }
                      // }
                      // this.sizeForm = obj;
                    } else {
                      this.$message.error(res.data.msg);
                    }
                  }else{
                    this.$message.error(res.status);
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


