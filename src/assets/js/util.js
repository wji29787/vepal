import zrender from 'zrender'
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
let rem = (size) => {
  let baseSize = parseInt(document.querySelector('html').style.fontSize)
  // if(baseSize <= 50){
  //   baseSize = 50
  // }
  return Math.round(baseSize / 100 * size)
}
let getTextLen = str => {
  return str.replace(/[\u0391-\uFFE5]/g, 'aa').length
}
let textFromat = (str, num) => {
  if (!str) return
  if (!num) num = 10
  // let len = getTextLen(str)
  let reg = /[\u0391-\uFFE5]/g
  let sun = 0
  let arr = []
  for (let i = 0; i < str.length; i++) {

    if (reg.test(str[i])) {
      sun += 2
    } else {
      sun += 1
    }
    if (sun === num) {
      arr.push(i)
      sun = 0
    }
  }
  for(let i = 0; i < arr.length; i++){
    
  }
}
export {
  rect,
  rem,
  line,
  ellipse,
  circle,
  textFromat,
  getTextLen
}
