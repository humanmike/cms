<template>
    <div id="user">
        <!--User布局使用elementUi查插件-->
        <!--面包屑功能(el-breadcrumb),这个参数可以去官网查看对应-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片功能(el-card),这个参数可以去官网查看对应-->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <!--layout布局(el-row),使用该布局插件对卡片顶部查询内容进行布局-->
                <!--suffix-icon图标class-->
                <el-row>
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <!--通过双向绑定数据把queryInfo.query绑定,然后传递给服务器进行后端查询-->
                            <!--clearable:可清空属性,并且会触发clear事件来清空数据-->
                            <!--clear事件把文库内容清空然后再次发起请求-->
                            <el-input placeholder="请输入查询内容"
                                      suffix-icon="el-icon-arrow-right"
                                      v-model="queryInfo.query" :clearable="true" @clear="getUserListApi"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="2" class="spec">
                        <div class="grid-content bg-purple-light spec">
                            <!--触发指定内容网络请求查询-->
                            <el-button  type="primary" @click="getUserListApi">查询</el-button>
                        </div>
                    </el-col>
                    <el-col :span="1">
                        <div class="grid-content bg-purple-light">
                            <!--把dialogVisible修改为true显示添加对话框-->
                            <el-button  type="primary" @click="dialogVisible=true">添加用户</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!--基础表格(el-table),这个参数可以去官网查看对应-->
            <!--border属性:是否带边框-->
            <el-table :border="true" :data="userDatas" style="width: 100%">
                <!--type属性:为索引列-->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <!--使用作用域操作根据mg-state判断开关状态-->
                    <!--slot-scope来获取作用域插槽数据-->
                    <template slot-scope="scope">
                        <!--开关(el-switch),这个参数可以去官网查看对应-->
                        <el-switch
                                v-model="scope.row.mg_state" @change="checkSwitchChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <!--作用域插槽方式自定义操作按钮-->
                    <template slot-scope="scope">
                        <!--size设置button尺寸-->
                        <!--修改用户button-->
                        <el-button @click="changeDataBtn(scope.row)" type="primary" icon="el-icon-edit" size="small"></el-button>
                        <!--删除用户button-->
                        <el-button @click="deleteDataBtn(scope.row.id)" type="danger" icon="el-icon-delete" size="small"></el-button>
                        <!--文字提示(el-tooltip),这个参数可以去官网查看对应-->
                        <!--enterable: 鼠标移动消失-->
                        <el-tooltip :enterable='false' content="分配权限" placement="top">
                            <el-button type="warning" icon="el-icon-setting" size="small" @click="shareRolesFunc(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分配权限用户dialog框-->
            <el-dialog title="分配权限" :visible.sync="shareRolesDialogVisible">
                <div class="share-cls">
                    <p>当前的用户: {{shareUsrForm.username}}</p>
                    <p>当前的角色: {{shareUsrForm.role_name}}</p>
                    <p>分配新角色:
                        <!--select选择器(el-select)-->
                        <!--v-model双向绑定select选择器选中后的值-->
                        <!--:label 用户展示可选择的数据-->
                        <!--:value 最终选中之后传给v-model的值-->
                        <el-select v-model="selectRoles" placeholder="请选择">
                            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"/>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="shareRolesDialogVisible = false">取 消</el-button>
                    <!--setSelectRolesFunc确定修改用户权限函数-->
                    <el-button type="primary" @click="setSelectRolesFunc">确 定</el-button>
                </span>
            </el-dialog>

            <!--添加用户dialog框-->
            <!--dialog(el-gialog),这个参数可以去官网查看对应-->
            <!--visible.sync是否显示该对话框-->
            <!--dialog监听对话框关闭函数-->
            <el-dialog title="添加用户" :visible.sync="dialogVisible" @close="addDialogClosed">
                <!--dialog框嵌套Input框-->
                <el-form ref="showUserElFormRef" :model="addUserForm"  :rules="addUserRuleForm" class="demo-ruleForm" label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addUserForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addUserForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addUserForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addUserForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <!--addUserFunc确定添加用户函数-->
                <el-button type="primary" @click="addUserFunc">确 定</el-button>
            </el-dialog>
            <!--修改用户dialog框-->
            <el-dialog title="修改用户" :visible.sync="changeDialogVisible">
                    <el-form ref="updateUserElFormRef" :model="updateForm" @close="updateDialogClosed" :rules="updateFormRule"  class="demo-ruleForm">
                        <el-form-item label="用户名:">
                        <el-input disabled v-model="updateForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="手机:" prop="mobile">
                            <el-input v-model="updateForm.mobile"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱:" prop="email">
                            <el-input v-model="updateForm.email"></el-input>
                        </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="changeDialogVisible = false">取 消</el-button>
                    <!--updateUserData确定修改用户信息函数-->
                    <el-button type="primary" @click="updateUserData">确 定</el-button>
                </span>
            </el-dialog>
            <!--
                分页码(el-pagination),这个参数可以去官网查看对应
                current-page(变量): 当前页数
                total: 总条目数
                page-sizes: 设置可以让分页每页展示多少数据
                size-change(事件): pageSize 改变时会触发
                current-change(事件): 'currentPage改变时会触发
            -->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagesize"
                    :page-sizes="[1, 2, 3, 4]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="userTotal">
            </el-pagination>
        </el-card>


    </div>
</template>

<script>
    // 导入网络请求
    import
    {
      getUserListApi,
      getUserTypeToChangeApi,
      addUserApi,
      searchUserApi,
      updateUserApi,
      deleteUserApi,
      getUserRolesApi,
      setUserRolesApi,
    } from 'network/user'
  export default {
    name: "User",
    data(){
      // 校验邮箱函数
     const checkEmail = (rule, value, cb) => {
        // 这个回掉函数在系统调用校验时会接收三个值,校验规则,具体值,和回掉函数
        const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (regEmail.test(value)) {
          return  cb()
        }
        cb(new Error('请输入合法邮箱'))
      };
     // 校验手机函数
      const checkMobile = (rule, value, cb) => {
        // 这个回掉函数在系统调用校验时会接收三个值,校验规则,具体值,和回掉函数
        const regMobile = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
        if (regMobile.test(value)) {
          return  cb()
        }
        cb(new Error('请输入合法手机号码'))
      };
      return {
        // 校验手机函数
        // 获取用户列表传入参数
        queryInfo: {
          query: '',
          // 根据传递的页数不同传递回不同的数据
          pagenum: 2,
          // 一次性获取多少条数据
          pagesize: 2,
        },
        // 用户数据total
        userTotal: null,
        // 用户详情信息
        userDatas: [],
        // 控制添加用户对话框的显示和隐藏
        dialogVisible: false,
        // 控制修改用户对话框的显示和隐藏
        changeDialogVisible: false,
        // 控制分配权限对话框的显示和隐藏
        shareRolesDialogVisible: false,
        // 添加用户信息
        addUserForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        // 修改用户信息数据
        updateForm: {

        },
        // 当前需要修改全选的用户对象
        shareUsrForm: {},
        // 校验用户规则
        addUserRuleForm: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            // 自定义校验规则,注意checkEmail是定义在data的return外
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ],
        },
        // 校验修改用户规则
        updateFormRule: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            // 自定义校验规则,注意checkEmail是定义在data的return外
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ],
        },
        // 分配角色列表
        rolesList: [],
        // 选定的角色列表值:
        selectRoles: '',
        // 获取需要修改权限的角色id
        saveRolesId: '',
      }
    },
    methods: {
      // 1.网络请求
      // 获取角色列表Api
      getUserRolesApi() {
        getUserRolesApi().then(res => {
          if (res.meta.status != 200) return this.$message.error('获取角色列表数据失败')
          this.rolesList = res.data
        })
      },
      // 修改角色列表Api
      setUserRolesApi(ridObj) {
        setUserRolesApi(this.saveRolesId, ridObj).then(res => {
          if (res.meta.status != 200) return this.$message.error('修改角色权限失败')
          // 刷新用户列表
          this.getUserListApi()
          // 关闭dialog框
          this.shareRolesDialogVisible = false
          // 弹出成功提示
          return this.$message.success('修改角色权限成功')
        })
      },
      // 获取用户列表数据Api
      getUserListApi(){
        getUserListApi(this.queryInfo).then(res => {
          if (res.meta.status != 200) return this.$message.error('获取用户列表信息失败')
          this.userTotal = res.data.total
          this.userDatas = res.data.users
        })
      },
      // 修改用户权限状态Api
      getUserTypeToChangeApi(userInfo) {
        const {id, mg_state} = userInfo
        getUserTypeToChangeApi(id, mg_state).then(res => {
          if(res.meta.status != 200) {
            // 因为vue数据是响应式的所以可以直接修改取反userInfo变回原本
            userInfo.mg_state = !userInfo.mg_state
            return this.$message.error('更新用户状态失败')
          }else {
            return this.$message.success('更新数据成功')
          }
        })
      },
      // 添加新用户Api
      addUserApi() {
        addUserApi(this.addUserForm).then(res => {
          // 201代表添加成功,否则返回错误toast
          if (res.meta.status != 201) return this.$message.error('后台添加失败')
          this.dialogVisible = false
          // 重新调用getUserListApi刷新页面
          this.getUserListApi()
          return this.$message.success('添加新用户成功')
        })
      },
      // 查询用户Api
      searchUserApi(id) {
        searchUserApi(id).then(res => {
          if (res.meta.status != 200) return this.$message.error('获取查询用户信息失败')
          // 把获取到的修改用户信息数据给updateForm
          this.updateForm = res.data
        })
      },
      // 更新用户数据api
      updateUserApi() {
        updateUserApi(this.updateForm).then(res => {
          if (res.meta.status != 200) return this.$message.error('更新用户数据失败')
          // 刷新数据
          this.getUserListApi()
          this.changeDialogVisible = false
          return this.$message.success('更新用户数据成功')
        })
      },
      // 删除用户数据
      deleteUserApi(id){
        deleteUserApi(id).then(res => {
          if (res.meta.status != 200) return this.$message.error('删除数据失败')
          // 重新获取数据
          this.getUserListApi()
          return this.$message.success('删除数据成功')
        })
      },
      // 2.事件监听
      // 修改用户权限
      setSelectRolesFunc() {
        // 用户修改后的角色对象
        const ridObj = {rid: this.selectRoles}
        // 像服务器发送修改数据
        this.setUserRolesApi(ridObj)
      },
      // 分配权限函数
      shareRolesFunc(shareUsrForm) {
        // 获取需要修改权限的角色id
        this.saveRolesId = shareUsrForm.id
        // 当前需要修改全选的用户对象
        this.shareUsrForm = shareUsrForm
        this.shareRolesDialogVisible = true
        // 获取角色列表Api数据
        this.getUserRolesApi()
      },
      // pageSize 监听显示总页数
      handleSizeChange(size){
        this.queryInfo.pagesize = size
        // 实际上首次就已经返回了全部数据,这里的设置只是为了更像真实业务
        this.getUserListApi()
      },
      // currentPage 监听每页的点击
      handleCurrentChange(num){
        this.queryInfo.pagenum = num
        this.getUserListApi()
      },
      // 监听用户状态开关修改
      checkSwitchChange(userInfo){
        this.getUserTypeToChangeApi(userInfo)
      },
      // 监听对话框(dialog)关闭函数
      addDialogClosed() {
        // 对话框关闭清空对话框里面内容
        this.$refs.showUserElFormRef.resetFields()
      },
      // 添加新用户函数
      addUserFunc() {
        this.$refs.showUserElFormRef.validate((validate) => {
          if (!validate) return this.$message.error('信息有误添加失败')
          this.addUserApi()
        })
      },
      // 监听修改用户信息按钮
      changeDataBtn(data) {
        const id = data.id
        this.searchUserApi(id)
        // 显示修改用户对话框
        this.changeDialogVisible = true
      },
      // 监听修改用户信息对话框关闭函数
      updateDialogClosed() {
        // 对话框关闭清空对话框里面内容
        this.$refs.updateUserElFormRef.resetFields()
      },
      // 修改用户数据
      updateUserData() {
        this.$refs.updateUserElFormRef.validate((validate) => {
          if (!validate) return this.$message.error('修改信息有误修改失败')
          this.updateUserApi()
        })
      },
      // 删除用户数据
      deleteDataBtn(id) {
        // 询问用户是否删除数据
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.deleteUserApi(id)
        }).catch( res => {
          this.$message.info('取消删除成功')
        })
      }
    },
    created() {
      // 发送用户列表数据
      this.getUserListApi()
    }
  }
</script>

<style scoped>
    #user {
        color: #333333;
    }

    .share-cls {
        text-align: left;
    }

</style>
