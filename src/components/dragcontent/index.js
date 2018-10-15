import customBox from './custombox'

const components = [customBox]

let install = function (Vue) {
  if (install.installed) {
    return
  }
  components.map(component => {
    Vue.component(component.name, component)
  })
  Vue.prototype.$custombox = customBox
  install.installed = true
}
install.installed = false
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install
}
