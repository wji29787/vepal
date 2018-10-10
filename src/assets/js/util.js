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
let circle = (opt) =>{
  return new zrender.Circle(opt)
}
let rem = (size) => {
  let baseSize = parseInt(document.querySelector('html').style.fontSize)
  // if(baseSize <= 50){
  //   baseSize = 50
  // }
  return Math.round(baseSize / 100 * size)
}
export {
  rect,
  rem,
  line,
  ellipse,
  circle
}
