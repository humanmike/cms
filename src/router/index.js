import Vue from 'vue'
import Router from 'vue-router'
// 导入vuex数据存储
import store from "store";

// 安装组件
Vue.use(Router)

// 懒加载动态路由
const login = () => import('views/login/Login')
const Home = () => import('views/home/Home')

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
  console.log(store.state.userMsg.token);
  if (to.path === '/login') {
    return next()
  }
  if (store.state.userMsg.token == null) {
    return next('/login')
  }else {
    return next()
  }
})

// 导出路由
export default router