const VueLogger = {
  name: 'vue-logger'
}
VueLogger.install = (Vue, options) => {
  const defaults = {
    silent: Vue.config.silent,
    format: (...str) => {
      str.unshift('[Vue Logger]: ')
      return str
    }
  }
  options = Object.assign({}, defaults, options)
  /* eslint-disable func-names  */
  let arr = ['log', 'warn', 'error']
  arr.forEach((op) => {
    Vue.prototype[`$${op}`] = function (...str) {
      if (options.silent) {
        return
      }
      str = options.format.apply(this, str)
      console[op](...str)
    }
  })
}
const components = ['dialog', 'msg', 'loading']
const install = function (Vue, options = {}) {
  if (install.installed) {
    return
  }
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
  VueLogger.install(Vue, {
    /* eslint-disable func-names  */
    format (...str) {
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
