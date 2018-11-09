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

export default VueLogger
