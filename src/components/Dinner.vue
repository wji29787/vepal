<template>
  <div class="dinner" id="container">
  </div>
</template>

<script>
import zrender from "zrender";
import { rect, rem, line, ellipse, circle } from "../assets/js/util.js";
let DEFAULT = {
  hInterval: rem(20), // 上下间隔
  width: rem(150),
  height: rem(50),
  verH: rem(60), //套装盒高度
  groupWidth: rem(150 * 3 + 260 * 2), //包装盒宽
  fontSize: rem(20),
  xInterval: rem(260),
  lineColor: "#cacaca"
};
let tlData = [
  {
    name: "项目名称",
    bgColor: "rgba(0, 204, 102, 1)"
  },
  {
    name: "套装",
    bgColor: "rgba(153, 0, 204, 1)"
  },
  {
    name: "相关版本",
    bgColor: "rgba(131, 220, 220, 1)"
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
      groupArr: []
    };
  },
  created() {},
  mounted() {
    this.getData()
    this.render();
    let that = this;
    let timer = null;
    window.addEventListener("resize", function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        that.groupH = rem(50);
        that.groupArr = [];
        that.zr.clear();
        that.zr.resize();
        that.w = that.zr.getWidth();
        that.h = that.zr.getHeight();
        // DEFAULT =DEFAULT
        DEFAULT = {
          hInterval: rem(20), // 上下间隔
          width: rem(150),
          height: rem(50),
          verH: rem(60), //套装盒高度
          groupWidth: rem(150 * 3 + 260 * 2), //包装盒宽
          fontSize: rem(20),
          xInterval: rem(260),
          lineColor: "#cacaca"
        };
        that.init();
      }, 300);
    });
  },
  methods: {
    render() {
      let container = document.getElementById("container");
      this.zr = zrender.init(container);
      this.w = this.zr.getWidth();
      this.h = this.zr.getHeight();
      this.init();
    },
    getData() {
      console.log(this.$http)
      // this.$http({
      //   method:'post',
      //   url:'api/report/findSuitAndProject'
      //   // headers:{
      //   //   'Content-Type':'application/json;charset=UTF-8',
      //   //   'Accept':'application/json;charset=UTF-8',
      //   //   // 'Access-Control-Allow-Origin':'*'
      //   // }
      // }).then((res)=>{
      //   console.log(res)
      // })
      // .catch((err)=>{
      //   console.log(err)
      // })
      this.$http.get('report/findSuitAndProject').then((res)=>{
        console.log(res)
      })
       .catch((err)=>{
        console.log(err)
      })
    },
    init() {
      this.titleGroup();
      // this.cteateRect(null, { H: 210, L: 20 });
      let data = [
        {
          project: [{ name: "项目1sdfsfdfsdfsdfsdfsdfs" }, { name: "项目211" }],
          product: [{ name: "版本1" }, { name: "版本2" }],
          name: "套餐1"
        }
        // {
        //   project: [{ name: "项目1" }, { name: "项目2" }, { name: "项目3" }],
        //   product: [
        //     { name: "版本1" },
        //     { name: "版本2" },
        //     { name: "版本3" },
        //     { name: "版本4" },
        //     { name: "版本5" }
        //   ],
        //   name: "套餐2"
        // }
      ];
      this.groupPosition(data);
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
      let lineLX = rem(150);
      //项目盒子基准尺寸
      let rectLOpt = {
        width: rem(150),
        height: rem(50),
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
            text: data[0].name,
            textFill: "#fff",
            fontSize: DEFAULT.fontSize,
            truncate:{
              ellipsis :'...'
            },
            textAlign:'left'
          }
        });
        let lineEl = line({
          shape: {
            x1: lineLX,
            y1: groupH / 2,
            x2: lineLX + xInterval,
            y2: groupH / 2
          },
          style: {
            fill: DEFAULT.lineColor
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
              x: 0,
              y: (DEFAULT.height + positionObj.L) * i,
              ...rectLOpt
            },
            style: {
              fill: tlData[0].bgColor,
              text: t.name,
              textFill: "red",
              fontSize: DEFAULT.fontSize,
              // truncate:{
              //  ellipsis :'...'
              // },
              // textPosition:,
              // textRect:{
              //   x:0,
              //   y:0,
              //   width:rem(30),
              //   height:rem(120)
              // }
              // textAlign:'left'
            }
          });
          let lineEl = line({
            shape: {
              x1: lineLX,
              y1: DEFAULT.height / 2 + (DEFAULT.height + positionObj.L) * i,
              x2: lineLX + xInterval,
              y2: groupH / 2
            },
            style: {
              fill: DEFAULT.lineColor
            }
          });
          g.add(rectEl);
          g.add(lineEl);
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
      let lineRX = rem(150) * 2 + DEFAULT.xInterval;
      //项目盒子基准尺寸
      let rectLOpt = {
        width: rem(150),
        height: rem(50),
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
            text: data[0].name,
            textFill: "#fff",
            fontSize: DEFAULT.fontSize
          }
        });
        let lineEl = line({
          shape: {
            x1: lineRX,
            y1: groupH / 2,
            x2: lineRX + xInterval,
            y2: groupH / 2
          },
          style: {
            fill: DEFAULT.lineColor
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
              text: t.name,
              textFill: "#fff",
              fontSize: DEFAULT.fontSize
            }
          });
          let lineEl = line({
            shape: {
              x1: lineRX,
              y1: groupH / 2,
              x2: lineRX + xInterval,
              y2: DEFAULT.height / 2 + (DEFAULT.height + positionObj.R) * i
            },
            style: {
              fill: DEFAULT.lineColor
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
          text: data.name,
          textFill: "#fff",
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
          fill: "#fff",
          text: "项目",
          fontSize: rem(10)
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
          fill: "#fff",
          text: "版本",
          fontSize: rem(10)
        },
        name: "PR"
      });
      group.add(ellipseEl);
      group.add(circleElL);
      group.add(circleElR);
      return group;
    },
    //包围盒定位
    groupPosition(data) {
      let that = this;
      // 组得初始高度
      let groupArr = [];
      let groupH = this.groupH;
      data.forEach((t, i) => {
        let base = {};
        let project = t.project;
        let product = t.product;
        let lenPjt = project.length; // 左边
        let lenPdt = product.length; // 右边
        if (lenPjt < 2 && lenPdt < 2) {
          base.H = DEFAULT.verH; // 包围盒高度
          base.L = 0; // 左元素 高间距
          base.R = 0; // 右元素 高间距
        } else {
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
        let group = new zrender.Group();
        group.attr({
          shape: {
            width: DEFAULT.groupWidth,
            height: base.H
          },
          position: [(that.w - DEFAULT.groupWidth) / 2, groupH]
        });
        groupH += DEFAULT.hInterval + base.H;
        let groupL = that.cteateRectL(project, base);
        let groupR = that.cteateRectR(product, base);
        let groupM = that.cteateRectM(t, base);
        groupM.eachChild((t, i) => {
          let flag = true;
          t.on("click", function(e) {
            if (t.name == "PL") {
              if (flag) {
                groupL.hide();
              } else {
                groupL.show();
              }
              flag = !flag;
            } else if (t.name == "PR") {
              if (flag) {
                groupR.hide();
              } else {
                groupR.show();
              }
              flag = !flag;
            }
          });
        });
        groupL.eachChild(t => {
          t.childAt(0)
            .on("mouseover", () => {
              let style ={
                 stroke: "red"
              }
              t.childAt(0).attr({style})
              t.childAt(1).attr({style})
              groupM.childAt(0).attr({style})
              groupR.eachChild((k)=>{
                  k.childAt(0).attr({style})
                  k.childAt(1).attr({style})
              })

            })
            .on("mouseout", () => {
              let style ={
                 stroke: DEFAULT.lineColor
              }
              t.childAt(0).attr({style})
              t.childAt(1).attr({style})
              groupM.childAt(0).attr({style})
               groupR.eachChild((k)=>{
                  k.childAt(0).attr({style})
                  k.childAt(1).attr({style})
              })
            })
        })
        groupR.eachChild(t => {
          t.childAt(0)
            .on("mouseover", () => {
              let style ={
                 stroke: "red"
              }
              t.childAt(0).attr({style})
              t.childAt(1).attr({style})
              groupM.childAt(0).attr({style})
              groupL.eachChild((k)=>{
                  k.childAt(0).attr({style})
                  k.childAt(1).attr({style})
              })

            })
            .on("mouseout", () => {
              let style ={
                 stroke: DEFAULT.lineColor
              }
              t.childAt(0).attr({style})
              t.childAt(1).attr({style})
              groupM.childAt(0).attr({style})
               groupL.eachChild((k)=>{
                  k.childAt(0).attr({style})
                  k.childAt(1).attr({style})
              })
            })
        })
        group.add(groupL);
        group.add(groupR);
        group.add(groupM);
        groupArr.push(group);
        that.zr.add(group);
      });
      this.groupArr = groupArr;
    },
    // 文字样式

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dinner {
  width: 100%;
  height: 100%;
}
</style>
