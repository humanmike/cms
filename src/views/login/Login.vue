<template>
    <div id="login-container">
        <div class="login-box">
            <!--头像区域-->
            <img src="~assets/logo.png" alt="">
            <!--elementUi登陆样式-->
            <!--:rules字段是elementUi用于校验的参数-->
            <!--为el-from创建一个实例表单ref,可以调用其重置方法,让数据回到初始值-->
            <el-form ref="loginFormRef" class="lgn-cls" :model="loginForm" :rules="loginFormRules">
                <el-form-item prop="username">
                    <!--prefix-icon文字前面图标-->
                    <!--iconfont是使用图标库必须要使用的基类-->
                    <!--icon-user具体图标名-->
                    用户名:<el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--prop字段是elementUi用于生效校验规则字段-->
                <el-form-item prop="password">
                    <!--prefix-icon文字前面图标-->
                    <!--iconfont是使用图标库必须要使用的基类-->
                    <!--icon-user具体图标名-->
                    密码:<el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <el-form-item class="btn-cls">
                    <el-button type="primary" @click="loginFunc">登陆</el-button>
                    <el-button  type="info" @click="clearIpt">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    // 导入网络请求
    import {loginApi} from 'network/login'
  export default {
    name: "Login",
    // 数据存放
    data(){
      return {
        // 登陆双向绑定表单
        loginForm: {
          username: 'admin',
          password: '123456',
        },
        // 校验数据表单
        loginFormRules: {
          // 校验用户名规则(必须为数组)
          // 校验的变量必须和loginForm里面变量一致
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          // 校验密码规则
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    // 函数存放
    methods: {
      // 重置按钮清除数据
      clearIpt(){
        // 调用elementUI的重置方法,让数据回到默认值
        return this.$refs.loginFormRef.resetFields()
      },
      // 登陆
      loginFunc(){
        // 调用elementUI方法,在登陆前去校验loginFormRules里面的规则
        // validate这个回掉函数里面的vaild会返回布尔值告诉校验结果
        this.$refs.loginFormRef.validate(vaild => {
          // 通过校验取反判断是否发起网络请求
          // 使用elementUi提供的弹窗提示来处理显示对应的toast
          if(!vaild) return this.$message.error('登陆失败')
          loginApi(this.loginForm).then(res => {
            this.$message.success('登陆成功')
            // 记录token到本地storage中
            window.sessionStorage.setItem('token', res.data.token)
            // 跳转的首页路由
            this.$router.push('/home')
          })
        })
      }
    },
  }
</script>

<style scoped>
    /*设置整体登陆容器样式*/
    #login-container {
        height: 100%;
        background-color: #2b4b6b;
    }
    /*设置登陆容器*/
    .login-box {
        position: fixed;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        margin: auto auto;
        width: 550px;
        height: 400px;
        background-color: #fff;
    }
    /*设置头像区域样式*/
    .login-box img {
        position: absolute;
        top: -20%;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        padding: 10px;
        border: 2px solid #eaeaea;
        border-radius: 50px;
        background-color: #eaeaea;
    }
    /*设置登陆div整体位置样式*/
    .login-box .lgn-cls {
        position: relative;
        top: 20%;
        padding: 5px;
    }
    /*设置按钮摆放位置样式*/
    .login-box .btn-cls {
        display: flex;
        justify-content: flex-end;
    }
</style>
