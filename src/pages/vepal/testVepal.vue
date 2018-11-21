<template>
  <div style="height:100%;width:100%;">
    <add-vepal @saveComplete = "reRender"  @customstyleChange = "customSetstyle" @customResetStyle = "customResetStyle"/>
    <span class="version">套装展示<strong>v1.0.1</strong></span>
      <el-scrollbar 
         ref = "scroll-elem" 
         style="height:100%;" 
         v-scroll = "{  el:'.el-scrollbar__wrap',scrollfn:scrollfn }" >
             <div class = "dinner">
     <div id="container">
            </div>
             </div>        
         
      </el-scrollbar>
    <!-- <sl-scrollbar style="height:100%;">
    <div id="container">
            </div>

    </sl-scrollbar> -->
    <!-- editproject -->
    <el-dialog
      :visible="projectEdit.visible"
      @close="projectEdit.visible=false"
      :title = "projectEdit.title"
      center
      width = "8rem"
      >
      <el-container direction="vertical">
         <el-row  class = "edit-item" :gutter = 20
          >
            <el-col class="edit-item-label" :span = "6">项目名称:</el-col>
            <el-col  :span = "18"><el-input size="small" v-model="projectEdit.projectName"></el-input></el-col>
        </el-row>
          <el-row  class = "edit-item" :gutter = 20
          >
            <el-col class="edit-item-label" :span = "6">项目优先级:</el-col>
            <el-col :span = "18">
              <el-select v-model="projectEdit.priorityID" placeholder="请选择" size="small" class = "edit-select">
                <el-option
                  v-for="item in projectEdit.data"
                  :key="item.priorityID"
                  :label="item.priorityName"
                  :value="item.priorityID">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
      </el-container>
      <div slot="footer" class ="sp-footer">
        <el-button @click="projectEdit.visible=false">取 消</el-button>
        <el-button type="primary" @click="editProjectSave">确 定</el-button>
      </div>
    </el-dialog>
    <!-- project-dialog -->
    <el-dialog
      :visible="projectDetil.visible"
      @close="projectDetil.visible=false"
      :title = "projectDetil.title"
      center
      width = "8rem"
      >
      <el-container direction="vertical">
          <el-row  class = "sp-item" :gutter = 20
            v-for = "(item, $index) in projectDetil.data"
            :key ="$index"
          >
            <el-col class="sp-item-label" :span = "6">{{item.name}}:</el-col>
            <template v-if = "$index ===2">
               <el-col class = "dialog-item-val" :span = "18">
                  <el-tree
                    :props = "projectDetil.docProps"
                    :load="loadNode"
                    lazy
                    node-key="name"
                    ref = "projectTree"
                    @node-click = "checkNode"
                    v-if = "projectDetil.visible"
                    accordion
                   >
                  </el-tree>
                 </el-col>    
            </template>
            <template v-else-if = "$index ===3">
               <el-col class = "dialog-item-val" :span = "18">
                 {{item.val}}
                 </el-col>    
            </template>
             
           <template v-else>      
                <el-col  :span = "18">{{item.val}}</el-col>
            </template>
          </el-row>
        </el-container>
    </el-dialog>
    <!-- sp-dialog -->
    <el-dialog
      :visible="spDetil.visible"
      @close="spDetil.visible=false"
      :title = "spDetil.title"
      center
      width = "8rem"
      >
        <el-container direction="vertical">
          <el-row  class = "sp-item" :gutter = 20
            v-for = "(item, $index) in spDetil.data"
            :key ="$index"
          >
            <el-col class="sp-item-label" :span = "6">{{item.name}}:</el-col>
            
            <template v-if = "$index ===4" >
              <el-col class="sp-item-val dialog-item-val"  :span = "18">
                {{item.val}}
                </el-col>
             
            </template>
            <template v-else>
              <el-col class="sp-item-val" :span = "18">{{item.val}}</el-col>
            </template>
          </el-row>
        </el-container>
    </el-dialog>
    <!-- product-dialog -->
    <el-dialog
      :visible="productDetil.visible"
      @close="productDetil.visible=false"
      :title = "productDetil.title"
      center
      width = "8rem"
      >
      <el-container direction="vertical">
          <el-row type="flex" justify="end">

            <el-col class="sp-item-label" :span = "3">
                <!-- 上传 -->
              <duct-upload
               :uploaddata = "productDetil.data"
               :productid = "productDetil.productId"
               :downBtn = "productDetil.downBtn"
               @uploadSuccess = "uploadComplete"
               />
            </el-col>
            <el-col class="sp-item-label" :span = "3">
                  <el-button type="text"  v-show = "productDetil.downBtn" @click="productDown(productDetil.productId)" size="small">下载</el-button>
            </el-col>

            <!-- <el-button type="text" size="small">上传</el-button> -->

          </el-row>
          <el-row  class = "sp-item" :gutter = 20
            v-for = "(item, $index) in productDetil.data"
            :key ="$index"
          >
            <el-col class="sp-item-label" :span = "6">{{item.name}}:</el-col>
            <el-col class="sp-item-val" :class = "{'dialog-item-val' : $index ===3 || $index ===4}" :span = "18">
              <template v-if="$index === 4">
                  <div
                    v-for = "(kval, $l) in item.val"
                     :key="kval.id">
                     {{($l+1)+': '+kval.actionbody}}
                  </div>
              </template>
              <template v-else>
                  {{item.val}}
             </template>

            </el-col>
          </el-row>
          <br>
          <hr>
          <el-row type = "flex" align = "middle" >
            <el-col  class = "item-produt" :span = "4">当前版本:</el-col>
            <el-col  :span = "20" v-show = "productDetil.downBtn">
              <el-button
                class = "item-produt-btn"
                type="text"
                @click="productDown(productDetil.productId)"
                size="small"
                :title ="productDetil.cursp"
                >
                {{productDetil.cursp}}
              </el-button>
              <el-button type="text" @click = "deleteProduct" icon="el-icon-close"></el-button>
            </el-col>
            <!-- <el-col class="item-top" :span = "18">{{productDetil.data[0].val + productDetil.data[1].val}}</el-col> -->
          </el-row>
          <hr>
          <br>
          <el-container direction="vertical">
            <el-col :span = "24">历史版本</el-col>
            <el-table
             :data="productDetil.historyData"
              max-height="250"
              width="100%"
              :show-header = "false"
             >
              <el-table-column prop="verName" label="版本">
              </el-table-column>
              <el-table-column prop="filesize" label="文件大小" :formatter = "formatFileSize" width="100">
              </el-table-column>
              <el-table-column  label="更新记录" width="80">
                <template slot-scope="scope">
                    <el-button type="text" @click="productClick(scope.row)" size="small">查看记录</el-button>
                </template>
              </el-table-column>
              <el-table-column label="下载" width="70">
                <template slot-scope="scope">
                    <el-button type="text" @click="productDown(scope.row)" size="small">下载</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="时间" :formatter = "formatTime" width="150">
              </el-table-column>
            </el-table>
          </el-container>
      </el-container>

      <el-dialog
          width="30%"
          :title = "productDetil.inner.title"
          :visible.sync = "productDetil.inner.visible"
          append-to-body>
          <el-container class="dialog-item-val sp-item" direction="vertical">
              <el-col >
                {{productDetil.inner.data.description}}
              </el-col>
          </el-container>

      </el-dialog>
    </el-dialog>
  </div>

</template>

<script>
import Vepal from "./createVepal/Cvepal.js";
import * as util from "../../assets/js/util.js"

import { rem, setScaleStyle, styleConf, transitionStyle } from "./createVepal/vepalconf.js";
// 上传文件
import productUpload from "./productUpload";
// 新增套装
import addvepal from "./addvepal";
export default {
  name: "testVepal",
  components: {
    "duct-upload": productUpload,
    "add-vepal": addvepal
  },
  data() {
    return {
      zr: "",
      zrInstance:null,
      list: [],
      tipShow: false,
      bscroll: true, // 是否加载
      pageNo: 1,
      pageSize: 10, // 初始每页数据数
      lastPage: false, //最后一页
      moveY: 0,
      scrollctx: null,
      // customStyle:{},
      // 项目详情
      projectDetil: {
        title: "项目详细",
        visible: false,
        data: [
          {
            name: "项目名称",
            val: "",
            type: "projectName"
          },
          {
            name: "创建时间",
            val: "",
            type: "createDate"
          },
          {
            name: "相关文档",
            val: "",
            type: "docAddr"
          },
          {
            name: "需求描述",
            val: "",
            type: "description"
          }
        ],
        docProps: {
          label: "name",
          isLeaf: function(data, node) {
            if (node.level > 0) {
              return data["kind"]["id"] === 1;
            } else {
              return false;
            }
          }
        },
        docData: []
      },
      //产品详情
      productDetil: {
        title: "产品详细",
        productId: "",
        visible: false,
        downBtn: false, //下载按钮的显示 隐藏
        cursp: "",
        data: [
          {
            name: "产品名称",
            val: "",
            type: "productName"
          },
          {
            name: "版本",
            val: "",
            type: "productVersion"
          },
          {
            name: "版本研发负责人",
            val: "",
            type: "productRDPerson"
          },
          {
            name: "描述",
            val: "",
            type: "productDesc"
          },
          {
            name: "备注",
            val: "",
            type: "remark"
          }
        ],
        historyData: [],
        inner: {
          visible: false,
          title: "更新记录",
          data: {}
        }
      },
      //套装详情
      spDetil: {
        title: "套装详细",
        visible: false,
        data: [
          {
            name: "套装名称",
            val: "",
            type: "suitName"
          },
          {
            name: "发布时间",
            val: "",
            type: "suitDate"
          },
          {
            name: "联调负责人",
            val: "",
            type: "suitAdjustingPerson"
          },
          {
            name: "测试负责人",
            val: "",
            type: "suitsuitTestPersonName"
          },
          {
            name: "功能详情",
            val: "",
            type: "suitDescription"
          }
        ]
      },
      // 项目编辑
      projectEdit: {
        title: "项目编辑",
        visible: false,
        data: [],
        projectName: "",
        priorityID: "",
        projectId: "",
        curtPriorityEl: null,
        curtEl: null,
        index: -1,
        editIndex: -1,
        editProjectIndex: -1
      }
    };
  },
  created() {},
  watch: {
    // offset
  },
  mounted() {
     this.render();
    //拉取 设置数据
    this.customGetStyle();
    let that = this;
    let timer = null;
    window.addEventListener("resize", function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        that.zrInstance.resetData();
      }, 300);
    });
  },
  methods: {
    // 刷新
    reRender() {
      this.resetData();
      this.pageNo = 1;
      this.lastPage = false; //最后一页
      this.getData();
    },
    render() {
      let container = document.getElementById("container");
      this.zrInstance = new Vepal(container,{
           devicePixelRatio: window.devicePixelRatio
      })
      this.zr = this.zrInstance.zr;
    },
    getData(pageNo) {
      if (!this.bscroll) {
        return;
      }
      this.bscroll = false;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http.post(
        "api/suit/suit/findAllSuitInfo",
        {
          pageNo: pageNo ? pageNo : 1,
          pageSize: this.pageSize
        },
        res => {
          loading.close();
          setTimeout(() => {
            this.bscroll = true;
          }, 350);
          if (res.status === 200) {
            if (res.data.code === 200) {
              if (
                res.data.data.suits &&
                res.data.data.suits.length < this.pageSize
              ) {
                this.lastPage = true;
              }
              let listLen;
              if (this.list.length === 0) {
                listLen = 0;
                this.list = res.data.data.suits;
              } else {
                listLen = this.list.length;
                this.list = this.list.concat(res.data.data.suits);
              }

              // this.groupPosition(res.data.data.suits, listLen);
              // this.zrInstance.init(res.data.data.suits)
              this.zrInstance.init(this.list)
              // 改变滚动距离
              if (this.scrollctx) {
                this.$nextTick(() => {
                  this.scrollctx.scrollTop = this.moveY;
                });
              }
            } else {
              if (pageNo > 1) {
                this.pageNo -= 1;
              }
              this.$message(res.data.msg);
            }
          } else {
            if (pageNo > 1) {
              this.pageNo -= 1;
            }
            this.$message(res.status);
          }
        }
      );
    },
    getproRelation(type, id, callback) {
      let url =
        type === "L"
          ? "/api/suit/suit/findProductListByProjectId"
          : "/api/suit/suit/findProjectListByProductId";

      this.$http.get(
        url,
        {
          issueId: id
        },
        res => {
          if (res.status === 200) {
            if (callback) {
              callback(res.data);
            }
          } else {
            console.log(res);
          }
        }
      );
    },
    scrollfn(ctx, val) {
      if (this.lastPage) return;
      if (!this.bscroll) return;
      // 保存滚动元素
      this.scrollctx = ctx;
      // 元素的总高度
      if (this.moveY < val) {
        this.moveY = val;
        this.pageNo += 1;
        this.getData(this.pageNo);
      }
    },
    editProject(priorityName) {
      this.$http.post("/api/suit-jira/project/findAllProjectPriority", res => {
        if (res.status === 200) {
          // this.productEdit.data = res.data
          if (res.data.code === 200) {
            this.projectEdit.data = res.data.data;
            let data = res.data.data;
            this.projectEdit.priorityID = data.find(t => {
              return t.priorityName === priorityName.trim();
            }).priorityID;
          }
        }
      });
    },
    /**
     * 保存编辑项目
     */
    editProjectSave() {
      this.$http.post(
        "/api/suit-jira/project/updateProject",
        {
          projectName: this.projectEdit.projectName,
          priorityId: this.projectEdit.priorityID,
          projectId: this.projectEdit.projectId
        },
        res => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              this.projectEdit.visible = false;
              //修改当前项
              // console.log(this.projectEdit.curtEl)
              // this.projectEdit.curtEl.attr({
              //   style:{
              //     text:textFormat(this.projectEdit.projectName, 18, 38)
              //   }
              // })
              let priorityName = this.projectEdit.data.find(t => {
                return t.priorityID == this.projectEdit.priorityID;
              }).priorityName;
              // this.projectEdit.curtPriorityEl.attr({
              //   style:{
              //     text:`优先级: ${priorityName}`
              //   }
              // })
              // 修改响应项
              this.list[this.projectEdit.editIndex]["projectList"][
                this.projectEdit.editProjectIndex
              ]["projectName"] = this.projectEdit.projectName;
              this.list[this.projectEdit.editIndex]["projectList"][
                this.projectEdit.editProjectIndex
              ]["priorityName"] = priorityName;
              this.resetData();
              // this.getData();
              this.init();
            } else {
            }
          }
        }
      );
    },
    //
    productClick(row) {
      // console.log(row)
      this.productDetil.inner.visible = true;
      this.productDetil.inner.data = row;
    },
    // 下载文件
    productDown(row) {
      // util.StandardPost(url1);
      // window.open(url)
      let url;
      // 下载文件
      if (util.toType(row) === "string" || util.toType(row) === "number") {
        url = "api/suit/file/download";
        util.StandardPost(url, {
          productVersionId: row
        });
      } else if (util.toType(row) === "object") {
        url = "api/suit/file/download";
        util.StandardPost(url, {
          productVersionId: row.verId
        });
      }
    },
    /**
     * 文件上传功能
     * 文件上传成功
     */
    uploadComplete(res) {
      if (res.code === 200) {
        this.productDetil.cursp = res.data;
        this.productDetil.downBtn = true;
      }
    },
    /**
     * 删除当前版本
     */
    deleteProduct() {
      this.$http.post(
        "/api/suit/product/deleteVersionById",
        {
          productVersionId: this.productDetil.productId
        },
        res => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              this.productDetil.cursp = "";
              this.productDetil.downBtn = false;
            } else {
              this.$message.error(res);
            }
          }
        }
      );
    },
    /**
     * 历史记录查询
     */
    getProductHistory(productName, prodV) {
      this.$http.post(
        "/api/suit/product/findAllHistoryVersionByProduct",
        {
          productName: productName, // 版本号
          productVersion: prodV // 名称
        },
        res => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              this.productDetil.historyData = res.data.data;
            }
            // console.log(res.data)
          }
        }
      );
    },
    /**
     * 格式化文件大小
     */
    formatFileSize(row, column, cellValue, index) {
      return cellValue + "MB";
    },
    /**
     * 格式化事件
     */
    formatTime(row, column, cellValue, index) {
      if (cellValue) {
      }
      return this.$moment(cellValue).format("YYYY-MM-DD h:mm:ss");
    },
    //获取设置数据
    customGetStyle() {

      this.$http.post("api/suit/style/findAllStyle", res => {
        if (res.status === 200) {
          if (res.data.code === 200) {
            let customObj = transitionStyle(res.data.data);
            // 合并
            this.zrInstance.mergeStyle(customObj)
            // 计算
            this.zrInstance.setScaleStyle()
            this.getData();
          }
        }
      });
    },
    //重新渲染
    customSetstyle(data) {
      //重新计算
       this.zrInstance.setStyle(data)
    },
    // 重置颜色
    customResetStyle() {
        this.zrInstance.reset()
    },
    // 请求树形结构的数据
    relationDoc(docAddr, resolve) {
      this.$http.post(
        "/api/suit/project/findFolderBySvnPath",
        {
          svnPath: docAddr || ""
        },
        res => {
          if (res.status === 200) {
            if (res.data.code === 200) {
              resolve(res.data.data);
            }
          }
        }
      );
    },
    // 树形控件的懒加载
    loadNode(node, resolve) {
      if (node.level === 0) {
        // console.log(node)
        let docAddr = this.projectDetil.data[2].val;
        this.relationDoc(docAddr, resolve);
        return;
      }
      var hasChild;
      if (node.data.kind["id"] === 0) {
        hasChild = true;
      } else {
        hasChild = false;
        return resolve([]);
        // return
      }
      if (hasChild) {
        let urlData = node.data.url;
        let docAddr = `${urlData.protocol}://${urlData.host}${urlData.path}`;
        this.relationDoc(docAddr, resolve);
      }
    },
    // 点击节点的回调
    checkNode(data, node, ctx) {
      //http://192.168.95.93:8085/project/downloadSvnFile?svnPathJson=xxxx
      if (data.kind.id === 1) {
        let obj = {
          name: data.name,
          host: data.url.host,
          path: data.url.path,
          protocol: data.url.protocol
        };
        util.StandardPost("/api/suit/project/downloadSvnFile", {
          svnPathJson: JSON.stringify(obj)
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dialogStyle {
  background: rgba(74, 163, 222, 1);
  line-height: 0.3rem;
  padding: 0.2rem;
  font-family: 微软雅黑;
  width: 4rem;
}
.dinner {
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* position: absolute */
}
.container {
  height: 100%;
  overflow: hidden;
}
/***addvepal csy add***/
.version {
  position: absolute;
  left: 0.1rem;
  top: 0.1rem;
  font-size: 0.2rem;
  font-family: Arial, Helvetica, sans-serif;
}
.version strong {
  font-size: 12px;
  padding-left: 0.1rem;
}
/***addvepal end***/
/* sp-dialog  start*/
.sp-item {
  /* height: 0.4rem; */
  /* padding: 0.1rem 0 */
  line-height: 0.3rem;
}
.sp-item .sp-item-label {
  text-align: right;
  /* font-weight: bold */
}
.sp-item .sp-item-val {
  /* line-height: 0.3rem; */
}
.sp-footer {
  /* margin-top:0.4rem; */
}
/* sp-dialog  end*/

.dialog-item-val {
  max-height: 3rem;
  overflow: auto;
}
.edit-text {
  position: fixed;
  transform: translate(50%);
  top: 50%;
  /* width: 50%; */
  z-index: -1000;
  /* border:none */
  outline: none;
  -webkit-appearance: none;
  border-radius: 0;
  /* visibility: hidden; */
  opacity: 0;
}
.edit-item {
  /* height: 0.4rem; */
  line-height: 0.4rem;
  margin-bottom: 0.1rem;
}
.edit-item .edit-item-label {
  text-align: right;
}
.edit-item .edit-select {
  width: 100%;
}
.item-right {
  text-align: right;
}
.item-top {
  margin-top: 0.1rem;
}
.item-produt {
  padding: 10px 0;
}
.item-produt-btn {
  overflow: hidden;
  max-width: 90%;
}
</style>
<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
