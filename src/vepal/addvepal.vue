<template>
    <div>
        <el-button type="text" class="elbutton"  @click="getzt">新增套装</el-button>
        <el-dialog 
            title="添加套装"
            :visible="dialogVisible" width="50%"
            @close="dialogVisible = false"
            >
            <div class="addvepal-layer">
                <ul>
                    <li>
                        <label>SP名称：</label>
                        <el-input v-model = "suitName" class="elinput" placeholder="请输入内容"></el-input>
                    </li>
                    <li>
                        <label>时间：</label>
                        <div class="block">
                            <el-date-picker
                            v-model = "suitDate"
                            type="date"
                            placeholder="选择日期"
                            class="suitDate"
                            >
                            </el-date-picker>
                        </div>
                    </li>
                    <li>
                        <label>详细信息：</label>
                        <textarea v-model = "suitDescription"></textarea>
                    </li>
                    <li class="clearfix">
                        <label>产品：</label>
                        <div  class="producttree">
                            <ul class="ztree" id="ztreedemo"></ul>
                        </div>
                    </li>
                </ul>
            </div>
    
            <span slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import "ztree";
import "ztree/css/zTreeStyle/zTreeStyle.css";
import "ztree/js/jquery.ztree.core.js";
import "ztree/js/jquery.ztree.excheck.js";

export default {
  name: "addvepal",
  data() {
    return {
      dialogVisible: false,
      nodeData: [
        { id: 1, pId: 0, name: "Pamir", open: true },
        { id: 11, pId: 1, name: "5.5.5", open: true },
        { id: 111, pId: 11, name: "TOP录播支持" },
        { id: 12, pId: 1, name: "5.6.x", open: true },
        { id: 121, pId: 12, name: "TOP音频录制" },
        { id: 2, pId: 0, name: "Gis天眼", open: true },
        { id: 22, pId: 2, name: "1.15.0", open: true },
        { id: 221, pId: 22, name: "TOP会议支持", open: true },
        { id: 3, pId: 0, name: "启明2视联终端", checked: true, open: true },
        { id: 2, pId: 0, name: "PamirMobile" }
      ],
      setting: {
        view: {
          showIcon: false
        },
        check: {
          enable: true,
          chkboxType: { Y: "ps", N: "ps" }
        },
        data: {
          simpleData: {
            enable: true
          }
        }
      },
      suitName: "", //SP名称
      suitDate: "", //时间
      suitDescription: "", //详细信息
      issueId: "" //产品
    };
  },
  mounted: function() {

  },
  methods: {
    /**获取ztree数据并且渲染**/
    getzt() {
      var _this = this;
      _this.dialogVisible = true;
      setTimeout(() => {
        this.$http.get("/api/product/findAllProduct", res => {
          if (res.status === 200) {
            var nodeList = [];
            // { id:1, pId:0, name:"Pamir", open:true},
            // { id:11, pId:1, name:"5.5.5", open:true},
            var productslist = res.data.data.products;
            for (var i = 0; i < productslist.length; i++) {
              var obj = {
                id: productslist[i].productId,
                pId: 0,
                name:
                  productslist[i].productName +
                    productslist[i].productVersion || "",
                open: true
              };
              nodeList.push(obj);
              if (productslist[i].projectList.length > 0) {
                var cplist = productslist[i].projectList;
                for (var j = 0; j < cplist.length; j++) {
                  var obj = {
                    id: cplist[j].projectId,
                    pId: productslist[i].productId,
                    name: cplist[j].projectName,
                    open: true
                  };
                  nodeList.push(obj);
                }
              }
            }
            _this.nodeData = nodeList;
            $.fn.zTree.init($("#ztreedemo"), _this.setting, _this.nodeData);
          } else {
            console.log(res);
          }
        });
      }, 100);
    },
    save() {
      var _this = this;
      //获取ztree被选中节点的值
      var treeObj = $.fn.zTree.getZTreeObj("ztreedemo"),
        nodes = treeObj.getCheckedNodes(true),
        sueIdstr = "";
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].pId == 0 || nodes[i].pId == null) {
          sueIdstr += nodes[i].id + ",";
        }
      }
      if (sueIdstr.length > 0) {
        _this.issueId = sueIdstr.substring(0, sueIdstr.length - 1);
      }
      if (_this.suitName.length == 0) {
        alert("SP名称不能为空");
        return;
      }
      if (_this.suitDate.length == 0) {
        alert("套装日期不能为空");
        return;
      }
      if (_this.suitDescription.length == 0) {
        alert("套装描述不能为空");
        return;
      }
      if (_this.issueId.length == 0) {
        alert("请选择套装产品");
        return;
      }
      //请求保存接口
      this.$http.get(
        "/api/suit/addSuit",
        {
          suitName: _this.suitName,
          suitDate: _this.suitDate,
          suitDescription: _this.suitDescription,
          issueId: _this.issueId
        },
        res => {
          if (res.status === 200) {
            this.$emit('saveComplete')   
            alert("保存成功");
            
          } else {
            console.log(res);
          }
        }
      );
      _this.dialogVisible = false;
    }
  }
};
</script>

<style scoped>

/***addvepal csy add***/
.addvepal-layer {
  font-family: 微软雅黑;
  font-size: 0.16rem;
}

.addvepal-layer ul li {
  line-height: 0.5rem;
  margin-top: 0.1rem;
  height: auto;
  width: 9rem;
}
.addvepal-layer ul li label {
  float: left;
  width: 1.2rem;
  text-align: right;
}
.elinput {
  width: 7rem;
}
.addvepal-layer ul li textarea {
  height: 0.8rem;
  width: 6.8rem;
  resize: none;
  padding: 0.1rem;
  border: 1px solid #dcdfe6;
}
.producttree {
  width: 7.2rem;
  height: 4rem;
  border: 1px solid #dcdfe6;
  float: left;
  overflow-y: auto;
  overflow-x: hidden;
}
.addbtn {
  background: rgba(74, 163, 222, 1);
  width: 1rem;
  text-align: center;
  height: 0.3rem;
  line-height: 0.3rem;
  display: block;
  color: #fff;
  margin-left: 2.5rem;
}
.suitDate {
  width: 7rem;
}
.elbutton {
  position: fixed;
  right: 0rem;
  top: 0;
  background: #409eff;
  color: #fff;
  padding: 0.1rem;
  margin: 0.1rem;
  z-index: 30;
}
/***addvepal end***/
</style>