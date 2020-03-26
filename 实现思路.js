// 电商管理后台依靠elementUI实现思路

// login.vue
// 关于布局
// 登陆使用(el-form)插件实现
// 使用flex布局登陆form

// home.vue
// 关于布局
// 整个home.vue的大的布局建议使用el-container来进行布局
// header的顶部内容可以直接使用flex
// side侧边栏内的内容可以使用NavMenu导航菜单(el-menu)来实现多级菜单
// 具体菜单内容从接口获取

// 关于路由
// 这里建议使用嵌套路由,因为其实无论怎么跳转,应该都是在home.vue下
// 所以配置home其它组件的时候使用chilidren

// 子路由user.vue
// 使用面包屑功能(el-breadcrumb)来展示具体菜单路径
// 1.使用卡片el-card容器来装载内容

// 2.使用el-row(layout布局来处理)el-input的布置
// 搜索框使用el-input输入框来实现并且添加可清空属性

// 3.具体用户展示内容使用带边框表格el-table来装载内容

// 4.添加用户dialog界面使用基本用法el-dialog
// el-dialog中添加el-form表单来填充内容
// 自定义添加用户内容时的校验规则
// 使用正则来自定义校验规则
// 注意重点,自定义规则的校验函数必须卸载data的return外面,注意是外面!!

// 5.编辑用户操作和添加用户类似都是使用el-dialog框实现

// 6.删除用户需要去挂载this.vue.porperty.$confirm = eleme
// 使用这个弹出框来判断用户是否误操作
