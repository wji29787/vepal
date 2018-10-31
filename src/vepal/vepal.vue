<template>
  <div>
    <add-vepal @saveComplete = "reRender" />
    <span class="version">套装展示<strong>v1.0.1</strong></span>
    <div class = "dinner">
      <div id="container">
      </div>
    </div>
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
            <el-col :class = "{'dialog-item-val' : $index ===3}" :span = "18">{{item.val}}</el-col>
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
            <el-col class="sp-item-val" :class = "{'dialog-item-val' : $index ===4}" :span = "18">{{item.val}}</el-col>
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
                {{productDetil.inner.description}}
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
  rem,
  line,
  ellipse,
  circle,
  textFormat,
  arc,
  text,
  image
} from "../assets/js/util.js";
// 上传文件
import productUpload from './productUpload'
// 新增套装
import addvepal from './addvepal'
let DEFAULT = {
  hInterval: rem(20), // 上下间隔
  width: rem(200),
  // width: rem(150),
  height: rem(70),
  rectR: rem(10), //矩形圆角
  verH: rem(80), //套装盒高度
  groupWidth: rem(200 * 3 + 260 * 2), //包装盒宽
  fontSize: rem(18),
  xInterval: rem(260),
  // xInterval: rem(100),
  lineColor: "#cacaca",
  lineHoverColor: "red",
  mCirclefontSize: rem(15),
  mCirclefontColor: "",
  mCircleFillColor: "#F5F5F5",
  imageW: rem(30),
  imageH: rem(30)
};
let tlData = [
  {
    name: "项目名称",
    bgColor: "rgba(74, 163, 222, 1)",
    color: "#fff"
  },
  {
    name: "套装",
    bgColor: "rgba(119, 141, 252, 1)",
    color: "#fff"
  },
  {
    name: "相关版本",
    bgColor: "rgba(131, 220, 220, 1)",
    color: "#fff"
  }
];

export default {
  name: "Dinner",
  components:{
    'duct-upload': productUpload,
    'add-vepal' : addvepal
  },
  data() {

    return {
      zr: "",
      w: 0,
      h: 0,
      groupH: rem(50), //元素组起始位置
      groupArr: [],
      list: [],
      dragBox: null, // 显示框元素
      tipShow: false,
      bscroll: true, // 是否加载
      pageNo: 1,
      pageSize: 10, // 初始每页数据数
      lastPage: false, //最后一页
      scrollTop:0,
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
            type: "projectId"
          },
          {
            name: "需求描述",
            val: "",
            type: "description"
          }
        ]
      },
      // showProject: false,
      // offsetProject: [0, 0],
      // deilProject: {},
      //产品详情
      productDetil: {
        title: "产品详细",
        productId:'',
        visible: false,
        downBtn:false, //下载按钮的显示 隐藏
        cursp:'',
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
        },
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
        editIndex:-1,
        editProjectIndex: -1
      },
      // showSp:false,
      // offsetSp:[0,0],
    };
  },
  created() {
    // this.$slMsg.show('sdfsdf')
  },
  watch: {
    // offset
  },
  mounted() {
    this.render();

    // this.dragTextBox();
    this.getData();
    let that = this;
    let timer = null;
    window.addEventListener("resize", function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        that.resetData();
        that.init();
      }, 300);
    });
    this.fnScroll();
  },
  methods: {
    handleText(val) {

      console.log(val);
      // this.curtEl.attr({
      //   style:{
      //     text :val
      //   }
      // })
    },
    saveText() {
      this.curtEl.attr({
        style: {
          text: textFormat(this.input, 18, 38)
        }
      });
    },
    // 刷新
    reRender() {
      this.resetData();
      this.getData();
    },
    render() {
      let container = document.getElementById("container");
      this.zr = zrender.init(container,{
        devicePixelRatio:window.devicePixelRatio,
        // width:1400
      });
      this.w = this.zr.getWidth();
      this.h = this.zr.getHeight();
    },
    resetData() {
      this.groupH = rem(50);
      this.groupArr = [];
      this.dragBox = null;
      this.bscroll = true; // 是否加载
      this.pageNo = 1;
      //this.pageSize = 10 // 初始每页数据数
      this.lastPage = false; //最后一页
      this.zr.clear();
      this.zr.resize();
      this.w = this.zr.getWidth();
      this.h = this.zr.getHeight();
      DEFAULT = {
        hInterval: rem(20), // 上下间隔
        // width: rem(150),
        width: rem(200),
        height: rem(70),
        rectR: rem(10), //矩形圆角
        verH: rem(80), //套装盒高度
        // groupWidth: rem(200 * 3 + 260 * 2), //包装盒宽
        fontSize: rem(18),
        xInterval: rem(260),
        // xInterval: rem(100),
        lineColor: "#cacaca",
        lineHoverColor: "red",
        mCirclefontSize: rem(15),
        mCirclefontColor: "",
        mCircleFillColor: "#F5F5F5",
        imageW: rem(30),
        imageH: rem(30)
      };
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
        "/api/suit/suit/findAllSuitInfo",
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
              let listLen
              if (this.list.length === 0) {
                listLen = 0
                this.list = res.data.data.suits;
              } else {
                listLen = this.list.length
                this.list = this.list.concat(res.data.data.suits);
              }
              // let groupH = this.groupH
              // console.log(groupH)

              this.groupPosition(res.data.data.suits,listLen);
              util.setScrollTop(this.scrollTop)

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
      // this.titleGroup();
      this.groupPosition(this.list,0);
      // this.dragTextBox();
    },
    titleGroup: function() {
      // 盒子宽
      let widthBase = rem(150);
      // 盒子高
      let heightBase = rem(50);
      // 水平间隔
      let winterval = rem(260);
      // 垂直间隔
      let hInterval = rem(50);
      // 盒子 圆角 r
      let r = rem(10);
      // 文字size
      let fontSize = rem(20);
      // 配置项
      let rectTleOpt = {
        width: widthBase,
        height: heightBase,
        r: r
      };
      // 标题包围盒
      let group = new zrender.Group();
      tlData.forEach((t, i) => {
        let rectEl = rect({
          shape: {
            x: i == 0 ? 0 : (widthBase + winterval) * i,
            y: 0,
            ...rectTleOpt
          },
          style: {
            fill: t.bgColor,
            text: t.name,
            textFill: "#fff",
            fontSize: fontSize
          }
        });
        group.add(rectEl);
      });
      //获取包围盒
      var rectGroup = group.getBoundingRect();
      let position = [(this.w - rectGroup.width) / 2, this.groupH];
      // 包围盒距离顶部得高度
      this.groupH += rectGroup.height + hInterval;
      group.position = position;
      this.zr.add(group);
    },
    cteateRectL(data, positionObj) {
      // console.log(data)
      if (!data.length) return;
      //  包围盒子得高度
      let groupH = positionObj.H;
      // 水平间隔
      let xInterval = DEFAULT.xInterval;
      // line x轴
      let lineLX = DEFAULT.width;
      // 基础元素高度
      let elH = DEFAULT.height;
      //基础元素宽度
      let elW = DEFAULT.width;
      let rectR = DEFAULT.rectR;
      // 获取y轴的定位
      let elPosition = cutLen => {
        if (data.length < 2) {
          return {
            elrp: positionObj.L,
            elly1p: groupH / 2,
            elmp: (groupH - DEFAULT.imageH) / 2
          };
        } else {
          return {
            elrp: (elH + positionObj.L) * cutLen,
            elly1p: elH / 2 + (elH + positionObj.L) * cutLen,
            elmp: (elH - DEFAULT.imageH) / 2 + (elH + positionObj.L) * cutLen
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
            fill: tlData[0].bgColor,
            text: textFormat(t.projectName, 18, 38),
            textFill: tlData[0].color,
            fontSize: DEFAULT.fontSize,
            textPosition: 'left',
            textAlign:'left',
            textOffset:[10,0],
            // textLineHeight:60,
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
            x: elW - DEFAULT.imageW,
            y: (elH-DEFAULT.imageH)/2,
            width: DEFAULT.imageW,
            height: DEFAULT.imageH
          }
        });
        imageEl.hide()
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
            fill: DEFAULT.lineColor,
            stroke: DEFAULT.lineColor
          }
        });
        g.add(rectGroup);
        g.add(lineEl);
        let textGroup = this.createText(t);
        textGroup.position = [-((elW * 2) / 3 + elH / 2), elPosition(i).elrp];
        g.add(textGroup);
        group.add(g);
      });
      return group;
    },
    cteateRectR(data, positionObj) {
      if (!data.length) return;
      //  包围盒子得高度
      let groupH = positionObj.H;
      // 水平间隔
      let xInterval = DEFAULT.xInterval;
      // 基础元素高度
      let elH = DEFAULT.height;
      // //基础元素宽度
      let elW = DEFAULT.width;
      let rectR = DEFAULT.rectR;
      // // line x轴
      let lineRX = elW * 2 + xInterval;
      //元素组的总宽度
      let groupWidth = elW * 3 + xInterval * 2;
      // 获取y轴的定位
      let elPosition = cutLen => {
        if (data.length < 2) {
          return {
            elrp: positionObj.R,
            elly2p: groupH / 2,
            elmp: (groupH - DEFAULT.imageH) / 2
          };
        } else {
          return {
            elrp: (elH + positionObj.R) * cutLen,
            elly2p: elH / 2 + (elH + positionObj.R) * cutLen,
            elmp: (elH - DEFAULT.imageH) / 2 + (elH + positionObj.R) * cutLen
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
            fill: tlData[2].bgColor,
            text: textFormat(
              `${t.productName + " " + t.productVersion}`,
              20,
              40
            ),
            textFill: tlData[2].color,
            fontSize: DEFAULT.fontSize
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
            fill: DEFAULT.lineColor,
            stroke: DEFAULT.lineColor
          }
        });
        g.add(rectGroup);
        g.add(lineEl);
        group.add(g);
      });
      return group;
    },
    cteateRectM(data, positionObj) {
      let groupH = positionObj.H;
      // 水平间隔
      let xInterval = DEFAULT.xInterval;
      // 基础元素高度
      let elH = DEFAULT.verH;
      //基础元素宽度
      let elW = DEFAULT.width;
      // line x轴
      let lineRX = elW * 2 + xInterval;
      //元素组的总宽度
      let groupWidth = elW * 3 + xInterval * 2;
      let group = new zrender.Group();
      group.attr({
        shape: {
          width: elW,
          height: elH
        },
        position: [(groupWidth - elW) / 2, (groupH - elH) / 2]
      });
      let ellipseEl = ellipse({
        shape: {
          cx: elW / 2,
          cy: elH / 2,
          rx: elW / 2,
          ry: elH / 2
        },
        style: {
          fill: tlData[1].bgColor,
          text: `${textFormat(data.suitName || "", 12, 24)}${
            data.suitDate ? "\n" + data.suitDate : ""
          }`,
          // text:'{a1|haha}\n{a2|sdfdf}',
          textFill: tlData[1].color,
          fontSize: DEFAULT.fontSize,
          rich: {
            a1: {
              textFill: "rgb(199,86,83)",
              textLineHeight: 10,
              textBorderColor: "#000"
            },
            a2: {
              textFill: "yellow",
              textPadding: 3
            }
          }
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
          fill: DEFAULT.mCircleFillColor,
          text: "项目",
          fontSize: DEFAULT.mCirclefontSize
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
          fill: DEFAULT.mCircleFillColor,
          text: "版本",
          fontSize: DEFAULT.mCirclefontSize
        },
        name: "PR"
      });
      group.add(ellipseEl);
      group.add(circleElL);
      group.add(circleElR);
      return group;
    },
    //文字 +圆弧
    createText(opt) {
      opt = {
        a: opt.typeName,
        b: opt.priorityName,
        c: opt.statusName
      };
      // 创建 文字
      let h = DEFAULT.height;
      let textStyle = {
        shape: {
          width: (DEFAULT.width * 2) / 3,
          height: h / 3,
          r: rem(3)
        },
        style: {
          textAlign: "left",
          text: "aaaa",
          textVerticalAlign: "middle",
          fontSize: rem(15),
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
      let r = DEFAULT.height / 4;
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
        width: (DEFAULT.width * 2) / 3 + DEFAULT.height / 2,
        height: DEFAULT.height
      };
      textGroup.attr({
        style: {
          width: parseInt((DEFAULT.width * 2) / 3),
          height: DEFAULT.height
        },
        position: [0, 0]
      });

      arcGroup.attr({
        shape: {
          width: DEFAULT.height / 2,
          height: DEFAULT.height
        },
        position: [(DEFAULT.width * 2) / 3, 0]
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
    getBaseposition(data) {
      let project = data.projectList;
      let product = data.productList;
      let lenPjt = project ? project.length : 0; // 左边
      let lenPdt = product ? product.length : 0; // 右边
      let Dh = DEFAULT.height; //基础高度
      let Dhl = DEFAULT.hInterval; // 基础间隔
      let base = {};
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

      //左右元素都小于2时 以中间的元素高度为盒子高度
      if (lenPjt < 2 && lenPdt < 2) {
        base.H = DEFAULT.verH > Dh ? DEFAULT.verH : Dh; // 包围盒高度
        // 左元素 高间距
        base.L = computedL(base.H, Dh, lenPjt);
        // 右元素 高间距
        base.R = computedL(base.H, Dh, lenPdt);
      } else {
        //
        if (lenPjt === lenPdt) {
          base.H = computedH(Dhl, Dh, lenPjt);
          base.L = base.R = Dhl;
        } else if (lenPjt > lenPdt) {
          base.H = computedH(Dhl, Dh, lenPjt);
          base.L = Dhl;
          base.R = computedL(base.H, Dh, lenPdt);
        } else if (lenPjt < lenPdt) {
          base.H = computedH(Dhl, Dh, lenPdt);
          base.R = Dhl;
          base.L = computedL(base.H, Dh, lenPjt);
        }
      }
      return base;
    },
    //包围盒定位
    groupPosition(data,listLen) {
      let that = this;
      // 组得初始高度
      // let groupArr = [];
      //元素组的总宽度
      let groupWidth = DEFAULT.width * 3 + DEFAULT.xInterval * 2;
      let groupH = this.groupH;

      data.forEach((t, i) => {
        let project = t.projectList;
        let product = t.productList;
        let base = this.getBaseposition(t);
        let group = new zrender.Group();
        group.attr({
          shape: {
            width: groupWidth,
            height: base.H
          },
          position: [(that.w - groupWidth) / 2, groupH]
        });
        // 保存下次渲染的初始高度
        groupH += DEFAULT.hInterval + base.H;
        // let shapeL = {
        //   data: project
        // };
        let groupL = that.cteateRectL(project, base);
        let groupR = that.cteateRectR(product, base);
        let groupM = that.cteateRectM(t, base);
        group.add(groupL);
        group.add(groupR);
        group.add(groupM);
        // 遍历 各子节点元素 做业务处理
        this.handleM(groupM, groupL, groupR, t);
        // 鼠标 添加 hover 事件
        if (groupL) {
          this.handleL(groupM, groupL, groupR, project,listLen+i);
        }
        if (groupR) {
          this.handleR(groupM, groupL, groupR, product);
        }

        // groupArr.push(group);
        this.zr.add(group);
        this.zr.resize({
          height: groupH
        });
        // this.zr.refreshImmediately()
      });
      // 保存下次渲染的初始高度
      this.groupH = groupH;

      // this.groupArr = groupArr;
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
    handleL(groupM, groupL, groupR, data,index) {
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
                    { style: { stroke: DEFAULT.lineHoverColor } },
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
                  stroke: DEFAULT.lineColor,
                  fill: DEFAULT.lineColor
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
          this.projectEdit.projectName = data[i].projectName
          this.projectEdit.projectId = data[i].projectId
          this.editProject(data[i].priorityName)
          /**
           * 当前编辑项的套装索引
           * 当前编辑项索引
           *
           */
          this.projectEdit.editIndex = index
          this.projectEdit.editProjectIndex = i
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
                    { style: { stroke: DEFAULT.lineHoverColor } },
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
                  stroke: DEFAULT.lineColor,
                  fill: DEFAULT.lineColor
                }
              },
              "R"
            );
          });
        rectEl.on("click", e => {
          //打开弹层
          this.productDetil.visible = true;
          //下载数据的初始化
          this.$http.post('api/suit/product/findVersionById',{
            productVersionId:data[i]['productId']||''
          },res =>{
            if(res.status === 200){
              if(res.data.code === 200){
                  if(!res.data.data ||res.data.data === "" ){
                          this.productDetil.downBtn = false
                  }else{
                      this.productDetil.downBtn = true
                      this.productDetil.cursp = res.data.data
                  }
              }else{
                 this.$message({
                  message: res.data.msg,
                  type: 'warning'
                 });
              }
            }else{
              this.productDetil.downBtn = false
              this.$message.error(res);
            }

          })

          // 数据的传递
          let productData = this.productDetil.data;
          productData.forEach((item, index) => {
            if (data[i][item.type]) {
              item.val = data[i][item.type]
            } else {
              item.val = "";
              if (index === 4) {
                item.val = []
              }
            }
          })
          this.productDetil.productId = data[i]['productId']
          this.productDetil.data = productData
          // 查询历史数据
          this.getProductHistory(data[i]['productName'],data[i]['productVersion'])
        });
      });
    },
    // 详情弹框
    dragTextBox(opt) {
      let deOpt = {
        style: {
          stroke: "red",
          text: "loading...",
          opacity: 0.7
        },
        shape: {
          width: rem(100),
          height: rem(50),
          r: 10
        },
        z: 0,
        position: [0, 0]
      };
      deOpt = Object.assign({}, deOpt, opt);
      if (this.dragBox) {
        return this.dragBox;
      } else {
        this.dragBox = rect(deOpt);
        this.dragBox.hide();
        this.zr.add(this.dragBox);
        return this.dragBox;
      }
    },
    loadingBox(value) {},
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
    fnScroll() {
      let that = this;
      let beforeScrollTop = util.getScrollTop();
      let fn = function(e) {
        if (that.lastPage) {
          return;
        }
        if (!that.bscroll) return;
        // 窗口可视范围的高度
        var height = util.getClientHeight(),
          // 窗口滚动条高度
          theight = util.getScrollTop(),
          // 文档内容的高度
          rheight = util.getScrollHeight(),
          // 滚动的距离
          detal = theight - beforeScrollTop,
          // 滚动条距离底部的高度
          bheight = rheight - theight - height;
          beforeScrollTop = theight
        if(detal > 0){
             if(bheight <= 100){
               that.pageNo += 1;
              that.scrollTop = theight
              that.getData(that.pageNo);
             }

        }
      };
      window.addEventListener("scroll", fn,false);
    },
    editProject(priorityName) {
      this.$http.post("/api/suit-jira/project/findAllProjectPriority", res => {
        console.log("项目级别接口返回结果:"+res);
        if (res.status === 200) {
          // this.productEdit.data = res.data
          if (res.data.code === 200) {
            this.projectEdit.data = res.data.data;
            let data = res.data.data;
            this.projectEdit.priorityID = data.find(t => {
              return t.priorityName === priorityName.trim();
            }).priorityID;
          }
          // console.log(res.data)
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
              let priorityName = this.projectEdit.data.find(t =>{
                  return t.priorityID == this.projectEdit.priorityID
              }).priorityName
              // this.projectEdit.curtPriorityEl.attr({
              //   style:{
              //     text:`优先级: ${priorityName}`
              //   }
              // })
              // 修改响应项
              this.list[this.projectEdit.editIndex]['projectList'][this.projectEdit.editProjectIndex]['projectName'] = this.projectEdit.projectName
              this.list[this.projectEdit.editIndex]['projectList'][this.projectEdit.editProjectIndex]['priorityName'] = priorityName
              this.resetData()
              // this.getData();
              this.init()
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
      this.productDetil.inner.data = row

    },
    // 下载文件
    productDown(row) {
      // util.StandardPost(url1);
      // window.open(url)

      let url
      // 下载文件
      if(util.toType(row) === 'string' || util.toType(row) === 'number'){
        url = 'api/suit/file/download'
        util.StandardPost(url,{
          productVersionId:row
        });
      }else if(util.toType(row) === 'object'){
        url = 'api/suit/file/download'
         util.StandardPost(url,{
          productVersionId:row.verId
        });

      }

    },
    /**
     * 文件上传功能
     * 文件上传成功
     */
    uploadComplete(res){
      if(res.code === 200){
         this.productDetil.cursp = res.data
         this.productDetil.downBtn = true
      }
    },
    /**
     * 删除当前版本
     */
    deleteProduct(){
      this.$http.post('/api/suit/product/deleteVersionById',{
        productVersionId:this.productDetil.productId
      },res => {
        if(res.status === 200){
          if(res.data.code === 200){
            this.productDetil.cursp = '';
            this.productDetil.downBtn = false
          } else {
            this.$message.error(res.data.msg);
          }
        }else{
          this.$message.error(res);
        }
      })
    },
    /**
     * 历史记录查询
     */
    getProductHistory (productName,prodV) {
      this.$http.post('/api/suit/product/findAllHistoryVersionByProduct',{
        productName:productName, // 版本号
        productVersion:prodV     // 名称
      },res => {
        if(res.status === 200){
          if(res.data.code ===200){
             this.productDetil.historyData = res.data.data
          }
          // console.log(res.data)
        }
      })
    },
    /**
     * 格式化文件大小
     */
    formatFileSize (row,column,cellValue,index) {
        return cellValue+'MB'
    },
    /**
     * 格式化事件
     */
    formatTime (row,column,cellValue,index) {
        if(cellValue){

        }
        return this.$moment(cellValue).format('YYYY-MM-DD h:mm:ss')
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
  /* position: absolute */
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
  margin-top: 0.1rem
}
.item-produt{
  padding: 10px 0;
}
.item-produt-btn {
  overflow: hidden;
  max-width: 90%;
}
</style>
