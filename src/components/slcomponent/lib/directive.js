const Directive = {
  name: 'directive'
}
Directive.install = (Vue, options) => {

  // Vue.directive('scroll',(el, binding, vNode)=>{
  //  console.log(this)   
  // let instance = vNode.componentInstance;
  // let _this = vNode.context;
  // let wrap = instance.$refs.wrap;
  // let moveY = instance.moveY;
  // let sizeHeight = instance.sizeHeight;
  // let sign = 10;
  // // let div =el.querySelector('.el-scrollbar__wrap')
  // if (!wrap.clientHeight) return;
  // let mY;
  // let sH = (parseFloat(sizeHeight) * wrap.clientHeight) / 100;
  // if (moveY) {
  //   mY = (moveY / 100) * sH;
  // } else {
  //   mY = 0;
  // }
  // if (wrap.clientHeight - (sH + mY) < sign) {
  //   binding.value(mY + wrap.clientHeight, instance);
  // }
  // })

  let scrollTh = 0;
//   let scrollAttr = "scrollfn";
  let div,scrollfn;
  Vue.directive('scroll', {
    bind(el, binding, vNode) {
      div = el;
      let value = binding.value
      let type = Object.prototype.toString.call(value)
      if (type !== "[object Object]") {
        return false
      }
      if (value.el) {
        div = el.querySelector(value.el)
      }
      let sign = 10
      let fn = value.scrollfn
     scrollfn = function (e) {
        let scrollH = this.scrollHeight;
        let crrentTh = this.scrollTop;
        let scrollCh = this.clientHeight;
        // 触发回调
        if (scrollH - crrentTh - scrollCh < sign) {
          fn(this, scrollH)
        }
      }
    //   el.setAttribute(scrollAttr, scrollfn);
      div.addEventListener('scroll', scrollfn, false)
    },
    update(el, binding, vNode) {
      // console.log(el, binding)
      // let instance = vNode.componentInstance;
      // let _this = vNode.context;
      // // let wrap = instance.$refs.wrap;
      // let moveY = instance.moveY;
      // let aa = instance.resizeState
    },
    unbind(el, binding, vNode) {
    //   let fn = el.getAttribute(scrollAttr)
      div.removeEventListener('scroll', scrollfn, false)
    }
  })

}

export default Directive
