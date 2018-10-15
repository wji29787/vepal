import Vue from 'vue'
import CustomBox from './CustomBox'
let CustomboxConstructor = Vue.extend(CustomBox)
let Custombox = function (opt) {
  if (typeof opt !== 'object') {
    return
  }
  let instance = new CustomboxConstructor(opt)

  instance.$mount()
  if (opt.data.el) {
    opt.data.el.appendChild(instance.$el)
  } else {
    document.body.appendChild(instance.$el)
  }

  return instance
}

export default Custombox
