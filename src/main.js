import Vue from 'vue'
import App from './App.vue'
// 导入vuex存储对象
import store from './store'
// 导入路由对象
import router from './router'
// 导入自己的toast组件
import toast from 'components/common/toast/'
// 引入elementUi组件
import ElementUi from 'element-ui'
// 导入标准模板
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体图标模板
import 'assets/fonts/iconfont.css'

// 安装elementUi组件
Vue.use(ElementUi)

// 安装自己写的toast组件
Vue.use(toast)

// 挂载elementUi的弹窗对象挂载到原型对象上让全局都可以调用
Vue.prototype.$message = ElementUi.Message

Vue.config.productionTip = false




new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')



