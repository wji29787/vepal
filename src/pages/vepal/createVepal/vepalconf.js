let rem = () => {
  let baseSize = parseInt(document.querySelector('html').style.fontSize)
  if (baseSize <= 50) {
    baseSize = 50
  }
  return baseSize / 100
}

// 默认配置样式
let DEFAUlT = {

  hInterval: 20, // 上下间隔
  groupH: 50, // 初始高度
  bgColor: '#fff', //滑版背景色
  project: {
    name: "项目名称",
    bgColor: "rgba(74, 163, 222, 1)", // 背景色
    color: "#fff", // 文字颜色
    width: 200, // 元素宽
    height: 70, // 元素高
    rr: 10, // 圆角半径
    fontSize: 18, // 文字大小
    imageW: 30,
    imageH: 30,
    textOffset: [10, 0]

  },
  product: {
    name: "相关版本",
    bgColor: "rgba(131, 220, 220, 1)",
    color: "#fff",
    width: 200,
    height: 70,
    rr: 10,
    fontSize: 18,
    imageW: 30,
    imageH: 30
  },
  suit: {
    name: "套装",
    bgColor: "rgba(119, 141, 252, 1)",
    color: "#fff",
    height: 80,
    width: 200,
    fontSize: 18,
    mCirclefontSize: 15,
    mCirclefontColor: "",
    mCircleFillColor: "#F5F5F5",
  },
  line: {
    width: 260,
    color: "#cacaca",
    lightcolor: 'red',
  },
}
let styleConf = scale => {
  return DEFAUlT
}
// 样式属性map
let attrList = ["project", "product", "suit", "line"];
let styleMap = {
  'project': {
    width: "projectwidth",
    height: "projectheight",
    bgColor: "projectbackcolor",
    id: "projectstyleid"
  },
  'product': {
    width: "productwidth",
    height: "productheight",
    bgColor: "productbackcolor",
    id: "productstyleid"
  },
  'suit': {
    width: "suitwidth",
    height: "suitheight",
    bgColor: "suitbackcolor",
    id: "suitstyleid"
  },
  'line': {
    id: "linestyleid",
    lightcolor: "linecolor"
  }
};
// 样式数据属性转换
/**
 * 
 * @param {objrct} data 
 * @param {syting} type  save 
 * 第二个参数存在时 取反属性
 */
let transitionStyle = function transitionStyle(data, type) {

  let obj = {}
  attrList.forEach(t => {
    let a = data[t]
    let styleType = styleMap[t]
    let styleObj = {}
    Object.keys(styleType).forEach(k => {
      let value = styleType[k]
      if (type) {
        styleObj[value] = a[k] || ''
      } else {

        styleObj[k] = a[value] || ''
      }

    })
    obj[t] = styleObj

  });
  return obj
}
// 计算 缩放比
function setScaleStyle(obj, scale) {

  if (null == obj || "object" != typeof obj) return obj;

  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (obj instanceof Array | obj instanceof Object) {
    var copy = (obj instanceof Array) ? [] : {}
    for (let k in obj) {

      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        copy[k] = setScaleStyle(obj[k], scale)
        if (/^\d/.test(copy[k]) && !Array.isArray(copy[k]))
          copy[k] = Number(copy[k]) * scale
      }
    }
    return copy
  }
}

export {
  styleConf,
  rem,
  transitionStyle,
  setScaleStyle
}
