import zrender from 'zrender'
import {
  textFormat,
  arrSort,
} from './vepalUtil'
import {
  rem,
  setScaleStyle,
  styleConf,
  transitionStyle
} from "./vepalconf.js";
let rect = (opt) => {
  return new zrender.Rect(opt)
}
let line = (opt) => {
  return new zrender.Line(opt)
}
let ellipse = (opt) => {
  return new zrender.Ellipse(opt)
}
let circle = (opt) => {
  return new zrender.Circle(opt)
}
let arc = opt => {
  return new zrender.Arc(opt)
}
let text = opt => {
  return new zrender.Text(opt)
}

let image = opt => {
  return new zrender.Image(opt)
}
let DEFAULT = styleConf()
let Vepal = function Vepal(container, options) {
  this.container = container;
  this.options = options;
  this.zr = zrender.init(container, options);
  this.util = zrender.util
  this.w = this.zr.getWidth();
  this.h = this.zr.getHeight();
//   this.resetObj = Object.assign({}, DEFAULT);
//   this.DEFAULT = Object.assign({}, DEFAULT);
  this.DEFAULT = this.util.clone(DEFAULT);
  this.group = [];
  this.groupH = this.DEFAULT.groupH;
  this.data =null;
  this.customStyle =null;
  this.setScaleStyle()
  
}
Vepal.prototype = {
  constructor: Vepal,
  resetData() {
    this.zr.clear();
    this.zr.resize();
    this.setScaleStyle()
    this.groupH = this.DEFAULT.groupH;
    this.group = []
    this.w = this.zr.getWidth();
    this.h = this.zr.getHeight();
    this.groupPosition(this.data)
  },
  setScaleStyle(){
    this.customStyle = setScaleStyle(this.DEFAULT,rem())
  },

  mergeStyle(style){
      this.DEFAULT = this.util.merge(this.DEFAULT,style,true);
  },
  reset(){
    this.DEFAULT = this.util.clone(DEFAULT);
    this.resetData();
  },
  setStyle(style){
    this.mergeStyle(style)
    this.resetData()
  },
  init(data){
      this.data =data;
      this.resetData()
      
    //   this.groupPosition(data)
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
          elmp: (elH - conf.project.imageH) / 2 + (elH + positionObj.L) * cutLen
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
          elmp: (elH - conf.product.imageH) / 2 + (elH + positionObj.R) * cutLen
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
      a: opt.typeName || '',
      b: opt.priorityName || '',
      c: opt.statusName || ''
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
    let option = [{
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
          .on("mouseover", function (e) {
            color = e.target.style.stroke;
            e.target.attr({
              style: {
                stroke: "gold"
              }
            });
          })
          .on("mouseout", function (e) {
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

    // 创建圆弧
    let deg = c => (c * Math.PI) / 180;
    let r = conf.project / 4;
    let arcOpt = [{
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
      let Arc = arc({ ...t
      });
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
        return function (a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
        };
      }
      let arr = [{
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
    // let computedH = (Dhl, Dh, len) => {
    //   return Dh * len + (len - 1) * Dhl;
    // };
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
  // create group
  createGroup(data,base, conf) {
    //   console.log(data)
    let project = data.projectList;
    let product = data.productList;
    let group = new zrender.Group();
    let groupL = this.cteateRectL(project, base, conf);
    let groupR = this.cteateRectR(product, base, conf);
    let groupM = this.cteateRectM(data, base, conf);
    group.add(groupL);
    group.add(groupR);
    group.add(groupM);


    return group
  },
  //包围盒定位
  groupPosition(data) {
    let customStyle = this.customStyle  
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
    let groupH = this.groupH
    data.forEach((t, i) => {
        let base = this.getBaseposition(t, customStyle);
        let group = this.createGroup(t,base, customStyle)
    //   console.log(group)
      group.attr({
        shape: {
          width: groupWidth,
          height: base.H
        },
        position: [this.w / 2 - (projectW + lineW + suitW / 2), groupH]
      });
      // 保存下次渲染的初始高度
      groupH += hInterval + base.H;
      this.group.push(group)
      this.zr.add(group);
      this.zr.resize({
        height: groupH
      });

    //   console.log(group) 
      group.on('click',(e) =>{
            console.log(e)
      })       

    });
    this.groupH = groupH  
  },
}

export default Vepal;