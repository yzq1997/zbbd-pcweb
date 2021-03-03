// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
window.Vue = Vue//全局可用
import App from './App'
import router from './utils/router'
import axios from 'axios'
import { apiAxios } from './utils/request'
import store from './utils/store' // 引入store
import Antd from 'ant-design-vue'//全部引用ant组件
import 'ant-design-vue/dist/antd.css'
// import VueLazyLoad from 'vue-lazyload' //懒加载组件
import './assets/icons'//加载svg

 import echarts from 'echarts'

import COMMON from './pages/common/common'
// import 'swiper/dist/css/swiper.css'
// import china from './assets/map/china.js'
import 'echarts/map/js/china.js';
// echarts.registerMap('china', china)
//懒加载 src下的assets目录下的图片
// Vue.use(VueLazyLoad,{
//   error:require('./assets/images/imgerror.png'),//图片加载失败时候显示的图片
//   loading:require('./assets/images/loading.gif'),//图片还未加载完成时候的loading图片
//   throttleWait:500,
//   attempt: 1,
// })

import bus from './utils/vue-bus.js'

Vue.prototype.$bus = bus

//导出js
import Blod from './utils/Blod'

import Export2Excel from './utils/Export2Excel'

// 引入mockjs
require('./utils/mock.js')

// 将axios添加到原型链上
Vue.prototype.$axios = axios
 
// 定义全局变量
Vue.prototype.$dataApi = apiAxios

// 讲echart定义全局
Vue.prototype.$echarts = echarts;

// 使用全局方法和变量

Vue.prototype.COMMON = COMMON;

//加载antd组件
Vue.use(Antd)
Vue.config.productionTip = false

//全局路由跳转控制
// if (sessionStorage.getItem('username') == ''||sessionStorage.getItem('username') == null) {
//   router.push({
//     path: '/Login'
//   })
// }
router.beforeEach((to, from, next) => {
  if(to.path !== '/login' && to.path !== '/myProject')
  {
    if(!sessionStorage.getItem('userName') || !sessionStorage.getItem('auth'))
    {
      next({
        path: '/myProject',
        replace: true
      })
    }
  }
  else
  {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
      document.title = to.meta.title
    }
    // console.log('to', to)
    if (to.matched.length==0) {//监测路由
      next({
        path: '/404',
        replace: true
      })
    }
    else if (to.path == '/') {//监测路由
      next({
        path: '/myProject',
        replace: true
      })
    }
  }
  next()
})


/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  components: { App },
  template: '<App/>'
})
