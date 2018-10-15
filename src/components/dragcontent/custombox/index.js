import Vue from 'vue'
import CustomBox from './Custombox'
let CustomboxConstructor = Vue.extend(CustomBox)
let Custombox = function (opt) {
  let instance = new CustomboxConstructor({
    data: {
      msg: opt.msg
    }
  })

  instance.$mount()
  if (opt.el) {
    opt.el.appendChild(instance.$el)
  } else {
    document.body.appendChild(instance.$el)
  }

  return instance
}

export default Custombox