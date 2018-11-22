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

let image = opt => { 
  return new zrender.Image(opt)
}
let rem = (size) => {
  let baseSize = parseInt(document.querySelector('html').style.fontSize)
  if (baseSize <= 50) {
    baseSize = 50
  }
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
  return arr.join('\n\n')
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
// clone

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  // Handle Array or Object
  if (obj instanceof Array | obj instanceof Object) {
    var copy = (obj instanceof Array) ? [] : {};
    for (var attr in obj) {
      
      if (obj.hasOwnProperty(attr))
        copy[attr] = clone(obj[attr]);  
    }
    return copy;
  }
}
// merge
function merge(def, obj) {
  if (!obj) {
    return def;
  } else if (!def) {
    return obj;
  }

  for (var i in obj) {
    // if its an object
    if (obj[i] != null && obj[i].constructor == Object) {
      def[i] = merge(def[i], obj[i]);
    }
    // if its an array, simple values need to be joined. Object values need to be remerged.
    else if (obj[i] != null && (obj[i] instanceof Array) && obj[i].length > 0) {
      // test to see if the first element is an object or not so we know the type of array we're dealing with.
      if (obj[i][0].constructor == Object) {
        var newobjs = [];
        // create an index of all the existing object IDs for quick access. There is no way to know how many items will be in the arrays.
        var objids = {}
        for (var x = 0, l = def[i].length; x < l; x++) {
          objids[def[i][x].id] = x;
        }

        // now walk through the objects in the new array
        // if the ID exists, then merge the objects.
        // if the ID does not exist, push to the end of the def array
        for (var x = 0, l = obj[i].length; x < l; x++) {
          var newobj = obj[i][x];
          if (objids[newobj.id] !== undefined) {
            def[i][x] = merge(def[i][x], newobj);
          } else {
            newobjs.push(newobj);
          }
        }

        for (var x = 0, l = newobjs.length; x < l; x++) {
          def[i].push(newobjs[x]);
        }
      } else {
        for (var x = 0; x < obj[i].length; x++) {
          var idxObj = obj[i][x];
          if (def[i].indexOf(idxObj) === -1) {
            def[i].push(idxObj);
          }
        }
      }
    } else {
      def[i] = obj[i];
    }
  }
  return def;
}
//sort
function arrSort(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
}
// 获取窗口可视范围的高度
function getClientHeight() {
  var clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  } else {
    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  }
  return clientHeight
}
// 获取窗口滚动条高度
function getScrollTop() {
  var scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  return scrollTop
}
// 获取文档内容实际高度
function getScrollHeight() {
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
}
// 文档滚动到指定高度
function setScrollTop(el, scrollTop) {
  if (!scrollTop) {
    scrollTop = el
    el = document.documentElement || document.body
  }
  el.scrollTop = scrollTop
}
let StandardPost = (url, args, type = 'post') => {
  let form = document.createElement("form");
  form.method = type;
  form.action = url;
  for (let key in args) {
    let input = document.createElement('input');
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', key)
    input.setAttribute('value', args[key])
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit();
  form.parentNode.removeChild(form)
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
  filterNull,
  getClientHeight,
  getScrollTop,
  getScrollHeight,
  image,
  StandardPost,
  setScrollTop,
  clone,
  merge,
  arrSort
}
