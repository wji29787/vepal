<template>
  <div class="dinner" id="container">
    {{msg}}
  </div>
</template>

<script>
import zrender from "zrender";
import { rect, rem, line, ellipse } from "../assets/js/util.js";
let DEFAULT = {
  hInterval: rem(20), // 上下间隔
  width: rem(150),
  height: rem(50),
  verH: rem(60) //套装盒高度
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
    bgColor: "rgba(131, 220, 220, 1"
  }
];
export default {
  name: "Dinner",
  data() {
    return {
      msg: "dinner",
      zr: "",
      w: 0,
      h: 0,
      groupH: rem(50), //元素组起始位置
      groupArr: []
    };
  },
  created() {},
  mounted() {
    this.render();
    let that = this;
    let timer = null;
    window.addEventListener("resize", function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        that.groupH=rem(50)
        that.zr.clear();
        that.zr.resize();
        that.w = that.zr.getWidth();
        that.h = that.zr.getHeight();
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
    getData() {},
    init() {
      this.titleGroup();
      this.cteateRect(null,{H:210,L:20});
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
      this.groupH += rectGroup.height +hInterval;
      group.position = position;
      this.zr.add(group);
    },
    cteateRect(data, positionObj) {
      // 标题包围盒
      var data = {
        project: [{ id: 1 }, { id: 2 }, { id: 3 }], // 产品版本
        product: [{ id: 1 }, { id: 2 }, { id: 3 }], // 项目
        id: 12
      };
      //  包围盒子得高度
      let groupH = positionObj.H;
      // 水平间隔
      let winterval = rem(260);
      // 上下间隔
      // 连线左间隔
      let lineLX = rem(150);

      let lineRx = rem(150) + rem(260) + rem(150);
      // 文字size
      let fontSize = rem(20);
      // let hInterval = rem(20)
      //项目盒子基准尺寸
      let rectLOpt = {
        width: rem(150),
        height: rem(50),
        r: rem(10)
      };
      // 套餐盒子基准尺寸
      let ellipseOpt = {
        cx: rem(150) + rem(260) + rem(150) / 2,
        cy: groupH / 2,
        rx: rem(75),
        ry: DEFAULT.verH / 2
      };
      //版本盒子基准尺寸
      let rectROpt = {
        width: rem(150),
        height: rem(50),
        r: rem(10),
        x: 0,
        y: 0
      };
      // 连线基准尺寸
      // let lineOptStyle = {
      //   fill
      // };
      let lineStyle = "#cacaca";
      // 包围盒总高度
      let group = new zrender.Group();
      if (data.project) {
        if (data.project.length == 1) {
          let rectEl = rect({
            shape: {
              x: 0,
              y: (groupH - DEFAULT.height) / 2,
              ...rectLOpt
            },
            style: {
              fill: tlData[0].bgColor,
              text: tlData[0].name,
              textFill: "#fff",
              fontSize: fontSize
            }
          });
          let lineEl = line({
            shape: {
              x1: lineLX,
              y1: groupH / 2,
              x2: lineLX + winterval,
              y2: groupH / 2
            },
            style: {
              fill: lineStyle
            }
          });
          group.add(rectEl);
          group.add(lineEl);
        } else {
          data.project.forEach((t, i) => {
            let rectEl = rect({
              shape: {
                x: 0,
                y: (DEFAULT.height+ positionObj.L)*i,
                ...rectLOpt
              },
              style: {
                fill: tlData[0].bgColor,
                text: tlData[0].name,
                textFill: "#fff",
                fontSize: fontSize
              }
            });
            let lineEl = line({
              shape: {
                x1: lineLX,
                y1: DEFAULT.height/2 +(DEFAULT.height+positionObj.L)*i ,
                x2: lineLX + winterval,
                y2: groupH / 2
              },
              style: {
                fill: lineStyle
              }
            });
            group.add(rectEl);
            group.add(lineEl);
          });
        }
      }
      let ellipseEl = ellipse({
        shape: {
          ...ellipseOpt
        },
        style: {
          fill: tlData[1].bgColor,
          text: tlData[1].name,
          textFill: "#fff",
          fontSize: fontSize
        }
      });
      group.add(ellipseEl);

      var rectGroup = group.getBoundingRect();
      let position = [(this.w - rectGroup.width) / 2, this.groupH];
      // 包围盒距离顶部得高度
      this.groupH += rectGroup.height+DEFAULT.hInterval;
      group.position = position;
      this.zr.add(group);
    },
    //包围盒定位
    groupPosition(data) {
      let groupH = [];
      data.forEach((t, i) => {
        let base = {};

        let lenPjt = t.project.length; // 左边
        let lenPdt = t.product.length; // 右边
        if (lenPjt <= 2 && lenPdt <= 2) {
          base.H = DEFAULT.verH; // 包围盒高度
          base.L = 0; // 左元素 高间距
          base.R = 0; // 右元素 高间距
        } else {
          if (lenPjt === lenPdt) {
            base.H = DEFAULT.height * lenPjt + (lenPjt - 1) * DEFAULT.hInterval;
            base.L = base.R = (base.H - DEFAULT.height * lenPdt) / (lenPdt - 1);
          } else if (lenPjt > lenPdt) {
            base.H = DEFAULT.height * lenPjt + (lenPjt - 1) * DEFAULT.hInterval;
            base.L = DEFAULT.hInterval;
            if (lenPdt < 2) {
              base.R = 0; //没有元素
            } else {
              base.R = (base.H - DEFAULT.height * lenPdt) / (lenPdt - 1);
            }
          } else {
            base.H = DEFAULT.height * lenPdt + (lenPdt - 1) * DEFAULT.hInterval;
            base.R = DEFAULT.hInterval;
            if (lenPjt < 2) {
              base.L = 0; //没有元素
            } else {
              base.L = (base.H - DEFAULT.height * lenPjt) / (lenPjt - 1);
            }
          }
        }
        groupH.push(base);
      });
      this.groupArr = groupH;
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
