import Vue from 'vue'
// 引入ui 库
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element)

// 引入时间控件
import Moment from 'moment' 
Vue.prototype.$moment = Moment

// 引入 axios
import http from '../assets/js/axioshttp'
Vue.prototype.$http = http

// 引入自定义组件
import slcomponent from '../components/slcomponent'
Vue.use(slcomponent)

export default Vue