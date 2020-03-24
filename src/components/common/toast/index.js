// 导入自己的Toast组件
import Toast from './Toast'

// 定义一个obj对象
const obj = {}

// 为该obj对象定义一个install 的方法让Vue在安装组件的过程中去执行
// 在Vue来安装这个对象的时候，其实会回调一个Vue实例过来所以可以直接调用
obj.install = function (Vue) {
  // 1.使用组件构造器，来把这个Toast对象变成一个Vue的toastContrustor类
  const toastContrustor = Vue.extend(Toast)

  // 2.使用new 方式把toast实例对象创造出来
  const toast = new toastContrustor()

  // 3.将组件对象挂载的，随便一个元素中，类似我们Vue实例中的el:'#app'
  toast.$mount(document.createElement('div'))

  // 4.toast.$el对应的就是上面的div,加入到body页面中
  document.body.appendChild(toast.$el)

  // 5.最后就是加入的Vue实例中
  Vue.prototype.$toast = toast

}

// 6.导出这个实例
export default obj

// 7.最后要在main.js中使用Vue.use执行安装该组件

