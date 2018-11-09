import VueLogger from './lib/vue-logger'
import Directive from './lib/directive'

const components = ['dialog', 'msg', 'loading']

// 插件
const install = function (Vue, options = {}) {
  if (install.installed) {
    return
  }
  //全局调用方法
  const singletonComponents = []
  components.every(val => {
    let comp = require(`./${val}/main.vue`)
    let Component = Vue.extend(comp.name ? comp : comp.default)

    if (Component.options.type === 'singleton') {
      singletonComponents.push(Component)
    }
    Vue.component(Component.options.name, Component)
    return true
  })
  singletonComponents.forEach(Component => {
    let instance = new Component({
      el: document.createElement(Component.options.tag || 'div')
    })
    Vue.prototype[`$${Component.options.name.replace('sl-', 'sl')}`] = instance
  })

  /**
   * 自定义指令 不通用 
   * 适用于 el-scrollbar
   * el-table
   * 
   */
  Directive.install(Vue)

  VueLogger.install(Vue, {
    /* eslint-disable func-names  */
    format(...str) {
      str.unshift(`[Vue Component ${this.$options.name}]: `)
      return str
    }
  })
  install.installed = true
}
install.installed = false
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
