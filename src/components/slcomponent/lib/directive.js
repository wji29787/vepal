const Directive = {
  name: 'directive'
}
Directive.install = (Vue, options) => {


  let scrollTh = 0;
  // let flag = false
//   let scrollAttr = "scrollfn";
  let div,scrollfn;
  Vue.directive('scroll', {
    bind(el, binding, vNode) {
     
    //   div = el;
    //   let value = binding.value
    //   let type = Object.prototype.toString.call(value)
    //   if (type !== "[object Object]") {
    //     return false
    //   }
    //   if (value.el) {
    //     div = el.querySelector(value.el)
    //   }
    //   let sign = 10
    //   let fn = value.scrollfn
    //  scrollfn = function (e) {
    //     let scrollH = this.scrollHeight;
    //     let crrentTh = this.scrollTop;
    //     let scrollCh = this.clientHeight;
    //     // 触发回调
    //     if (scrollH - crrentTh - scrollCh < sign) {
    //       console.log(12)
    //       fn(this, scrollH)
    //     }
    //   }
    //   el.setAttribute(scrollAttr, scrollfn);
      // div.addEventListener('scroll', scrollfn, false)
    },
    update(el, binding, vNode) {
  
    },
    inserted(el, binding, vNode){
     
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
      div.addEventListener('scroll', scrollfn, false)
    },
    unbind(el, binding, vNode) {
    //   let fn = el.getAttribute(scrollAttr)
      div.removeEventListener('scroll', scrollfn, false)
    }
  })

}

export default Directive
