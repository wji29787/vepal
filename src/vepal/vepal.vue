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
    <!-- <sl-dialog :value="showProject" :offset="offsetProject" :position="'absolute'" class="">
       dfsdfsdfsf
    </sl-dialog> -->
    <!-- <sl-dialog :value="showSp" :offset="offsetSp" :position="'absolute'">
      <div class="dialogStyle"> {{deilSp.suitDescription}}</div>
    </sl-dialog> -->
    <!-- <sl-dialog :value="showProduct" :offset="offsetProduct" :position="'absolute'">
       <div  class="dialogStyle">
          <div
             v-for = "(item, index) in deilProduct"
             :key = "item.actionbody"
          >
            <p>{{item.actionbody}}</p>
          </div>
       </div>
    </sl-dialog> -->
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
import zrender from "zrender";
import * as util from "../assets/js/util.js";
import {
  rect,
  // rem,
  line,
  ellipse,
  circle,
  textFormat,
  arc,
  text,
  image
} from "../assets/js/util.js";
import { rem, setScaleStyle, styleConf, transitionStyle } from "./vepalconf.js";
// 上传文件
import productUpload from "./productUpload";
// 新增套装
import addvepal from "./addvepal";
// 默认数据
let resetObj = util.clone(styleConf());
// 渲染数据
let customStyle = setScaleStyle(resetObj, rem());

export default {
  name: "Dinner",
  components: {
    "duct-upload": productUpload,
    "add-vepal": addvepal
  },
  data() {
    return {
      zr: "",
      w: 0,
      h: 0,
      groupH: customStyle.groupH, //元素组起始位置
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
      // showProject: false,
      // offsetProject: [0, 0],
      // deilProject: {},
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
      // showProduct: false,
      // offsetProduct: [0, 0],
      // deilProduct: [],
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
  created() {
    // this.$slMsg.show('sdfsdf')
    var div = document.createElement("div");
    // div.style.visibility = 'hidden'
    div.style.fontSize = customStyle.project.fontSize + "px";
    div.style.position = "absolute";
    div.style.float = "left";
    div.style["white-space"] = "nowrap";
    div.innerText = "智能3";
    document.body.appendChild(div);
    //  console.log(getComputedStyle(div,null)['borderBottomWidth'])
    // console.log(getComputedStyle(div, null)["width"]);
    //  console.log(div.currentStyle['width'])
    // var width = div.style.width ;
    document.body.removeChild(div);

    //  console.log(div.currentStyle)
    // console.log(width)
    window.zrender = zrender
  },
  watch: {
    // offset
  },
  mounted() {
    //拉取 设置数据
    this.customGetStyle();
    // this.render();
    // this.getData();
    let that = this;
    let timer = null;
   
    window.addEventListener("resize", function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        that.resetData();
        that.init();
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
    save(){
      var _this=this;
      //获取ztree被选中节点的值
      var treeObj=$.fn.zTree.getZTreeObj("ztreedemo"),
      nodes=treeObj.getCheckedNodes(true),
      sueIdstr="";
      for(var i=0;i<nodes.length;i++){
          if(nodes[i].pId==0||nodes[i].pId==null){
             sueIdstr+=nodes[i].id + ",";
          }
      }
      if(sueIdstr.length>0){
          _this.issueId=sueIdstr.substring(0,sueIdstr.length-1);
      }
      if(_this.suitName.length==0){
          alert("SP名称不能为空");
          return;
      }
      if(_this.suitDate.length==0){
          alert("套装日期不能为空");
          return;
      }
      if(_this.suitDescription.length==0){
          alert("套装描述不能为空");
          return;
      }
      if(_this.issueId.length==0){
          alert("请选择套装产品");
          return;
      }
      //请求保存接口
      this.$http.get('/dev/suit/addSuit',{
              suitName:_this.suitName,
              suitDate:_this.suitDate,
              suitDescription:_this.suitDescription, 
              issueId:_this.issueId
          },(res)=>{
              if(res.status===200){
                   alert("保存成功");
                   window.location.reload();
              }else{
                  console.log(res) 
              }
      })
      _this.dialogVisible = false;
      
  },
    render() {
      let container = document.getElementById("container");
      this.zr = zrender.init(container, {
        devicePixelRatio: window.devicePixelRatio
        // width:1400
      });
      this.w = this.zr.getWidth();
      this.h = this.zr.getHeight();
    },
    resetData() {
      //重新生成
      customStyle = setScaleStyle(resetObj, rem());
      this.groupH = customStyle.groupH;
      this.bscroll = true; // 是否加载
      // this.pageNo = 1;
      //this.pageSize = 10 // 初始每页数据数
      // this.lastPage = false; //最后一页
      this.zr.clear();
      this.zr.resize();
      this.w = this.zr.getWidth();
      this.h = this.zr.getHeight();
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

              this.groupPosition(res.data.data.suits, listLen);
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
    init() {
      this.groupPosition(this.list, 0);
    },
    cteateRectL(data, positionObj, conf) {
      if (!data.length) return;
      //  包围盒子得高度
      let groupH = positionObj.H;
      // 水平间隔
      let xInterval = conf.line.width;
      // line x轴
      let lineLX = conf.project.width;
      // 基础元素高度
      let elH = conf.project.height;
      //基础元素宽度
      let elW = conf.project.width;
      // 圆角
      let rectR = conf.project.rr;
      //元素组的总宽度
      let groupWidth = conf.groupWidth;
      // 获取y轴的定位
      let elPosition = cutLen => {
        if (data.length < 2) {
          return {
            elrp: positionObj.L,
            elly1p: groupH / 2,
            elmp: (groupH - conf.project.imageH) / 2
          };
        } else {
          return {
            elrp: (elH + positionObj.L) * cutLen,
            elly1p: elH / 2 + (elH + positionObj.L) * cutLen,
            elmp:
              (elH - conf.project.imageH) / 2 + (elH + positionObj.L) * cutLen
          };
        }
      };

      // 包围盒总高度
      let group = new zrender.Group();
      data.forEach((t, i) => {
        let g = new zrender.Group();
        // 矩形组元素  elPosition(i).elrp
        let rectGroup = new zrender.Group();
        let rectEl = rect({
          shape: {
            x: 0,
            y: 0,
            width: elW,
            height: elH,
            r: rectR
          },
          style: {
            fill: conf.project.bgColor,
            text: textFormat(
              t.projectName,
              conf.project.textsize,
              conf.project.textSizeSum
            ),
            textFill: conf.project.color,
            fontSize: conf.project.fontSize,
            textPosition: "left",
            textAlign: "left",
            textOffset: conf.project.textOffset
            // textBackgroundColor:'red',
            // textVerticalAlign:'top',
            // textPadding:20,
            // textDistance:100,
            // textWidth:10000,
            // textRect:{
            //   x:0,
            //   y:0,
            //   width: elW-100,
            //   height: elH,
            // },
            // textLineHeight:6,
            // textRect:{
            //   x: 0,
            //   y: 0,
            //   width: elW,
            //   height: elH,
            // }
            // textLineHeight:30
          },
          projectId: t.projectId
        });
        let imageEl = image({
          style: {
            image: require("./edit.png"),
            x: elW - conf.project.imageW,
            y: (elH - conf.project.imageH) / 2,
            width: conf.project.imageW,
            height: conf.project.imageH
          }
        });
        imageEl.hide();
        rectGroup.add(rectEl);
        rectGroup.add(imageEl);
        rectGroup.position = [0, elPosition(i).elrp];
        let lineEl = line({
          shape: {
            x1: lineLX,
            y1: elPosition(i).elly1p,
            x2: lineLX + xInterval,
            y2: groupH / 2
          },
          style: {
            fill: conf.line.color,
            stroke: conf.line.color
          }
        });
        g.add(rectGroup);
        g.add(lineEl);
        let textGroup = this.createText(t, conf);
        textGroup.position = [-((elW * 2) / 3 + elH / 2), elPosition(i).elrp];
        g.add(textGroup);
        group.add(g);
      });
      return group;
    },
    cteateRectR(data, positionObj, conf) {
      if (!data.length) return;
      //  包围盒子得高度
      let groupH = positionObj.H;
      // 水平间隔
      let xInterval = conf.line.width;
      // 基础元素高度
      let elH = conf.product.height;
      // //基础元素宽度
      let elW = conf.product.width;
      // 圆角
      let rectR = conf.product.rr;
      // // line x轴
      let lineRX = conf.project.width + conf.suit.width + xInterval;
      //元素组的总宽度
      let groupWidth = conf.groupWidth;
      // 获取y轴的定位
      let elPosition = cutLen => {
        if (data.length < 2) {
          return {
            elrp: positionObj.R,
            elly2p: groupH / 2,
            elmp: (groupH - conf.product.imageH) / 2
          };
        } else {
          return {
            elrp: (elH + positionObj.R) * cutLen,
            elly2p: elH / 2 + (elH + positionObj.R) * cutLen,
            elmp:
              (elH - conf.product.imageH) / 2 + (elH + positionObj.R) * cutLen
          };
        }
      };
      // 包围盒总高度
      let group = new zrender.Group();

      data.forEach((t, i) => {
        let g = new zrender.Group();
        // 矩形组元素  elPosition(i).elrp
        let rectGroup = new zrender.Group();
        let rectEl = rect({
          shape: {
            x: 0,
            y: 0,
            width: elW,
            height: elH,
            r: rectR
          },
          style: {
            fill: conf.product.bgColor,
            text: textFormat(
              `${t.productName + "\t\t\t" + t.productVersion}`,
              conf.product.textsize,
              conf.product.textSizeSum
            ),
            textFill: conf.product.color,
            fontSize: conf.product.fontSize
          },
          productId: t.productId
        });
        rectGroup.add(rectEl);
        rectGroup.position = [groupWidth - elW, elPosition(i).elrp];
        let lineEl = line({
          shape: {
            x1: lineRX,
            y1: groupH / 2,
            x2: lineRX + xInterval,
            y2: elPosition(i).elly2p
          },
          style: {
            fill: conf.line.color,
            stroke: conf.line.color
          }
        });
        g.add(rectGroup);
        g.add(lineEl);
        group.add(g);
      });
      return group;
    },
    cteateRectM(data, positionObj, conf) {
      let groupH = positionObj.H;
      // 水平间隔
      let xInterval = conf.line.width;
      // 基础元素高度
      let elH = conf.suit.height;
      //基础元素宽度
      let elW = conf.suit.width;
      // line x轴
      let lineRX = conf.project.width + conf.suit.width + xInterval;
      //元素组的总宽度
      let groupWidth = conf.groupWidth;
      let group = new zrender.Group();
      group.attr({
        shape: {
          width: elW,
          height: elH
        },
        position: [conf.project.width + xInterval, (groupH - elH) / 2]
      });
      let ellipseEl = ellipse({
        shape: {
          cx: elW / 2,
          cy: elH / 2,
          rx: elW / 2,
          ry: elH / 2
        },
        style: {
          fill: conf.suit.bgColor,
          text: `${textFormat(
            data.suitName || "",
            conf.suit.textsize,
            conf.suit.textSizeSum
          )}${data.suitDate ? "\n" + data.suitDate : ""}`,
          // text:'{a1|haha}\n{a2|sdfdf}',
          textFill: conf.suit.color,
          fontSize: conf.suit.fontSize
          // rich: {
          //   a1: {
          //     textFill: "rgb(199,86,83)",
          //     textLineHeight: 10,
          //     textBorderColor: "#000"
          //   },
          //   a2: {
          //     textFill: "yellow",
          //     textPadding: 3
          //   }
          // }
        },
        name: "PM"
      });
      let circleElL = circle({
        shape: {
          cx: elW / 5 / 2,
          cy: elH / 2,
          r: elW / 5 / 2
        },
        style: {
          fill: conf.suit.mCircleFillColor,
          text: "项目",
          fontSize: (conf.suit.fontSize * 4) / 5
        },
        name: "PL"
      });
      let circleElR = circle({
        shape: {
          cx: elW - elW / 5 / 2,
          cy: elH / 2,
          r: elW / 5 / 2
        },
        style: {
          fill: conf.suit.mCircleFillColor,
          text: "版本",
          fontSize: (conf.suit.fontSize * 4) / 5
        },
        name: "PR"
      });
      group.add(ellipseEl);
      group.add(circleElL);
      group.add(circleElR);
      return group;
    },
    //文字 +圆弧
    createText(opt, conf) {
      opt = {
        a: opt.typeName,
        b: opt.priorityName,
        c: opt.statusName
      };
      // 创建 文字
      let h = conf.project.height;
      let textStyle = {
        shape: {
          width: (conf.project.width * 2) / 3,
          height: h / 3,
          r: rem(3)
        },
        style: {
          textAlign: "left",
          text: "aaaa",
          textVerticalAlign: "middle",
          fontSize: (conf.project.fontSize * 4) / 5,
          fill: "#fff",
          // stroke:'gold',
          textPosition: "left",
          textDistance: -5
        }
      };
      let option = [
        {
          text: `类型: ${opt.a}`,
          position: [0, 0]
        },
        {
          text: `优先级: ${opt.b}`,
          position: [0, h / 3]
        },
        {
          text: `状态: ${opt.c}`,
          position: [0, h - h / 3]
        }
      ];
      let textGroup = new zrender.Group();
      option.forEach((t, i) => {
        let textRect;
        if (i == 1) {
          let color;
          textRect = rect({
            shape: {
              ...textStyle.shape
            },
            style: {
              ...textStyle.style,
              text: t.text
            },
            position: t.position
          });
          textRect
            .on("mouseover", function(e) {
              color = e.target.style.stroke;
              e.target.attr({
                style: {
                  stroke: "gold"
                }
              });
            })
            .on("mouseout", function(e) {
              e.target.attr({
                style: {
                  stroke: color
                }
              });
            });
        } else {
          textRect = rect({
            shape: {
              ...textStyle.shape
            },
            style: {
              ...textStyle.style,
              text: t.text
            },
            position: t.position
          });
        }
        textGroup.add(textRect);
      });
      // let prodjBox=this.createDragBox()
      // prodjBox.attr({zlevel:1})
      // prodjBox.position=[0,DEFAULT.height*2/3+5]
      // textGroup.add(prodjBox)
      // 创建圆弧
      let deg = c => (c * Math.PI) / 180;
      let r = conf.project / 4;
      let arcOpt = [
        {
          shape: {
            r: r,
            cx: 0,
            cy: r,
            startAngle: 0,
            endAngle: -deg(90),
            clockwise: false
          }
        },
        {
          shape: {
            r: r,
            cx: 0,
            cy: 3 * r,
            startAngle: 0,
            endAngle: deg(90),
            clockwise: true
          }
        },
        {
          shape: {
            r: r,
            cx: 2 * r,
            cy: r,
            startAngle: -deg(180),
            endAngle: -deg(270),
            clockwise: false
          }
        },
        {
          shape: {
            r: r,
            cx: 2 * r,
            cy: 3 * r,
            startAngle: deg(180),
            endAngle: deg(270),
            clockwise: true
          }
        }
      ];
      let arcGroup = new zrender.Group();
      arcOpt.forEach(t => {
        let Arc = arc({ ...t });
        arcGroup.add(Arc);
      });
      let group = new zrender.Group();
      let groupOpt = {
        width: (conf.project.width * 2) / 3 + conf.project.height / 2,
        height: conf.project.height
      };
      textGroup.attr({
        style: {
          width: parseInt((conf.project.width * 2) / 3),
          height: conf.project.height
        },
        position: [0, 0]
      });

      arcGroup.attr({
        shape: {
          width: conf.project.height / 2,
          height: conf.project.height
        },
        position: [(conf.project.width * 2) / 3, 0]
      });
      group.add(textGroup);
      group.add(arcGroup);
      group.attr({
        shape: {
          width: groupOpt.width,
          height: groupOpt.height
        }
      });
      return group;
    },
    /**
     * 每组元素的占用的高度
     * 左右间隔
     * return {
     * h ：元素盒的高度
     * L:左边间隔
     * R:右边间隔
     * }
     */
    getBaseposition(data, conf) {
      let project = data.projectList;
      let product = data.productList;
      let lenPjt = project ? project.length : 0; // 左边
      let lenPdt = product ? product.length : 0; // 右边
      let projectH = conf.project.height; //左元素高
      let productH = conf.product.height; // 右元素高
      let suitH = conf.suit.height; // 中
      let bashHl = conf.hInterval; // 基础间隔
      let base = {};
      function getMax() {
        let computedSum = (len, h) => {
          if (len === 0) {
            return 0;
          } else {
            return h * len + (len - 1) * bashHl;
          }
        };
        function arrSort(property) {
          return function(a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
          };
        }
        let arr = [
          {
            elH: computedSum(lenPjt, projectH),
            type: "L"
          },
          {
            elH: computedSum(lenPdt, productH),
            type: "R"
          },
          {
            elH: suitH,
            type: "M"
          }
        ];
        arr.sort(arrSort("elH"));
        return {
          sumH: arr[arr.length - 1].elH,
          sumEl: arr[arr.length - 1].type
        };
      }

      let sumObj = getMax();

      base.H = sumObj.sumH; //包围盒高度
      /**
       * 计算元素间隔
       * 元素组总高度 Bh
       * 元素基础高度 Dh,
       *
       * 元素数组长度 len,
       * return 间隔
       */
      let computedL = (Bh, Dh, len) => {
        if (len < 2) {
          return (Bh - Dh * len) / (len + 1);
        } else {
          return (Bh - Dh * len) / (len - 1);
        }
      };
      /**
       * 计算总高度
       * 元素基础高度 Dh,
       * 元素基础间隔高度 Dhl, DEFAULT.hInterval
       * 元素数组长度 len,
       * return 总高度
       */
      let computedH = (Dhl, Dh, len) => {
        return Dh * len + (len - 1) * Dhl;
      };
      if (sumObj.sumEl === "M") {
        // 左元素 高间距
        base.L = computedL(base.H, projectH, lenPjt);
        // 右元素 高间距
        base.R = computedL(base.H, productH, lenPdt);
      } else if (sumObj.sumEl === "L") {
        base.L = bashHl;
        base.R = computedL(base.H, productH, lenPdt);
      } else {
        base.L = computedL(base.H, projectH, lenPjt);
        base.R = bashHl;
      }
      return base;
    },
    //包围盒定位
    groupPosition(data, listLen) {
      let that = this;
      //元素组的总宽度
      let projectW = customStyle.project.width;
      let projectH = customStyle.project.height;
      let projectFontSize = customStyle.project.fontSize;

      let productW = customStyle.product.width;
      let productH = customStyle.product.height;
      let productFontSize = customStyle.product.fontSize;

      let suitW = customStyle.suit.width;
      let suitH = customStyle.suit.height;
      let suitFontSize = customStyle.suit.fontSize;
      let lineW = customStyle.line.width;
      let hInterval = customStyle.hInterval; // 间隔基础
      let groupWidth = projectW + productW + suitW + lineW * 2;
      customStyle.groupWidth = groupWidth;

      let computedTextNum = (elw, elh, marLen, size, type) => {
        let w, h, textSize;
        if (elw < marLen * 2) {
          w = elw;
        } else {
          w = elw - marLen * 2;
        }
        if (elh < marLen * 2) {
          h = elh;
        } else {
          h = elh - marLen * 2;
        }
        if (type === "L") {
          textSize = Math.round((w - marLen * 2) / size) * 2;
        } else if (type === "R") {
          textSize = Math.round(w / size) * 2;
        } else {
          if (h < marLen * 2) {
            h = marLen;
          } else {
            h = elh - marLen;
          }
          textSize = Math.round((w - marLen / 2) / size) * 2;
        }
        // 临时加大行距
        h = h - marLen;
        return {
          textsize: textSize,
          textSizeSum: Math.round(h / size) * textSize
        };
      };
      // 文字每行显示的数量 总共显示的数量 project
      // let projecttextSizeNum = Math.round(((projectW - customStyle.project.textOffset[0]*5)/projectFontSize) *2)
      let projecttextSizeNum = computedTextNum(
        projectW,
        projectH,
        customStyle.project.textOffset[0],
        projectFontSize,
        "L"
      );
      customStyle.project.textsize = projecttextSizeNum.textsize;
      customStyle.project.textSizeSum = projecttextSizeNum.textSizeSum;

      // product
      let producttextSizeNum = computedTextNum(
        productW,
        productH,
        customStyle.project.textOffset[0],
        productFontSize,
        "R"
      );
      customStyle.product.textsize = producttextSizeNum.textsize;
      customStyle.product.textSizeSum = producttextSizeNum.textSizeSum;

      // suit
      let suittextSizeNum = computedTextNum(
        suitW,
        suitH,
        suitW / 5,
        suitFontSize,
        "M"
      );
      customStyle.suit.textsize = suittextSizeNum.textsize;
      customStyle.suit.textSizeSum = suittextSizeNum.textSizeSum;
      // y 坐标起点
      let groupH = this.groupH;

      data.forEach((t, i) => {
        let project = t.projectList;
        let product = t.productList;
        let base = this.getBaseposition(t, customStyle);
        let group = new zrender.Group();
        group.attr({
          shape: {
            width: groupWidth,
            height: base.H
          },
          // position: [(that.w - groupWidth) / 2, groupH]
          position: [that.w / 2 - (projectW + lineW + suitW / 2), groupH]
        });
        // 保存下次渲染的初始高度
        groupH += hInterval + base.H;

        let groupL = that.cteateRectL(project, base, customStyle);
        let groupR = that.cteateRectR(product, base, customStyle);
        let groupM = that.cteateRectM(t, base, customStyle);
        group.add(groupL);
        group.add(groupR);
        group.add(groupM);
        // 遍历 各子节点元素 做业务处理
        this.handleM(groupM, groupL, groupR, t);
        // 鼠标 添加 hover 事件
        if (groupL) {
          this.handleL(groupM, groupL, groupR, project, listLen + i);
        }
        if (groupR) {
          this.handleR(groupM, groupL, groupR, product);
        }
        this.zr.add(group);
        this.zr.resize({
          height: groupH
        });
        // this.zr.refreshImmediately()
      });
      // 保存下次渲染的初始高度
      this.groupH = groupH;
    },
    handleM(groupM, groupL, groupR, data) {
      groupM.eachChild((k, i) => {
        let flag = true;
        k.on("click", e => {
          if (k.name == "PL") {
            if (groupL) {
              flag ? groupL.hide() : groupL.show();
              flag = !flag;
            }
            // this.showProject=false
          } else if (k.name == "PR") {
            if (groupR) {
              flag ? groupR.hide() : groupR.show();
              flag = !flag;
              // this.showProduct=false
            }
          } else if (k.name == "PM") {
            // let position=[e.target.shape.rx,e.target.shape.ry]
            // // 鼠标相对文档偏移
            // let offset = [e.target.transform[4], e.target.transform[5]];
            // //元素相对文档偏移
            // let p = [offset[0], offset[1]];
            // let poffset = [
            //   `${parseInt(p[0] + DEFAULT.width)}px`,
            //   `${parseInt(p[1] + DEFAULT.verH / 2)}px`
            // ];
            this.spDetil.visible = true;

            // let spStrType = ['suitName','suitDate','suitAdjustingPerson','suitTestPerson','suitDescription']
            let spData = this.spDetil.data;
            spData.forEach(item => {
              if (data[item.type]) {
                item.val = data[item.type];
              } else {
                item.val = "";
              }
            });
            this.spDetil.data = spData;
          }
        });
      });
    },
    //添加鼠标悬停效果
    handleHover(groupM, groupL, groupR) {
      return (elGroup, styOpt, type, data) => {
        let rectOpt = {
          style: {
            stroke: styOpt.style.stroke
          }
        };
        let fn = null,
          ID;
        if (type === "L") {
          fn = groupR;
          ID = "productId";
        } else {
          fn = groupL;
          ID = "projectId";
        }
        let rectEl = elGroup.childAt(0).childAt(0);
        let lineEl = elGroup.childAt(1);
        rectEl.attr(rectOpt);
        lineEl.attr(styOpt);
        groupM.childAt(0).attr(rectOpt);
        if (data) {
          data.forEach(t => {
            fn.eachChild(k => {
              let krect = k.childAt(0).childAt(0);
              if (t[ID] == krect[ID]) {
                krect.attr(rectOpt);
                k.childAt(1).attr(styOpt);
              }
            });
          });
        } else {
          fn.eachChild(k => {
            let krect = k.childAt(0).childAt(0);
            krect.attr(rectOpt);
            k.childAt(1).attr(styOpt);
          });
        }
      };
    },
    //左边盒子点击业务
    handleL(groupM, groupL, groupR, data, index) {
      let addHover = this.handleHover(groupM, groupL, groupR);
      groupL.eachChild((k, i) => {
        let hoverL = false;
        let rectEl = k.childAt(0).childAt(0);
        let editEl = k.childAt(0).childAt(1);
        k.childAt(0)
          .on("mouseover", e => {
            hoverL = true;

            let lineEl = k.childAt(1);
            this.getproRelation("L", rectEl.projectId, res => {
              if (res.code == 200) {
                if (hoverL) {
                  addHover(
                    k,
                    { style: { stroke: customStyle.line.lightcolor } },
                    "L",
                    res.data
                  );
                }
              }
            });
            //编辑按钮
            editEl.show();
          })
          .on("mouseout", e => {
            hoverL = false;
            addHover(
              k,
              {
                style: {
                  stroke: customStyle.line.color,
                  fill: customStyle.line.color
                }
              },
              "L"
            );
            //编辑按钮
            editEl.hide();
          });
        rectEl.on("click", e => {
          // let position = [e.target.shape.x, e.target.shape.y];
          // // 鼠标相对文档偏移
          // let offset = [e.target.transform[4], e.target.transform[5]];
          // //元素相对文档偏移
          // let p = [position[0] + offset[0], position[1] + offset[1]];
          // let poffset = [
          //   `${parseInt(p[0] + DEFAULT.width)}px`,
          //   `${parseInt(p[1] + DEFAULT.height / 2)}px`
          // ];
          this.projectDetil.visible = true;
          let projectData = this.projectDetil.data;
          projectData.forEach(item => {
            if (data[i][item.type]) {
              item.val = data[i][item.type];
            } else {
              item.val = "";
            }
          });
          this.projectDetil.data = projectData;
          // let docAddr = data[i]['docAddr']
          // this.relationDoc(docAddr)
        });
        editEl.on("click", e => {
          //当前项目实例
          this.projectEdit.curtEl = rectEl || null;
          // 当前项目优先级元素实例
          this.projectEdit.curtPriorityEl =
            k
              .childAt(2)
              .childAt(0)
              .childAt(1) || null;
          this.projectEdit.visible = true;
          this.projectEdit.projectName = data[i].projectName;
          this.projectEdit.projectId = data[i].projectId;
          this.editProject(data[i].priorityName);
          /**
           * 当前编辑项的套装索引
           * 当前编辑项索引
           *
           */
          this.projectEdit.editIndex = index;
          this.projectEdit.editProjectIndex = i;
        });
      });
    },
    //右边盒子点击事件
    handleR(groupM, groupL, groupR, data) {
      let addHover = this.handleHover(groupM, groupL, groupR);
      groupR.eachChild((k, i) => {
        let hoverR = false;
        let rectEl = k.childAt(0).childAt(0);
        let editEl = k.childAt(0).childAt(1);
        k.childAt(0)
          .on("mouseover", e => {
            hoverR = true;
            // that.$slloading.show()
            this.getproRelation("R", rectEl.productId, res => {
              if (res.code == 200) {
                if (hoverR) {
                  hoverR = false;
                  // that.$slloading.hide()
                  addHover(
                    k,
                    { style: { stroke: customStyle.line.lightcolor } },
                    "R",
                    res.data
                  );
                }
              }
            });
          })
          .on("mouseout", () => {
            hoverR = false;
            // that.$slloading.hide()
            addHover(
              k,
              {
                style: {
                  stroke: customStyle.line.color,
                  fill: customStyle.line.color
                }
              },
              "R"
            );
          });
        rectEl.on("click", e => {
          //打开弹层
          this.productDetil.visible = true;
          //下载数据的初始化
          this.$http.post(
            "api/suit/product/findVersionById",
            {
              productVersionId: data[i]["productId"] || ""
            },
            res => {
              if (res.status === 200) {
                if (res.data.code === 200) {
                  if (!res.data.data || res.data.data === "") {
                    this.productDetil.downBtn = false;
                  } else {
                    this.productDetil.downBtn = true;
                    this.productDetil.cursp = res.data.data;
                  }
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "warning"
                  });
                }
              }
            }
          );

          // 数据的传递
          let productData = this.productDetil.data;
          productData.forEach((item, index) => {
            if (data[i][item.type]) {
              item.val = data[i][item.type];
            } else {
              item.val = "";
              if (index === 4) {
                item.val = [];
              }
            }
          });
          this.productDetil.productId = data[i]["productId"];
          this.productDetil.data = productData;
          // 查询历史数据
          this.getProductHistory(
            data[i]["productName"],
            data[i]["productVersion"]
          );
        });
      });
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

            resetObj = util.merge(resetObj, customObj);

            customStyle = setScaleStyle(resetObj, rem());
            this.render();
            this.getData();
             window.zr = this.zr
          }
        }
      });
    },
    //重新渲染
    customSetstyle(data) {
      //重新计算
      resetObj = util.merge(resetObj, data);
      this.resetData();
      this.init();
    },
    customResetStyle() {
      resetObj = util.clone(styleConf());
      this.resetData();
      this.init();
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
