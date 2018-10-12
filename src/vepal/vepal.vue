<template>
  <div class="dinner" id="container">
  </div>
</template>

<script>
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
      groupArr: [],
      list: [],
      dragBox: null // 显示框元素
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    // this.getData();
    this.render();
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
    render() {
      let container = document.getElementById("container");
      this.zr = zrender.init(container);
      this.w = this.zr.getWidth();
      this.h = this.zr.getHeight();
      this.list = [
        {
          projectList: [{ projectName: "aaa" }],
          productList: [{ productName: "adadadas" }],
          suitName: "sdfsdfsdfsd"
        }
      ];
      this.$nextTick(() => {
        this.init(this.list);
      });
    },
    resetData() {
      this.groupH = rem(50);
      this.groupArr = [];
      this.dragBox = null;
      this.zr.clear();
      this.zr.resize();
      this.w = that.zr.getWidth();
      this.h = that.zr.getHeight();
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
    },
    getData() {
      this.$http
        .post("/api/suit/findAllSuitInfo")
        .then(res => {
          if (res.data.code === 200) {
            this.list = res.data.data.suits;
            // this.render();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    init(data) {
      this.titleGroup();
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
      let lineLX = rem(150);
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
            text: textFormat(data[0].projectName, 12, 24),
            textFill: "red",
            fontSize: DEFAULT.fontSize
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
              text: textFormat(t.projectName, 12, 24),
              textFill: "red",
              fontSize: DEFAULT.fontSize
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
      let lineRX = rem(150) * 2 + DEFAULT.xInterval;
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
            text: textFormat(data[0].productName, 12, 24),
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
              text: textFormat(t.productName, 12, 24),
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
          text: textFormat(data.suitName, 8, 16),
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
        let project = t.projectList;
        let product = t.productList;
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
        let shapeL = {
          data: project
        };
        let groupL = that.cteateRectL(project, base);
        let groupR = that.cteateRectR(product, base);
        let groupM = that.cteateRectM(t, base);
        //点击事件判断是否是同一个
        let flagDrag = false,
          sameEL = null;
        groupM.eachChild((t, i) => {
          let flag = true;
          t.on("click", function(e) {
            if (t.name == "PL") {
              flag ? groupL.hide() : groupL.show();
              flag = !flag;
            } else if (t.name == "PR") {
              flag ? groupR.hide() : groupR.show();
              flag = !flag;
            } else if (t.name == "PM") {
                if(!flagDrag){
                    that.dragBox.show()
                         that.dragBox.attr({
                  position: [e.offsetX + DEFAULT.width / 2, e.offsetY]
                });
                    flagDrag=true
                }else{
                    that.dragBox.hide()
                    flagDrag=false
                }
              
            }
          });
        });
        let addHoverL = (el, styOpt) => {
          el.childAt(0).attr(styOpt);
          el.childAt(1).attr(styOpt);
          groupM.childAt(0).attr(styOpt);
          groupR.eachChild(k => {
            k.childAt(0).attr(styOpt);
            k.childAt(1).attr(styOpt);
          });
        };
        groupL.eachChild(t => {
          //   let flag = true;
          t.childAt(0)
            .on("mouseover", () => {
              addHoverL(t, { style: { stroke: "red" } });
            })
            .on("mouseout", () => {
              addHoverL(t, { style: { stroke: DEFAULT.lineColor } });
            })
            .on("click", e => {
             if(!flagDrag){
                    that.dragBox.show()
                         that.dragBox.attr({
                  position: [e.offsetX + DEFAULT.width / 2, e.offsetY]
                });
                    flagDrag=true
                }else{
                    that.dragBox.hide()
                    flagDrag=false
                }
            });
        });
        let addHoverR = (el, styOpt) => {
          el.childAt(0).attr(styOpt);
          el.childAt(1).attr(styOpt);
          groupM.childAt(0).attr(styOpt);
          groupL.eachChild(k => {
            k.childAt(0).attr(styOpt);
            k.childAt(1).attr(styOpt);
          });
        };
        groupR.eachChild(t => {
          t.childAt(0)
            .on("mouseover", () => {
              addHoverR(t, { style: { stroke: "red" } });
            })
            .on("mouseout", () => {
              addHoverR(t, { style: { stroke: DEFAULT.lineColor } });
            })
            .on("click", e => {
            if(!flagDrag){
                    that.dragBox.show()
                         that.dragBox.attr({
                  position: [e.offsetX + DEFAULT.width / 2, e.offsetY]
                });
                    flagDrag=true
                }else{
                    that.dragBox.hide()
                    flagDrag=false
                }
            });
        });
        group.add(groupL);
        group.add(groupR);
        group.add(groupM);
        groupArr.push(group);
        that.zr.add(group);
      });
      this.groupArr = groupArr;
    },
    //文字 +圆弧
    createText(opt) {
      opt = {
        a: "mvp",
        b: "高",
        c: "未结项"
      };
      // 创建 文字
      let h = DEFAULT.height;
      let textStyle = {
        textAlign: "left",
        text: "aaaa",
        textVerticalAlign: "middle",
        fontSize: rem(15),
        fontFamily: "Lato",
        textFill: "#999",
        blend: "lighten"
      };
      let option = [
        {
          text: `类型:   ${opt.a}`,
          position: [0, 0]
        },
        {
          text: `优先级: ${opt.b}`,
          position: [0, h / 3 + rem(3)]
        },
        {
          text: `状态:  ${opt.c}`,
          position: [0, h - h / 3 + rem(5)]
        }
      ];
      let textGroup = new zrender.Group();
      option.forEach((t, i) => {
        let ctext = text({
          style: {
            ...textStyle,
            text: t.text
          },
          position: t.position
        });
        if (i == 1) {
          let color;
          ctext
            .on("mouseover", function(e) {
              console.log(e);
              color = e.target.style.textFill;
              e.target.attr({
                style: {
                  textFill: "red"
                }
              });
            })
            .on("mouseout", function(e) {
              e.target.attr({
                style: {
                  textFill: color
                }
              });
            });
        }
        textGroup.add(ctext);
      });
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
        position: [0, rem(4)]
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
    // 详情弹框
    dragTextBox(opt) {
      if (this.dragBox) {
        return this.dragBox;
      } else {
        this.dragBox = rect({
          shape: {
            width: 200,
            height: 200,
            r: 10
          },
          style: {
            stroke: "red",
            text: "hahahah",
            // fill: "#fff",
            opacity: 0.7
          },
          z: 0,
          position: [0, 0]
        });
        this.dragBox.hide();
        this.zr.add(this.dragBox);
        return this.dragBox;
      }
    }
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
