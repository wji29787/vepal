<template>
    <div>
        <el-upload 
                 :action = "uploadUrl"
                 :on-success = "uploadSuccess"
                 :on-error = 'uploadError'
                 :on-progress = "uploadProg"
                 :data = "uploadData"
                 :show-file-list = "false"
                 :disabled = "isSuccess"
                 :before-upload = "beforeUpload"
                 ref = "upload"
                 >
                <el-button size="small" type="text" :loading="isSuccess" @click = "productUpload">上传</el-button>
              </el-upload>
    </div>
</template>
<script>
export default {
  name: "duct-uoload",
  props:['uploaddata','productid','downBtn'],
  data() {
    return {
      /**
       *
       * http://192.168.95.93:8085/file/upload?
       * file=111.txt& 
       * productVersionId=18095&
       * productName=启明2&
       * productVersion=11.1&
       * productRDPerson=aaa&
       * productDesc=开发一个产品版本管理系统&productRemark=这是产品版本管理系统0.0.1的备注
       *
       */
      uploadUrl: "http://192.168.95.93:8085/file/upload",
      uploadData: {
        productVersionId: "", // 文件版本ID
        productName: "",      // 版本名
        productVersion: "",   // 产品版本
        productRDPerson: "",  // 产品负责人
        productDesc: "",      // 产品描述
        productRemark:''      // 产品详情
      },
      isSuccess : false // 是否禁用
    };
  },
  mounted() {
      // this.uploadSuccess()
  },
  methods: {
    /**
     * 上传文件
     */
    productUpload(res) {
        this.uploadUrl = this.downBtn ? 'api/file/reUpload' : 'api/file/upload'
        let params =['productName','productVersion','productRDPerson','productDesc','productRemark','productVersionId']
        let uploadData = this.uploadData
        let uploaddata = this.uploaddata
        params.forEach ((t, i)=>{
            if(t === 'productVersionId'){
                uploadData[t] = this.productid
            }else {
                if(t === 'productRemark' && Array.isArray(uploaddata[i].val)){
                  let remarkLen =  uploaddata[i].val.length
                  let remark = [];
                  if(remarkLen > 0){
                     uploaddata[i].val.forEach(val =>{
                        if(val.actionbody){
                          remark.push(val.actionbody)
                        }
                     })
                  }
                  uploadData[t] = remark.length > 0 ? remark.join(',') : ''
                }else{
                  uploadData[t] = uploaddata[i].val||'' 
                }
                
            }
            
        })
        this.uploadData = uploadData 
        this.$refs.upload.submit()
        
    },
    /**
     * 上传之前
     */
    beforeUpload(){
      this.isSuccess = true
    },
    /**
     * 上传成功
     */
    uploadSuccess(res){
        this.$emit('uploadSuccess',res);
        this.isSuccess = false
        // this.$message({
        //   message: res.msg,
        //   type: 'success'
        // });
    },
    /**
     * 上传进度
     */
    uploadProg(press){
      
    },
    /**
     * 上传失败
     */
    uploadError(res){
      this.$emit('uploadComplete',{
        code :false,
        msg : '失败'
      });
       this.isSuccess = false
      this.$message.error('错了哦，这是一条错误消息');
    },
    /**
     * 上传终止 取消上传
     */
    uploadPause() {
        this.$refs.upload.abort()
    }
  }
};
</script>

<style>
</style>

