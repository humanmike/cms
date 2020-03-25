import Vue from 'vue'
import Vuex from 'vuex'
// 导入各种数据
import {mutations} from "./mutations";
import {getters} from "./getters";
import {actions} from "./actions";

// 安装vuex组件
Vue.use(Vuex)

// vuex数据存放
const state = {
  userMsg: {
  }
}

// 实例化组件
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})

// 导出组件
export default store
