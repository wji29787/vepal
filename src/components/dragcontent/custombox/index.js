import Vue from 'vue'
import CustomBox from './CustomBox'
let CustomboxConstructor = Vue.extend(CustomBox)
let Custombox = function (opt) {
  if (typeof opt !== 'object') {
    return
  }
  let optionData = opt.data || {}
  let optionMethods = opt.methods || {}
  let instance = new CustomboxConstructor({
    data: {
      ...optionData
    },
    methods: {
      ...optionMethods
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
