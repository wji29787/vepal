let rem =  () => {
  let baseSize = parseInt(document.querySelector('html').style.fontSize)
  if (baseSize <= 50) {
    baseSize = 50
  }
  return baseSize / 100 
}
let styleConf = scale => ({
  hInterval: scale * 20, // 上下间隔
  groupH:scale * 50, // 初始高度
  bgColor: '#fff', //滑版背景色
  project: {
    name: "项目名称",
    bgColor: "rgba(74, 163, 222, 1)", // 背景色
    color: "#fff", // 文字颜色
    width: scale * 200, // 元素宽
    height: scale * 70, // 元素高
    rr: scale * 10, // 圆角半径
    fontSize: scale * 18, // 文字大小
    imageW: scale * 30,
    imageH: scale * 30,
    
  },
  product: {
    name: "相关版本",
    bgColor: "rgba(131, 220, 220, 1)",
    color: "#fff",
    width: scale * 200,
    height:  scale * 70,
    rr: scale * 10,
    fontSize: scale * 18,
    imageW: scale * 30,
    imageH: scale * 30
  },
  suit: {
    name: "套装",
    bgColor: "rgba(119, 141, 252, 1)",
    color: "#fff",
    height: scale * 80,
    width: scale * 200,
    fontSize: scale * 18,
    mCirclefontSize: scale * 15,
    mCirclefontColor: "",
    mCircleFillColor: "#F5F5F5",
  },
  line: {
    width: scale * 260,
    color: "#cacaca",
    lightcolor: 'red',
  },
})


export {styleConf,rem}
