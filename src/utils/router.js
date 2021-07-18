import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './../App'
import Wrap from './../pages/Wrap'
import Login from './../pages/Login'
import MyProject from './../pages/MyProject'

// import axios from 'axios'
// const _import = require('./_import_' + process.env.NODE_ENV)
// var getRouter;
// let fakeRouter={};
// // Authorization: Basic eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJc3MiOiIxIiwiSWF0IjoxNTg3NjI3NTgzLCJFeHAiOjE1ODc3MTM5ODMsIkF1ZCI6Inpob25nZ3VvamlhbmdzdXNoZW5naHVjaHVhbmtlaml5b3V4aWFuZ29uZ3NpIiwiSnRpIjoiYzcxNWViN2ItNmNlMC00NWI2LTkyYTctZGFlZTY2YzUzMzcwIiwiVXNlciI6bnVsbH0.TO7EpwJj1bv182VpAjP8MX2NTvt4rSdJZklPVXJ51gk
// axios.defaults.headers.common['Authorization'] = 'Basic eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJc3MiOiIxIiwiSWF0IjoxNTg3NjI3NTgzLCJFeHAiOjE1ODc3MTM5ODMsIkF1ZCI6Inpob25nZ3VvamlhbmdzdXNoZW5naHVjaHVhbmtlaml5b3V4aWFuZ29uZ3NpIiwiSnRpIjoiYzcxNWViN2ItNmNlMC00NWI2LTkyYTctZGFlZTY2YzUzMzcwIiwiVXNlciI6bnVsbH0.TO7EpwJj1bv182VpAjP8MX2NTvt4rSdJZklPVXJ51gk';
// axios({
//     url:'http://211.149.250.2:20001/qualityGuard-api/api/Sys_Users/GetMyMenuList',
//     method: 'get',
// }).then(res=>{
//   fakeRouter.router = res.data.forEach(item=>{
//     return {
//       "path": item.SM_Url,
//       "component": item.SM_Kind,
//       "children": [{
//         "path": item.SM_Url,
//         "component": item.SM_Kind
//       }]
//     }
//   });
//   console.log(fakeRouter)


//   router.beforeEach((to, from, next) => {

//     if (!getRouter) { 
//       if (!getObjArr('router')) {
//         getRouter = fakeRouter
//         saveObjArr('router', getRouter) //存储路由到localStorage
//         routerGo(to, next) //执行路由跳转方法
//       } else { //从localStorage拿到了路由
//         getRouter = getObjArr('router') //拿到路由
//         console.log(getRouter)
//         routerGo(to, next)
//       }
//     } else {
//       next()
//     }
  
//   })

//   function routerGo(to, next) {
//     getRouter = filterAsyncRouter(getRouter) //过滤路由
//     router.addRoutes(getRouter) //动态添加路由
//     global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
//     next({ ...to, replace: true })
//   }

//   function saveObjArr(name, data) { //localStorage 存储数组对象的方法
//     localStorage.setItem(name, JSON.stringify(data))
//   }
  
//   function getObjArr(name) { //localStorage 获取数组对象的方法
//     return JSON.parse(window.localStorage.getItem(name));
  
//   }
  
//   function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
//     const accessedRouters = asyncRouterMap.filter(route => {
//       if (route.component) {
//         if (route.component === 'Layout') { //Layout组件特殊处理
//           route.component = Layout
//         } else {
//           route.component = _import(route.component)
//         }
//       }
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children)
//       }
//       return true
//     })
  
//     return accessedRouters
//   }


// })

//异常页
import Page403 from './../components/exception/page403'
import Page404 from './../components/exception/page404'
import Page500 from './../components/exception/page500'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: MyProject,
      meta: {
        title: '平台'
      }
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      name: 'Wrap',
      path: '/Wrap',
      component: Wrap,
      meta: {
        title: '管理中心'
      },
      children: [
        // {
        //   name: 'activesearchkeyword',
        //   path: '/activesearchkeyword',
        //   component: activesearchkeyword,
        //   meta: {
        //     title: '主动搜索关键词'
        //   }
        // },
      ]
    },
    {
      name:"myProject",
      path:"/myProject",
      component:MyProject,
      meta:{
        title:"后台管理"
      }
    },
    {
      name:'403',
      path:'/403',
      component:Page403,
      meta:{
        title:"暂无权限"
      }
    },
    {
      name:'404',
      path:'/404',
      component:Page404,
      meta:{
        title:"未找到资源"
      }
    },
    {
      name:'500',
      path:'/500',
      component:Page500,
      meta:{
        title:"请求失败"
      }
    }
  ],
  base: '/mqy/ZBSystem',
  mode: 'hash'//去除地址上的#
})

export default router;