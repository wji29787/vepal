let data = {
  price: 5,
  quantity: 2
}
let target = null

class Dep {
  constructor() {
    this.subscribers = []
  }
  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target)
    }
  }
  notify() {
    this.subscribers.forEach(sub => sub())
  }

}

Object.keys(data).forEach(key => {
  let internalValue = data[key]

  const dep = new Dep()

  Object.defineProperty(data, key, {
    get() {
      dep.depend()
      return internalValue
    },
    set(newVal) {
      internalValue = newVal
      dep.notify()
    }
  })
})

function watcher(myFun) {
  target = myFun
  target()
  target = null
}

watcher(() => {
    data.total = data.price * data.quantity
  })


  /**
   * @param obj 需要监听的对象或数组
   * @param callback 对应属性变化时触发的回调函数
   * 
   */

//   ! function (e) {
//     function t(a) {
//       if (i[a]) return i[a].exports;
//       var n = i[a] = {
//         exports: {},
//         id: a,
//         loaded: !1
//       };
//       return e[a].call(n.exports, n, n.exports, t), n.loaded = !0, n.exports
//     }
//     var i = {};
//     return t.m = e, t.c = i, t.p = "", t(0)
//   }([function (e, t) {
//     "use strict";
//     Object.defineProperty(t, "__esModule", {
//       value: !0
//     });
//     var i = window;
//     t["default"] = i.flex = function (normal, e, t) {
//       var a = e || 100,
//         n = t || 1,
//         r = i.document,
//         o = navigator.userAgent,
//         d = o.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i),
//         l = o.match(/U3\/((\d+|\.){5,})/i),
//         c = l && parseInt(l[1].split(".").join(""), 10) >= 80,
//         p = navigator.appVersion.match(/(iphone|ipad|ipod)/gi),
//         s = i.devicePixelRatio || 1;
//       p || d && d[1] > 534 || c || (s = 1);
//       var u = normal ? 1 : 1 / s,
//         m = r.querySelector('meta[name="viewport"]');
//       m || (m = r.createElement("meta"), m.setAttribute("name", "viewport"), r.head.appendChild(m)), m.setAttribute("content", "width=device-width,user-scalable=no,initial-scale=" + u + ",maximum-scale=" + u + ",minimum-scale=" + u), r.documentElement.style.fontSize = normal ? "50px" : a / 2 * s * n + "px"
//     }, e.exports = t["default"]
//   }]);
// flex(false, 100, 1);


// 'use strict';

// /**
//  * @param {Boolean} [normal = false] - 默认开启页面压缩以使页面高清;  
//  * @param {Number} [baseFontSize = 100] - 基础fontSize, 默认100px;
//  * @param {Number} [fontscale = 1] - 有的业务希望能放大一定比例的字体;
//  */
// const win = window;
// export default win.flex = (normal, baseFontSize, fontscale) => {
//   const _baseFontSize = baseFontSize || 100;
//   const _fontscale = fontscale || 1;

//   const doc = win.document;
//   const ua = navigator.userAgent;
//   const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
//   const UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
//   const isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;

//   const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi); 
//   let dpr = win.devicePixelRatio || 1;
//   if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
//     // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
//     dpr = 1;
//   }
//   const scale = normal ? 1 : 1 / dpr;

//   let metaEl = doc.querySelector('meta[name="viewport"]');
//   if (!metaEl) {
//     metaEl = doc.createElement('meta');
//     metaEl.setAttribute('name', 'viewport');
//     doc.head.appendChild(metaEl);
//   }
//   metaEl.setAttribute('content', `width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`);
//   doc.documentElement.style.fontSize = normal ? '50px' : `${_baseFontSize / 2 * dpr * _fontscale}px`;
// };

// (function (win) {
//   let flex = (normal, baseFontSize, fontscale) => {
//     const _baseFontSize = baseFontSize || 100;
//     const _fontscale = fontscale || 1;

//     const doc = win.document;
//     const ua = navigator.userAgent;
//     const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
//     const UCversion = ua.match(/U3\/((\d+|\.){5,})/i);
//     const isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80;

//     const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
//     let dpr = win.devicePixelRatio || 1;
//     if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
//       // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
//       dpr = 1;
//     }
//     const scale = normal ? 1 : 1 / dpr;

//     let metaEl = doc.querySelector('meta[name="viewport"]');
//     if (!metaEl) {
//       metaEl = doc.createElement('meta');
//       metaEl.setAttribute('name', 'viewport');
//       doc.head.appendChild(metaEl);
//     }
//     metaEl.setAttribute('content', `width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`);
//     doc.documentElement.style.fontSize = normal ? '50px' : `${_baseFontSize / 2 * dpr * _fontscale}px`;
//   }

//   flex(false)
// })(window)



// (function (doc, win) {
//   console.log("dpr:"+win.devicePixelRatio); 
//   var docEle = doc.documentElement,
//   isIos = navigator.userAgent.match(/iphone|ipod|ipad/gi),
//   dpr=Math.min(win.devicePixelRatio, 3);
//   scale = 1 / dpr,

//   resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
//   docEle.dataset.dpr = dpr;

//   var metaEle = doc.createElement('meta');
//   metaEle.name = 'viewport';
//   metaEle.content = 'initial-scale=' + scale + ',maximum-scale=' + scale;
//   docEle.firstElementChild.appendChild(metaEle);

//   var recalCulate = function  {
//       var width = docEle.clientWidth;
//       if (width / dpr > 640) {
//           width = 640 * dpr;
//       }
//       docEle.style.fontSize = 20 * (width / 750) + 'px';
//   };

//   recalCulate
//   if (!doc.addEventListener) return;
//   win.addEventListener(resizeEvent, recalCulate, false);
// })(document, window);