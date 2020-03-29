import Vue from 'vue'
import Router from 'vue-router'

// 安装组件
Vue.use(Router)

// 懒加载动态路由
const login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/Welcome')
const User = () => import('views/user/User')
const Rights = () => import('views/power/Rights')
const Roles = () => import('views/power/Roles')

// 导出路由参数
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
   path: '/login',
   component: login,
   meta: {
     title: 'Login'
   }
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Rights
      },  {
        path: '/roles',
        component: Roles
      },
    ]
    ,
    meta: {
      title: 'Home'
    }
  },
]
// 实例化路由
const router = new Router({
  routes,
  mode: 'history'
})


// 导航守卫
router.beforeEach((to, form, next) => {
  if (to.path === '/login') {
    return next()
  }
  if ( window.sessionStorage.token == undefined) {
    return next('/login')
  }else {
    return next()
  }
})

// 导出路由
export default router
