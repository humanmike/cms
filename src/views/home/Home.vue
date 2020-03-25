<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header class="home-header">
            <div class="header-title">
                <img src="~assets/img/heima.png" alt="">
                <span>电商管理后台系统</span>
            </div>
            <div class='lgo-btn' @click="logout">
                <span>登出</span>
            </div>
        </el-header>
        <el-container>
            <!--侧边栏菜单布局-->
            <el-aside class="home-side" width="200px">
            <!--使用elementUi导航菜单-->
                <el-menu
                        >
                    <!--一级菜单区域-->
                    <el-submenu index="1">
                        <!--一级菜单图标及文本-->
                        <template slot="title">
                            <!--图标-->
                            <i class="el-icon-location"></i>
                            <!--一文本-->
                            <span>导航一</span>
                        </template>
                        <!--二级菜单区域-->
                        <el-menu-item index="1-1">
                            <!--二级菜单图标及文本-->
                            <template slot="title">
                                <!--图标-->
                                <i class="el-icon-location"></i>
                                <!--一文本-->
                                <span>导航一</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>

            </el-aside>
            <!--主要内容布局-->
            <el-main class="home-main" >Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {

      }
    },
    methods:{
      // 登出
      logout () {
        // 清空浏览器缓存
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    }
  }
</script>

<style scoped>
    .home-container {
        position: absolute;
        height: 100%;
        width: 100%;
        text-align: center;
        color: #eaeaea;
    }

    /*头部样式*/
    .home-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /*设置头部左侧样式*/
    .home-header img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
    }

    /*设置登出按钮鼠标移动样式*/
    .home-header .lgo-btn {
        cursor: pointer;
    }

    /*设置头部登出按钮样式样式*/
    .home-header .lgo-btn  span {
        padding: 7px;
        border: 1px solid #808080;
        border-radius: 50px;
    }

    .home-side {
        background-color: #333744;
    }

    .home-main {
        background-color: #eaedf1;
    }

</style>
