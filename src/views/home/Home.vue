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
            <!--width 根据isCollapse来进行折叠时的宽度判断-->
            <el-aside class="home-side" width="isCollapse ? 64px : 200px">
                <!--折叠按钮-->
                <div  class="coll-btn" @click="changeCollapse">| | |</div>
                <!--使用elementUi导航菜单-->
                <!--NavMenu导航菜单(el-menu)-->
                <!--active-text-color是激活状态时菜单颜色,这个参数可以去官网查看对应-->
                <!--unique-opened(布尔)是否只展开一个菜单其它折叠,这个参数可以去官网查看对应-->
                <!--collapse 是否折叠属性-->
                <!--collapse-transition 取消折叠动画-->
                <!--router是否把菜单中的:index的参数变为路由地址,此处把二级菜单:index变路由跳转-->
                <!--active-text-color:当前激活菜单的文字颜色-->
                <el-menu class="home-side-menu"
                         active-text-color="#409EFF" :unique-opened="true"
                         :collapse="isCollapse" :collapse-transition="false"
                         :router="true" :active-text-color="defaultSideButtonValue">
                    <!--一级菜单区域-->
                    <!--index参数接收的是一个字符串,所以需要通过拼接把数值变成字符串-->
                    <el-submenu  class="itemSide"
                            :index="item.id + ''" v-for="(item,index) in sideList" :key="item.id">
                        <!--一级菜单图标及文本-->
                        <template slot="title">
                            <!--绑定自己的图标-->
                            <i :class="iconsObj[item.id]"></i>
                            <!--一文本-->
                            <span>{{item.authName}}</span>
                        </template>
                        <!--二级菜单区域-->
                        <!--二级菜单的遍历-->
                        <el-menu-item :index="subItem.path"
                                      class="itemSideSecond"
                                      v-for="subItem in item.children" :key="subItem.id" @click="activeSideButton(subItem.path)">
                            <!--二级菜单图标及文本-->
                            <template slot="title">
                                <!--图标-->
                                <!--不同图标对应不同class,可以去官网查看-->
                                <i class="el-icon-menu"></i>
                                <!--一文本-->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>

            </el-aside>
            <!--主要内容布局-->
            <el-main class="home-main" >
                <!--为home的子路由占位-->
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    // 导入网络请求
    // 获取侧面栏网络请求函数
    import {getSidePageData} from 'network/home'
  export default {
    name: "Home",
    data() {
      return {
        // 侧边菜单栏数据
        sideList: [],
        // 图标对应侧边菜单的icon图标
        iconsObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao',

        },
        // 侧菜单栏是否折叠
        isCollapse: false,
        // 默认高亮的侧边栏案件
        defaultSideButtonValue: ''
      }
    },
    methods:{
      // 1.网络请求
      getSidePageData(){
        getSidePageData().then(res => {
          if(res.meta.status != 200) return this.$message.error('获取菜单栏数据失败')
          this.sideList = res.data
        })
      },
      // 2.事件监听
      // 登出
      logout () {
        // 清空浏览器缓存
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // 折叠功能
      changeCollapse() {
        // 取反
        this.isCollapse = !this.isCollapse
      },
      // 点击侧边栏高亮
      activeSideButton(path) {
        const sidePath = '/' + path
        // 存入缓存中,保证刷新的的时候效果还在
        window.sessionStorage.setItem('activePath', sidePath)
        this.defaultSideButtonValue = sidePath
      }

    },
    // 挂载前执行
    created() {
      // 获取侧面菜单栏数据
      this.getSidePageData()
      // 查看是否有激活的侧边栏按钮
      this.defaultSideButtonValue = window.sessionStorage.activePath
    }
  }
</script>

<style scoped>
    .home-container {
        height: 100%;
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

    /*设置侧边栏样式*/
    /*去除el-menu多余样式*/
    .el-menu {
        border-right: none;
    }

    /*设置侧边栏每个item的间隔*/
    .home-side .itemSide {
        margin-top: 10px;
        text-align: left;
    }

    /*设定侧边栏图标之间的间距*/
    .home-side .iconfont {
        margin-right: 5px;
    }

    /*折叠按钮处理*/
    .coll-btn {
        text-align: center;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        background-color: #4a5064;
        cursor: pointer;
    }

    .home-main {
        background-color: #eaedf1;
    }

</style>
