<template>
  <div>
    <el-button type="text" class="elbutton"  @click="getzt">新增套装</el-button>
<el-dialog 
  title="添加套装"
  :visible="dialogVisible" width="50%">
      <div class="addvepal-layer">
        <ul>
            <li>
                <label>SP名称：</label>
                <el-input v-model="suitName" class="elinput" placeholder="请输入内容"></el-input>
            </li>
             <li>
                <label>时间：</label>
                <div class="block">
                    <el-date-picker
                    v-model="suitDate"
                    type="date"
                    placeholder="选择日期"
                    class="suitDate"
                    >
                    </el-date-picker>
                </div>
            </li>
             <li>
                <label>详细信息：</label>
                <textarea v-model="suitDescription"></textarea>
            </li>
            <li class="clearfix">
                <label>产品：</label>
                <div  class="producttree">
                    <ul class="ztree" id="ztreedemo"></ul>
                </div>
            </li>
        </ul>
    </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save()">确 定</el-button>
  </span>
</el-dialog>

    <div id="container">
    </div>
    <sl-dialog :value="showProject" :offset="offsetProject" :position="'absolute'" class="">
       dfsdfsdfsf
    </sl-dialog>
    <sl-dialog :value="showSp" :offset="offsetSp" :position="'absolute'">
      <div class="dialogStyle"> {{deilSp.suitDescription}}</div>
    </sl-dialog>
    <sl-dialog :value="showProduct" :offset="offsetProduct" :position="'absolute'">
       <!-- {{deilProduct[0][actionbody]}} -->
       <div  class="dialogStyle">
          <div
             v-for = "(item, index) in deilProduct"
             :key = "item.actionbody"
          >
            <p>{{item.actionbody}}</p>
          </div>
       </div>
    </sl-dialog>
  </div>

</template>

<script>
import 'ztree'
import 'ztree/css/zTreeStyle/zTreeStyle.css'
import 'ztree/js/jquery.ztree.core.js'
import 'ztree/js/jquery.ztree.excheck.js'
import zrender from "zrender";
import {
  rect,
  rem,
  line,
  ellipse,
  circle,
  textFormat,
  arc,
  text
} from "../assets/js/util.js";
let DEFAULT = {
  hInterval: rem(20), // 上下间隔
  width: rem(200),
  height: rem(70),
  verH: rem(80), //套装盒高度
  groupWidth: rem(200 * 3 + 260 * 2), //包装盒宽
  fontSize: rem(18),
  xInterval: rem(260),
  lineColor: "#cacaca",
  lineHoverColor: "red",
  mCirclefontSize: rem(15),
  mCirclefontColor: "",
  mCircleFillColor: "#F5F5F5"
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
      // 项目详情
      showProject: false,
      offsetProject: [0, 0],
      deilProject: {},
      //产品详情
      showProduct: false,
      offsetProduct: [0, 0],
      deilProduct: [],
      //套装详情
      showSp:false,
      offsetSp:[0,0],
      dialogVisible: false,
      nodeData:[
          { id:1, pId:0, name:"Pamir", open:true},
          { id:11, pId:1, name:"5.5.5", open:true},
          { id:111, pId:11, name:"TOP录播支持"},
          { id:12, pId:1, name:"5.6.x", open:true},
          { id:121, pId:12, name:"TOP音频录制"},
          { id:2, pId:0, name:"Gis天眼", open:true},
          { id:22, pId:2, name:"1.15.0", open:true},
          { id:221, pId:22, name:"TOP会议支持", open:true},
          { id:3, pId:0, name:"启明2视联终端", checked:true, open:true},
          { id:2, pId:0, name:"PamirMobile"},
      ],
      setting:{
          view:{
              showIcon:false
          },
          check: {
              enable: true,
              chkboxType:{"Y":"ps","N":"ps"}
          },
          data: {
              simpleData: {
                  enable: true
              }
          }
      },
      suitName:'', //SP名称
      suitDate:'', //时间
      suitDescription:'', //详细信息
      issueId:'',//产品
      deilSp: { suitDescription: "sdsdsd" }
    };
  },
  created() {},
  watch: {
    // offset
  },
  mounted() {
    this.render();
    this.getData();
    let that = this;
    let timer = null;
    window.addEventListener("resize", function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        that.resetData();
        that.init(that.list);
      }, 300);
    });
  },
  methods: {
    /**获取ztree数据并且渲染**/
    getzt(){
      var _this=this;
        _this.dialogVisible=true;
        setTimeout(()=>{
           this.$http.get('/dev/product/findAllProduct',(res)=>{
                    if(res.status===200){
                          var nodeList=[];
                          // { id:1, pId:0, name:"Pamir", open:true},
                          // { id:11, pId:1, name:"5.5.5", open:true},
                           var productslist=res.data.data.products;
                            for(var i=0;i<productslist.length;i++){
                                var obj={"id":productslist[i].productId,pId:0,"name":productslist[i].productName,open:true};
                                nodeList.push(obj);
                                if(productslist[i].projectList.length>0){
                                    var cplist=productslist[i].projectList;
                                    for(var j=0;j<cplist.length;j++){
                                        var obj={"id":cplist[j].projectId,pId:productslist[i].productId,"name":cplist[j].projectName,open:true};
                                        nodeList.push(obj);
                                    }
                                }
                            }
                        _this.nodeData=nodeList;
                        $.fn.zTree.init($("#ztreedemo"),_this.setting,_this.nodeData);
                    }else{
                        console.log(res) 
                    }
            })
         
        },100)
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
              }else{
                  console.log(res) 
              }
      })
      _this.dialogVisible = false;
  },
    render() {
      let container = document.getElementById("container");
      this.zr = zrender.init(container);
      this.w = this.zr.getWidth();
      this.h = this.zr.getHeight();
    },
    resetData() {
      this.groupH = rem(50);
      this.groupArr = [];
      this.dragBox = null;
      this.zr.clear();
      this.zr.resize();
      this.w = this.zr.getWidth();
      this.h = this.zr.getHeight();
      DEFAULT = {
        hInterval: rem(20), // 上下间隔
        width: rem(200),
        height: rem(70),
        verH: rem(80), //套装盒高度
        groupWidth: rem(200 * 3 + 260 * 2), //包装盒宽
        fontSize: rem(18),
        xInterval: rem(260),
        lineColor: "#cacaca",
        lineHoverColor: "red",
        mCirclefontSize: rem(15),
        mCirclefontColor: "",
        mCircleFillColor: "#F5F5F5"
      };
    },
    getData() {
      var aa = this.$http.get("/api/suit/findAllSuitInfo", res => {
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.list = res.data.data.suits;
            this.init(res.data.data.suits);
          } else {
          }
        } else {
          console.log(res);
        }
      });
    },
    init(data) {
      // this.titleGroup();
      this.groupPosition(data);
      this.dragTextBox();
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
      if (!data.length) return;
      //  包围盒子得高度
      let groupH = positionObj.H;
      // 水平间隔
      let xInterval = DEFAULT.xInterval;
      // line x轴
      let lineLX = DEFAULT.width;
      //项目盒子基准尺寸
      let rectLOpt = {
        width: DEFAULT.width,
        height: DEFAULT.height,
        r: rem(10)
      };
      // 包围盒总高度
      let group = new zrender.Group();
      if (data.length == 1) {
        let g = new zrender.Group();
        let rectEl = rect({
          shape: {
            x: 0,
            y: (groupH - DEFAULT.height) / 2,
            ...rectLOpt
          },
          style: {
            fill: tlData[0].bgColor,
            text: textFormat(data[0].projectName, 18, 38),
            textFill: tlData[0].color,
            fontSize: DEFAULT.fontSize
            // textLineHeight:DEFAULT.fontSize
          },
          projectId: data[0].projectId
        });
        let lineEl = line({
          shape: {
            x1: lineLX,
            y1: groupH / 2,
            x2: lineLX + xInterval,
            y2: groupH / 2
          },
          style: {
            fill: DEFAULT.lineColor,
            stroke: DEFAULT.lineColor
          }
        });
        g.add(rectEl);
        g.add(lineEl);
        let textGroup = this.createText(data[0]);
        textGroup.position = [
          -((DEFAULT.width * 2) / 3 + DEFAULT.height / 2),
          (groupH - DEFAULT.height) / 2
        ];
        g.add(textGroup);
        group.add(g);
      } else {
        data.forEach((t, i) => {
          let g = new zrender.Group();
          let rectEl = rect({
            shape: {
              x: 0,
              y: (DEFAULT.height + positionObj.L) * i,
              ...rectLOpt
            },
            style: {
              fill: tlData[0].bgColor,
              text: textFormat(t.projectName, 18, 38),
              textFill: tlData[0].color,
              fontSize: DEFAULT.fontSize
              // textLineHeight:30
            },
            projectId: t.projectId
          });
          let lineEl = line({
            shape: {
              x1: lineLX,
              y1: DEFAULT.height / 2 + (DEFAULT.height + positionObj.L) * i,
              x2: lineLX + xInterval,
              y2: groupH / 2
            },
            style: {
              fill: DEFAULT.lineColor,
              stroke: DEFAULT.lineColor
            }
          });
          g.add(rectEl);
          g.add(lineEl);
          let textGroup = this.createText(t);
          textGroup.position = [
            -((DEFAULT.width * 2) / 3 + DEFAULT.height / 2),
            (DEFAULT.height + positionObj.L) * i
          ];
          g.add(textGroup);

          group.add(g);
        });
      }

      return group;
    },
    cteateRectR(data, positionObj) {
      if (!data.length) return;
      //  包围盒子得高度
      let groupH = positionObj.H;
      // 水平间隔
      let xInterval = DEFAULT.xInterval;
      // line x轴
      let lineRX = DEFAULT.width * 2 + DEFAULT.xInterval;
      //项目盒子基准尺寸
      let rectLOpt = {
        width: DEFAULT.width,
        height: DEFAULT.height,
        r: rem(10)
      };
      // 包围盒总高度
      let group = new zrender.Group();
      if (data.length == 1) {
        let g = new zrender.Group();
        let rectEl = rect({
          shape: {
            x: DEFAULT.groupWidth - DEFAULT.width,
            y: (groupH - DEFAULT.height) / 2,
            ...rectLOpt
          },
          style: {
            fill: tlData[2].bgColor,
            text: textFormat(data[0].productName, 20, 40),
            textFill: tlData[2].color,
            fontSize: DEFAULT.fontSize
          },
          productId: data[0].productId
        });
        let lineEl = line({
          shape: {
            x1: lineRX,
            y1: groupH / 2,
            x2: lineRX + xInterval,
            y2: groupH / 2
          },
          style: {
            fill: DEFAULT.lineColor,
            stroke: DEFAULT.lineColor
          }
        });
        g.add(rectEl);
        g.add(lineEl);
        group.add(g);
      } else {
        data.forEach((t, i) => {
          let g = new zrender.Group();
          let rectEl = rect({
            shape: {
              x: DEFAULT.groupWidth - DEFAULT.width,
              y: (DEFAULT.height + positionObj.R) * i,
              ...rectLOpt
            },
            style: {
              fill: tlData[2].bgColor,
              text: textFormat(t.productName, 20, 40),
              textFill: tlData[2].color,
              fontSize: DEFAULT.fontSize
            },
            productId: t.productId
          });
          let lineEl = line({
            shape: {
              x1: lineRX,
              y1: groupH / 2,
              x2: lineRX + xInterval,
              y2: DEFAULT.height / 2 + (DEFAULT.height + positionObj.R) * i
            },
            style: {
              fill: DEFAULT.lineColor,
              stroke: DEFAULT.lineColor
            }
          });
          g.add(rectEl);
          g.add(lineEl);
          group.add(g);
        });
      }

      return group;
    },
    cteateRectM(data, positionObj) {
      let group = new zrender.Group();
      group.attr({
        shape: {
          width: DEFAULT.width,
          height: DEFAULT.verH
        },
        position: [
          (DEFAULT.groupWidth - DEFAULT.width) / 2,
          (positionObj.H - DEFAULT.verH) / 2
        ]
      });
      let ellipseEl = ellipse({
        shape: {
          cx: DEFAULT.width / 2,
          cy: DEFAULT.verH / 2,
          rx: DEFAULT.width / 2,
          ry: DEFAULT.verH / 2
        },
        style: {
          fill: tlData[1].bgColor,
          text: `${textFormat(data.suitName, 12, 24)}${
            data.suitDate ? "\n" + data.suitDate : ""
          }`,
          textFill: tlData[1].color,
          fontSize: DEFAULT.fontSize
        },
        name: "PM"
      });
      let circleElL = circle({
        shape: {
          cx: DEFAULT.width / 5 / 2,
          cy: DEFAULT.verH / 2,
          r: DEFAULT.width / 5 / 2
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
          cx: DEFAULT.width - DEFAULT.width / 5 / 2,
          cy: DEFAULT.verH / 2,
          r: DEFAULT.width / 5 / 2
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
      let base = {};
      //左右元素都小于2时 以中间的元素高度为盒子高度
      if (lenPjt < 2 && lenPdt < 2) {
        base.H = DEFAULT.verH; // 包围盒高度
        base.L = 0; // 左元素 高间距
        base.R = 0; // 右元素 高间距
      } else {
        //
        if (lenPjt === lenPdt) {
          base.H = DEFAULT.height * lenPjt + (lenPjt - 1) * DEFAULT.hInterval;
          base.L = base.R = DEFAULT.hInterval;
        } else if (lenPjt > lenPdt) {
          base.H = DEFAULT.height * lenPjt + (lenPjt - 1) * DEFAULT.hInterval;
          base.L = DEFAULT.hInterval;
          if (lenPdt < 2) {
            base.R = 0; //没有元素
          } else {
            base.R = (base.H - DEFAULT.height * lenPdt) / (lenPdt - 1);
          }
        } else if (lenPjt < lenPdt) {
          base.H = DEFAULT.height * lenPdt + (lenPdt - 1) * DEFAULT.hInterval;
          base.R = DEFAULT.hInterval;
          if (lenPjt < 2) {
            base.L = 0; //没有元素
          } else {
            base.L = (base.H - DEFAULT.height * lenPjt) / (lenPjt - 1);
          }
        }
      }
      return base;
    },
    //包围盒定位
    groupPosition(data) {
      let that = this;
      // 组得初始高度
      // let groupArr = [];
      let groupH = this.groupH;
      data.forEach((t, i) => {
        let project = t.projectList;
        let product = t.productList;
        let base = this.getBaseposition(t);
        let group = new zrender.Group();
        group.attr({
          shape: {
            width: DEFAULT.groupWidth,
            height: base.H
          },
          position: [(that.w - DEFAULT.groupWidth) / 2, groupH]
        });
        groupH += DEFAULT.hInterval + base.H;
        let shapeL = {
          data: project
        };
        let groupL = that.cteateRectL(project, base);
        let groupR = that.cteateRectR(product, base);
        let groupM = that.cteateRectM(t, base);
        // 遍历 各子节点元素 做业务处理
        groupM.eachChild((k, i) => {
          let flag = true;
          k.on("click", e =>{
            if (k.name == "PL") {
              if(groupL){
                   flag ? groupL.hide() : groupL.show();
                   flag = !flag;
              }
              this.showProject=false
            } else if (k.name == "PR") {
              if(groupR){
                flag ? groupR.hide() : groupR.show();
                flag = !flag;
                this.showProduct=false
              }

            } else if (k.name == "PM") {
              let position=[e.target.shape.rx,e.target.shape.ry]
              // 鼠标相对文档偏移
              let offset = [e.target.transform[4], e.target.transform[5]];
              //元素相对文档偏移
              let p = [offset[0], offset[1]];
              let poffset = [
                `${parseInt(p[0] + DEFAULT.width)}px`,
                `${parseInt(p[1] + DEFAULT.verH / 2)}px`
              ];
              if (!t.suitDescription) {
                return;
              }
              if (that.showSp) {
                if (that.offsetSp[1] === poffset[1]) {
                  that.showSp = false;
                } else {
                  that.deilSp.suitDescription = t.suitDescription;
                  that.offsetSp = poffset;
                }
              } else {
                that.deilSp.suitDescription = t.suitDescription;
                that.showSp = true;
                that.offsetSp = poffset;
              }
            }
          });
        });
        // 鼠标 添加 hover 事件
        let addHover = (el, styOpt, type, data) => {
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
          el.childAt(0).attr(rectOpt);
          el.childAt(1).attr(styOpt);
          groupM.childAt(0).attr(rectOpt);
          if (data) {
            data.forEach(t => {
              fn.eachChild(k => {
                if (t[ID] == k.childAt(0)[ID]) {
                  k.childAt(0).attr(rectOpt);
                  k.childAt(1).attr(styOpt);
                }
              });
            });
          } else {
            fn.eachChild(k => {
              k.childAt(0).attr(rectOpt);
              k.childAt(1).attr(styOpt);
            });
          }
        };
        if (groupL) {
          groupL.eachChild((k, i) => {
            let hoverL = false;
            k.childAt(0)
              .on("mouseover", e => {
                hoverL = true;
                this.getproRelation("L", e.target.projectId, res => {
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
              })
              .on("click", e => {
                let position = [e.target.shape.x, e.target.shape.y];
                // 鼠标相对文档偏移
                let offset = [e.target.transform[4], e.target.transform[5]];
                //元素相对文档偏移
                let p = [position[0] + offset[0], position[1] + offset[1]];
                let poffset = [
                  `${parseInt(p[0] + DEFAULT.width)}px`,
                  `${parseInt(p[1] + DEFAULT.height / 2)}px`
                ];
                if (this.showProject) {
                  if (this.offsetProject[1] === poffset[1]) {
                    this.showProject = false;
                  } else {
                    this.deilProject = project[i];
                    this.offsetProject = poffset;
                  }
                } else {
                  this.deilProject = project[i];
                  this.showProject = true;
                  this.offsetProject = poffset;
                }
              });
          });
           group.add(groupL);
        }
        if (groupR) {
          groupR.eachChild((k, i) => {
            let hoverR = false;
            k.childAt(0)
              .on("mouseover", e => {
                hoverR = true;
                // that.$slloading.show()
                this.getproRelation("R", e.target.productId, res => {
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
              })
              .on("click", e => {
                let position = [e.target.shape.x, e.target.shape.y];
                // 鼠标相对文档偏移
                let offset = [e.target.transform[4], e.target.transform[5]];
                //元素相对文档偏移
                let p = [position[0] + offset[0], position[1] + offset[1]];
                let poffset = [
                  `${parseInt(p[0] + DEFAULT.width)}px`,
                  `${parseInt(p[1] + DEFAULT.height / 2)}px`
                ];
                if (!product[i].remark || product[i].remark.length === 0) {
                  return;
                }
                if (this.showProduct) {
                  if (this.offsetProduct[1] === poffset[1]) {
                    this.showProduct = false;
                  } else {
                    this.deilProduct = product[i].remark;
                    this.offsetProduct = poffset;
                  }
                } else {
                  this.deilProduct = product[i].remark;
                  this.showProduct = true;
                  this.offsetProduct = poffset;
                }
              });
          });
          group.add(groupR);
        }
        group.add(groupM);
        // 保存下次渲染的初始高度
        this.groupH = groupH;
        // groupArr.push(group);
        this.zr.add(group);
        this.zr.resize({
          height: groupH
        });
        // this.zr.refreshImmediately()
      });

      // this.groupArr = groupArr;
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
    //项目优先级盒子
    createDragBox(opt) {
      opt = [
        {
          type: "高"
        },
        {
          type: "中"
        },
        {
          type: "低"
        }
      ];

      let group = new zrender.Group();
      let boxRect = rect({
        shape: {
          width: (DEFAULT.width * 2) / 3,
          height: DEFAULT.height,
          x: 0,
          y: 0
        },
        style: {
          fill: "#fff",
          stroke: "red"
        }
      });
      group.add(boxRect);
      // opt.forEach((t,i)=>{
      //   let box=rect({
      //     shape:{

      //     },
      //     style:{

      //     }
      //   })
      // })

      return group;
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
          ? "/api/suit/findProductListByProjectId"
          : "/api/suit/findProjectListByProductId";

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
  /* width: 100%;
  height: 100%; */
  /* position: absolute */
}

/***addvepal csy add***/
.addvepal-layer{
    font-family:微软雅黑;
    font-size: 0.16rem;
}

.addvepal-layer ul li{
    line-height: 0.5rem;
    margin-top:0.1rem;
    height: auto;
    width: 9rem;
}
.addvepal-layer ul li label{
    float: left;
    width:1.2rem;
    text-align: right;
}
.elinput{
    width:7rem;
}
 .addvepal-layer ul li textarea{
    height: 0.8rem;
    width:6.8rem;
    resize: none;
    padding:0.1rem;
    border:1px solid #dcdfe6;
 }
 .producttree{
     width:7.2rem;
     height: 4rem;
     border:1px solid #dcdfe6;
     float: left;
     overflow-y:auto;
     overflow-x: hidden;
 }
 .addbtn{
     background: rgba(74, 163, 222, 1);
     width:1rem;
     text-align: center;
     height: 0.3rem;
     line-height: 0.3rem;
     display: block;
     color:#fff;
     margin-left:2.5rem;
 }
 .suitDate{
     width:7rem;
 }
 .elbutton{
   background: #409EFF;
   color:#fff;
   padding:0.1rem;
   margin:0.1rem;
 }
 /***addvepal end***/
</style>
