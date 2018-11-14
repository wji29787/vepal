<template>
    <div  class="extend-h-w">
               <el-container class="extend-h-w" direction = "vertical">
                   <router-link to = "product">返回</router-link>
                   <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                             <h2 class = "sl-title">{{$route.meta.title}}</h2>
                    </el-row>
                     
                          <el-container class="extend-h-w" direction = "vertical">
                            <el-row type = "flex" justify = "center">
                                <el-col :span = "10">
                                   <el-form ref="form" :model="sizeForm"  label-width="100px" :rules="rules" size="small">
                                        <el-form-item label="版本名称">
                                                  <el-input v-model="sizeForm.verName"></el-input>
                                        </el-form-item>
                                        <el-form-item label="研发负责人">
                                           <el-select v-model="sizeForm.verRdperson" placeholder="请选择" class="extend-w">
                                              <el-option 
                                                v-for = "(item) in rdList"
                                                :key = "item.userId"

                                              :label="item.userName" :value="item.userId"></el-option>
                                            </el-select>
                    
                                        </el-form-item>
                                        <el-form-item label="版本文件">
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

    return {
      rdList: [],
      sizeForm: {
        // productName: "", // 名称
        // productId:'',
        verName: "", // 版本名称
        verRdperson: "", // 研发负责人
        verRemark: "", // 备注
        verDescription: "", // 描述
        verUploadpath: "" // 版本上传路径
      },
      rules: {
        // productName: [{ validator: checkName, trigger: "blur" }]
      },
      uploadUrl: "/dev/file/upload",
      isSuccess: false, // 是否禁用
    };
  },
  watch: {
    $route(to, from) {
      //   console.log(to);
    }
  },

  mounted() {
    this.getRdList();
    if (this.type === "edit") {
      let obj = this.sizeForm;
      for (let k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          obj[k] = this.$route.params.data[k];
        }
      }
      this.sizeForm = obj;
    }
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
      this.isSuccess = true;
    },
    /**
     * 上传成功
     */
    uploadSuccess(res) {
      //  console.log(res)
      if (res.code === 200) {
        this.sizeForm.verUploadpath = res.data;
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
      let obj, url, msger, msgsuc;
      if (this.type === "add") {
        obj = this.sizeForm;
        obj.productId = this.$route.params.data.productId;
        url = "vdev/version/addVersion";
        msgsuc = "添加成功";
        msger = "添加失败";
      } else {
        obj = this.sizeForm;
        obj.productId = this.$route.params.data.productId;
        obj.versionId = this.$route.params.data.versionId;
        url = "vdev/version/updateVersion";
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


