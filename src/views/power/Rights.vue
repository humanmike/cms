<template>
    <div id="rights-container">
        <!--面包屑功能-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片容器-->
        <el-card class="box-card">
            <!--el-table表格填充权限列表内容-->
            <!--:data渲染数据源获取-->
            <el-table :data="rightsTableList" border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import {getRightsListApi} from 'network/power'
  export default {
    name: "Rights",
    data() {
      return {
        // 权限列表数据存放
        rightsTableList: []
      }
    },
    methods: {
      // 1.网络请求
      // 获取权限列表数据
      getRightsListApi() {
        getRightsListApi().then(res => {
          if (res.meta.status != 200) return this.$message.error('获取权限列表数据失败')
          // 存放数据列表
          this.rightsTableList = res.data
        })
      }
    },
    created() {
      // 发送权限列表数据
      this.getRightsListApi()
    }
  }
</script>

<style scoped>

</style>
