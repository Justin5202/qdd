// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill'
import Vue from 'vue'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()
import App from './App'
import router from './router'
import store from './vuex/store'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import SDK from '@/sdk/NIM_Web_SDK_v4.2.0.js'

Vue.use(MintUI)

Vue.config.productionTip = false
Vue.config.debug = true

// 添加手势触摸事件，使用方法如 v-touch:swipeleft
import VueTouch from '@/plugins/touchEvent'
Vue.use(VueTouch)

// vue-resource
// 在服务器通讯方面，在升级到 vue 2.0 后，官方已经取消对 vue-resource 的更新而是转推 Axios
// import VueResource from 'vue-resource'
// Vue.use(VueResource)
// 将全局样式文件写在 main.js
import '@/assets/scss/reset.css'
import '@/assets/scss/common.css'

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
// Vue.prototype.axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
