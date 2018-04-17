// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
// import Icon from './assets/svg/svg.svg'

// Vue.component('icon', Icon);

Vue.config.productionTip = false

//配置图片懒加载
Vue.use(vueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  // attempt: 1
})

// 配置下拉加载更多
Vue.use(infiniteScroll)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
