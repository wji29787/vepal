let getTextLen = str => {
  return str.replace(/[\u0391-\uFFE5]/g, 'aa').length
}

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
  return arr.join('\n\n')
}


//sort
function arrSort(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
}

export {
  getTextLen,
  textFormat,
  arrSort,
}
