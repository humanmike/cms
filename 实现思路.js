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

//////////////////////////////////////////////////////////////////////////////////////////////////////////
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

// 6.删除用户需要去挂载Vue.prototype.$confirm = ElementUi.MessageBox.confirm
// 使用这个弹出框来判断用户是否误操作


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 权限管理处理
// 权限列表
// 面包屑组件布局
// 卡片组件布局内容-table组件布局具体内容-axios获取数据然后渲染

// 角色列表
// 面包屑组件布局
// 卡片组件布局内容-table组件布局具体内容-axios获取数据然后渲染
// 在table标签中还包含子标签expand(展开按钮控件)里面布局了具体的角色和对应权限细节
// 在expand中使用layou(el-row)t布局去布局对应的1,2,3级标签,善于利用:span属性进行1,2,3级等分
// 这里的布局要充分利用el-row el-col因为需要进行三层for循环
// 为1,2,3级标签使用Tag标签(el-tag)来装饰,并为其添加可移除功能,通过可移除功能触发(close事件)删除对应的标签权限功能

// 分配权限功能
// 通过dialog框事项
// 通过axios获取对应数据
// 通过el-tree树结构来展示对应数据,注意el-tree的属性使用方式,:props来定义应该根据什么规则来展示
// 有特定属性
<!--树形控件绑定对象:props渲染的方式,label希望看到什么名称展示,children展示具体那条数据数组名-->
<!--是否变成可选控件show-checkbox-->
<!--是否全部展开default-expand-all-->
<!--勾选内容的时候最后的节点值其实是勾选了其id值node-key-->
<!--默认勾选节点对应是一个数组default-checked-keys,根据节点值(id)来判断是否勾选-->//
// 参考
// 在点击分配权限的时候使用递归来获取三级组件的具体id值数据,放到default-checked-keys(默认勾选节点数组中)
// 根据getCheckedKeys() ,getHalfCheckedKeys()来获取选中的父子节点
// 通过选出来的值使用axios传递的服务器

// 用户管理的分配权限
// 使用dialog来填充内容
// 使用select选择器选择内容,请根据官网注意其用法
// 选择成功后使用axios传递服务器修改值
