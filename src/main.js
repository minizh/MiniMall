// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

//配置图片懒加载
Vue.use(vueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: 'static/loading-svg/loading-bars.svg',
  // attempt: 1
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
