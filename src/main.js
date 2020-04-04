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
// 导入树状table库
import TreeTable from 'vue-table-with-tree-grid'
// 导入标准模板
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体图标模板
import 'assets/fonts/iconfont.css'
// 导入富文本库
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本库的css样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 安装富文本库
Vue.use(VueQuillEditor)

// 安装elementUi组件
Vue.use(ElementUi)

// 安装自己写的toast组件
Vue.use(toast)

// 注册树状table为全局组件
Vue.component('tree-table', TreeTable)

// 挂载elementUi的弹窗对象挂载到原型对象上让全局都可以调用
Vue.prototype.$message = ElementUi.Message
// 挂载MessageBox弹框让全局都可以调用
Vue.prototype.$confirm = ElementUi.MessageBox.confirm
Vue.config.productionTip = false




new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')



