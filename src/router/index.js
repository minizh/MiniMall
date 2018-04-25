import Vue from 'vue'
import Router from 'vue-router'
import GoodList from '@/views/GoodList'
import Cart from '@/views/Cart'
import Address from './../views/Address'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'GoodList',
      component: GoodList
    },
    {
      path: '/list',
      name: 'GoodList',
      component: GoodList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    }
  ]
})
