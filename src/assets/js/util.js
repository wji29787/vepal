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
let arc = opt => {
  return new zrender.Arc(opt)
}
let text = opt => {
  return new zrender.Text(opt)
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
// function cutstr(str, len) {
//   var charlength = 0
//   for (var i = 0; i < str.length; i++) {
//     var sonstr = str.charAt(i)
//     encodeURI(sonstr).length > 2 ? charlength += 1 : charlength += 0.5
//     if (charlength >= len) {
//       var sublen = charlength === len ? i + 1 : i
//       return str.substr(0, sublen)
//       break;
//     }
//   }
// }
/*
 * param str 要截取的字符串
 * param L 要截取的字节长度，注意是字节不是字符，一个汉字两个字节
 * return 截取后的字符串
 */
function textFormat(str, L, L1) {
  let arr = []
  if (L1) {
    let strlen = str.length // 字符串长度
    let chrlen = str.replace(/[^\x00-\xff]/g, '**').length // 字节长度
    if (chrlen > L1) {
      for (let i = 0, j = 0; i < strlen; i++) {
        let chr = str.charAt(i)
        if (/[\x00-\xff]/.test(chr)) {
          j++ // ascii码为0-255，一个字符就是一个字节的长度
        } else {
          j += 2 // ascii码为0-255以外，一个字符就是两个字节的长度
        }
        if (j >= L1) {
          let a = str.substr(0, i - 2)
          str = a + '...'
          break
        }
      }
    }
  }

  cutStr(str, L)

  function cutStr(str, L) {
    let result = ''
    let strlen = str.length // 字符串长度
    let chrlen = str.replace(/[^\x00-\xff]/g, '**').length // 字节长度
    if (chrlen <= L) {
      arr.push(str)
      return
    }

    for (var i = 0, j = 0; i < strlen; i++) {
      var chr = str.charAt(i)
      if (/[\x00-\xff]/.test(chr)) {
        j++ // ascii码为0-255，一个字符就是一个字节的长度
      } else {
        j += 2 // ascii码为0-255以外，一个字符就是两个字节的长度
      }
      if (j <= L) { // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
        result += chr
      } else { // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
        arr.push(result)
        cutStr(str.substr(i), L)
        break
      }
    }
  }
  return arr.join('\n')
}

// 类型转换
let toType = o => Object.prototype.toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase()

// 参数过滤函数
let filterNull = function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

export {
  rect,
  rem,
  line,
  ellipse,
  circle,
  textFormat,
  getTextLen,
  arc,
  text,
  toType,
  filterNull
}
