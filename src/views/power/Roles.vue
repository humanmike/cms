<template>
    <div id="roles-container">
        <!--面包屑功能-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片容器-->
        <!--el-table表格填充角色列表内容-->
        <!--:data渲染数据源获取-->
        <el-table :data="rolesTableList">
            <!--type="expand"拓展列可隐藏-->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row class="expand-first" v-for="item in scope.row.children" :key="item.id">
                        <!--一级菜单存放-->
                        <el-col :span="5">
                            <!--el-tag close事件监听,点击closable关闭事件--->
                            <!--scope.row可以获得当前角色的id, item.id获得具体角色一级权限id-->
                            <el-tag closable type="primary" @close="deleteRolesOptionFunc(scope.row, item.id)">{{item.authName}}</el-tag>
                        </el-col>
                        <!--二三级菜单存放-->
                        <el-col :span="19">
                            <!--二级菜单-->
                            <el-row v-for="iitem in item.children" :key="iitem.id">
                                <el-col :span="6">
                                    <!--scope.row可以获得当前角色的id, item.id获得具体角色二级权限id-->
                                    <el-tag closable type="warning" @close="deleteRolesOptionFunc(scope.row, iitem.id)">{{iitem.authName}}</el-tag>
                                </el-col>
                                <!--三级菜单-->
                                <el-col :span="18">
                                    <!--scope.row可以获得当前角色的id, item.id获得具体角色三级权限id-->
                                    <el-tag @close="deleteRolesOptionFunc(scope.row, iiitem.id)" closable type="info" v-for="iiitem in iitem.children" :key="iiitem.id">{{iiitem.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column prop="date" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary">编辑</el-button>
                    <el-button type="warning">删除</el-button>
                    <el-button type="info" @click="shareRolesFunc(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分配权限dialog框-->
        <el-dialog title="分配权限" :visible.sync="shareRolesDialogVisible">
            <!--el-tree树状结构展示-->
            <!--:data具体数据源,rightsTableTreeList服务器返回树状结构数据-->
            <!--:props渲染规则 label属性:展示的菜单名称(可以从服务器返回数据选个名字) children:具体遍历数据源--->
            <!--node-key每个树节点唯一标识,勾选之后等于获取到了这个id值,必填-->
            <!--show-checkbox可选择框属性,default-expand-all展开所有属性项-->
            <!--default-checked-keys属性:(是一个数组) 默认勾选节点-->
            <el-tree
                    ref="treeRef"
                    node-key="id"
                    :data="rightsTableTreeList" :default-checked-keys="defaultRigthsList"
                    :props="rightsDefaultProps" show-checkbox default-expand-all/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shareRolesDialogVisible = false">取 消</el-button>
                <!--获取用户选择的分配权限值-->
                <el-button type="primary" @click="updateNewRolesFunc">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {
      getRolesListApi,
      deleteRolesRightApi,
      getRightsListTreeApi,
      updateRolesRightApi,
    } from 'network/power'
  export default {
    name: "Roles",
    data() {
      return {
        // 需要修改的角色id
        saveRid: '',
        // 是否展示分配权限dialog框
        shareRolesDialogVisible: false,
        // 角色列表数据存放
        rolesTableList: [],
        // 权限列表树结构数据存放
        rightsTableTreeList: [],
        // 树状结构数据展示规则
        rightsDefaultProps: {
          label: 'authName',
          children: 'children',
        },
        // 默认勾选树状节点列表
        defaultRigthsList: []
      }
    },
    methods: {
      // 1.网络请求
      // 更新权限Api
      updateRolesRightApi(rids) {
        updateRolesRightApi(this.saveRid, rids).then(res => {
          if (res.meta.status != 200) return this.$message.error('更新角色权限失败')
          // 关闭dialog框
          this.shareRolesDialogVisible = false
          // 刷新角色权限数据
          this.getRolesListApi()
          // 弹出对应提示
          return this.$message.success('更新角色权限成功')
        })
      },
      // 获取权限列表数据Api树状结构返回
      getRightsListTreeApi() {
        getRightsListTreeApi().then(res => {
          if (res.meta.status != 200) return this.$message.error('获取权限列表失败')
          this.rightsTableTreeList = res.data
        })
      },
      // 获取角色列表数据
      getRolesListApi() {
        getRolesListApi().then(res => {
          if (res.meta.status != 200) return this.$message.error('获取角色列表数据失败')
          // 获取角色列表
          this.rolesTableList = res.data
        })
      },
      // 删除角色权限
      deleteRolesRightApi(roleFormItem, rid) {
        deleteRolesRightApi(roleFormItem.id, rid).then(res => {
          if (res.meta.status != 200) return this.$message.error('删除角色权限失败')
          // 把roleFormItem.children替换成服务器返回来的res.data里面有新的权限数据
          // 这样可以避免服务器刷新
          roleFormItem.children = res.data
          return this.$message.success('删除角色权限成功')
        })
      },
      // 2.事件监听
      // 监听角色权限关闭函数
      deleteRolesOptionFunc(roleFormItem, rid) {
        // 调用删除角色权限Api
        this.deleteRolesRightApi(roleFormItem, rid)
      },
      // 分配权限函数
      shareRolesFunc(roleItems) {
        // 需要修改的角色id
        this.saveRid = roleItems.id
        // 获取树状权限列表数据
        this.getRightsListTreeApi()
        // 展示分配权限dialog框
        this.shareRolesDialogVisible = true
        this.getRightsKeys(roleItems,this.defaultRigthsList)
      },
      // 更新修改角色最新权限值
      updateNewRolesFunc() {
        // 获取子节点勾选数据
        const sonOptions = this.$refs.treeRef.getCheckedKeys()
        // 获取父节点勾选数据
        const fatherOptions = this.$refs.treeRef.getHalfCheckedKeys()
        // 合并节点列表
        const nodeOptions = [...sonOptions, ...fatherOptions]
        const idStr = nodeOptions.join(',')
        const rids = {rids: idStr}
        // 像服务器发送更新请求
        this.updateRolesRightApi(rids)


      },
      // 3.工具函数
      getRightsKeys(node, arr) {

        // node需要遍历的节点
        // arr存放数组
        // 如果node.children是一个false证明是一个三级节点,那么就获取它的id值
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(n => {
          return this.getRightsKeys(n,arr)
        })
      }
    },
    created() {
      this.getRolesListApi()
    }
  }
</script>

<style scoped>
    .el-breadcrumb {
        margin-bottom: 5px;
    }

    /*为拓展列设置样式-*/
    .expand-first {
        margin-bottom: 4px;
        padding-bottom: 1px;
        border-bottom: 1px solid #eaeaea;
    }
</style>
