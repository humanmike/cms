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
                                      v-model="queryInfo.query" :clearable="true" @clear="getUserList"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="2" class="spec">
                        <div class="grid-content bg-purple-light spec">
                            <!--触发指定内容网络请求查询-->
                            <el-button  type="primary" @click="getUserList">查询</el-button>
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
                        <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
                        <!--文字提示(el-tooltip),这个参数可以去官网查看对应-->
                        <!--enterable: 鼠标移动消失-->
                        <el-tooltip :enterable='false' content="添加用户" placement="top">
                            <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!--添加用户dialog框-->
            <!--dialog(el-gialog),这个参数可以去官网查看对应-->
            <!--visible.sync是否显示该对话框-->
            <el-dialog
                    title="添加用户"
                    :visible.sync="dialogVisible"
                    width="30%">
                <!--dialog框嵌套Input框-->
                <el-form :model="addUserForm"  :rules="addUserRuleForm" class="demo-ruleForm" label-width="80px">
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
                        <el-input v-model="addUserForm.email"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
    import {getUserList,getUserTypeToChange} from 'network/user'
  export default {
    name: "User",
    data(){
      return {
        // 获取用户列表传入参数
        queryInfo: {
          query: '',
          // 当前页面点击
          pagenum: 2,
          // 数据页数
          pagesize: 2,
        },
        // 用户数据total
        userTotal: null,
        // 用户详情信息
        userDatas: [],
        // 是否显示添加用户对话
        dialogVisible: false,
        // 添加用户信息
        addUserForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
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
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      // 1.网络请求
      // 获取用户列表数据
      getUserList(){
        getUserList(this.queryInfo).then(res => {
          if (res.meta.status != 200) return this.$message.error('获取用户列表信息失败')
          this.userTotal = res.data.total
          this.userDatas = res.data.users
        })
      },
      // 修改用户权限状态
      getUserTypeToChange(userInfo) {
        const {id, mg_state} = userInfo
        getUserTypeToChange(id, mg_state).then(res => {
          if(res.meta.status != 200) {
            // 因为vue数据是响应式的所以可以直接修改取反userInfo变回原本
            userInfo.mg_state = !userInfo.mg_state
            return this.$message.error('更新用户状态失败')
          }else {
            return this.$message.success('更新数据成功')
          }

        })
      },
      // 2.事件监听
      // pageSize 监听显示总页数
      handleSizeChange(size){
        this.queryInfo.pagesize = size
        // 实际上首次就已经返回了全部数据,这里的设置只是为了更像真实业务
        this.getUserList()
      },
      // currentPage 监听每页的点击
      handleCurrentChange(num){
        this.queryInfo.pagenum = num
        this.getUserList()
      },
      // 监听用户状态开关修改
      checkSwitchChange(userInfo){
        this.getUserTypeToChange(userInfo)
      }
    },
    created() {
      // 发送用户列表数据
      this.getUserList()
    }
  }
</script>

<style scoped>
    #user {
        color: #333333;
    }

</style>
