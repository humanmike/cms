<template>
    <div id="category-container">
        <!--顶部面包屑导航装饰-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!--中间内容使用el-card布局-->
        <el-card class="box-card">
            <!--使用el-row行来分割布局上面的button-->
            <el-row class="cate-btn-cls">
                <el-button type="primary" @click="showCateDialogFunc">添加分类</el-button>
            </el-row>
            <!--主要内容,使用第三方插件,树状table表格来填充-->
            <!--树table插件表格-->
            <!--:data接收的数据源-->
            <!--:columns接收是一个数组,数组中的每个对象对应每列展示的限制
            label展示的名字, prop会根据里面的值去递归整个列表,然后找出对应的值得,分级对应的显示出来
            type将当前列定义为模板列(这个template值为写死) template当前这一列指定的模板名称-->
            <!--selection-type 是否为多选类型表格(布尔值)-->
            <!--expand-type 是否为展开类型表格(布尔值)-->
            <!--show-index自动添加索引列(布尔值)-->
            <!--index-text自定义索引列名称String-->
            <!--border添加纵向边框线-->
            <!--:change-on-select 是可以选择父级菜单的选择器,但官方已经没有推荐,仍然可以使用-->
            <tree-table :selection-type="false"  :expand-type="false" show-index border
                        :data="cateTableList" :columns="cateTreeTableColumns">

                <!--是否有效列-->
                <template slot="isok" slot-scope="scope">
                    <i v-if="scope.row.cat_deleted" class="el-icon-error" style="color: red;"></i>
                    <i v-else class="el-icon-success" style="color: green;"></i>
                </template>

                <!--排序列-->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level === 1" type="warning">二级</el-tag>
                    <el-tag v-else type="danger">三级</el-tag>
                </template>

                <!--操作列-->
                <template slot="opt">
                    <el-button type="primary" size="mini">编辑</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                </template>
            </tree-table>

            <!--分页显示-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="cateQueryInfo.pagenum"
                    :page-sizes="[3, 5, 7, 10]"
                    :page-size="cateQueryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="cateTotal">
            </el-pagination>
        </el-card>

        <!--添加分类dialog框-->
        <el-dialog title="添加分类" :visible.sync="showCateDialogVisible" @close="clearDialogForm">
            <!--form表单用来展示用户需要修改的添加分类-->
            <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules">
                <!--用户分类Input框-->
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <!--用户分类菜单类型使用Cascader级联菜单-->
                <!--:options具体数据源-->
                <!--:value双向绑定数据,因为是多级菜单,这里需要绑定一个数组-->
                <!--:props数据渲染规则 value代表最后选择的值,label用户看到的值,childeren具体渲染的父下面的子菜单-->
                <!--:clearable 是否支持清空-->
                <!--change监听选中节点的变化-->
                <!--:change-on-select 是可以选择父级菜单的选择器,但官方已经没有推荐,仍然可以使用-->
                <!--在关闭分类dialog框的时候记得,清空所有的数据,保证用户下次进入仍为初始状态-->
                <!--(注意:这里服务器有个bug,只有添加父级标签才可以成功,和前端代码无关)-->
                <el-cascader
                        clearable
                        v-model="cascSelectList"
                        :options="cateTableParentList"
                        expandTrigger="hover"
                        :props="cascSelectProps" @change="cascHandleChange"></el-cascader>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateFunc">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    // 导入网络请求
    import {
      getCategoriesApi,
      addCategoriesApi,
    } from 'network/category'

  export default {
    name: "Category",
    data() {
      return {
        // 获取商品分类列表所需传参
        cateQueryInfo: {
          // 查询的分类的级别,3级代表查询全部级别菜单
          type: 3,
          // 当前的查询的分页数
          pagenum: 1,
          // 每次需要返回多少条数据
          pagesize: 5,
        },
        // 商品分类列表数据存放
        cateTableList: [],
        // 商品分类的总数
        cateTotal: 0,
        // 树状table展示规则
        cateTreeTableColumns: [
            // 第一列分类名称展示规则
          {
            // 展示列的名称
            label: '分类名称',
            // 会根据里面的值去递归整个列表,然后找出对应的值得,分级对应的显示出来
            prop: 'cat_name',
            width: '120px'
          },
          // 第二列为是否有效展示规则
          {
            label: '是否有效',
            //  type将当前列定义为模板列(这个template值为写死)
            type: 'template',
            // template当前这一列指定的模板名称
            template: 'isok',
            width: '120px'
          },
          // 第三列为是否有效展示规则
          {
            label: '排序',
            //  type将当前列定义为模板列(这个template值为写死)
            type: 'template',
            // template当前这一列指定的模板名称
            template: 'order',
            width: '120px'
          },
          {
            label: '操作',
            //  type将当前列定义为模板列(这个template值为写死)
            type: 'template',
            // template当前这一列指定的模板名称
            template: 'opt',
            width: '120px'
          },

        ],
        // 是否显示dialog框
        showCateDialogVisible: false,
        // 添加分类表单
        addCateForm: {
          // 分类名称
          cat_name: '',
          // 分类的等级,默认要添加是1级分类
          cat_level: 0,
          // 分类id
          cat_pid: 0,
        },
        // 添加分类校验规则
        addCateFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur' },
          ]
        },
        // 父级分类列表
        cateTableParentList: [],
        // casc级联菜单双向绑定的数组
        cascSelectList: [],
        // 级联菜单展示规则
        cascSelectProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
          // 选择任意一级选项(没有父子之分)
          multiple: true,
          checkStrictly: true
        },

      }

    },
    methods: {
      // 1.网络请求
      // 获取商品分类列表Api
      getCategoriesApi() {
        getCategoriesApi(this.cateQueryInfo).then(res => {
          if (res.meta.status != 200) return this.$message.error('获取商品分类信息失败')
          this.cateTableList = res.data.result
          this.cateTotal = res.data.total
        })
      },
      // 获取父级分类列表Api
      getCategoriesParentApi() {
        // 查询的分类的级别,2级代表查询只查询父级菜单
        const cateQueryInfo = {type: 2}
        getCategoriesApi(cateQueryInfo).then(res => {
          if (res.meta.status != 200) return this.$message.error('获取父级分类列表信息失败')
          this.cateTableParentList = res.data
        })
      },
      // 添加分类Api
      addCategoriesApi() {
        addCategoriesApi(this.addCateForm).then(res => {
          if (res.meta.status != 201) return this.$message.error('添加分类失败')
          // 关闭dialog框
          this.showCateDialogVisible = false
          // 刷新数据
          this.getCategoriesApi()
          // 弹出提示
          return this.$message.success('添加分类成功')
        })
      },
      // 2.事件监听
      // 监听每页展示条数展示的变化
      handleSizeChange(newSize) {
        // 每页展示条数的变化修改
        this.cateQueryInfo.pagesize = newSize
        // 重新发起请求
        this.getCategoriesApi()
      },
      // 监听当前页变化
      handleCurrentChange(newNum) {
        // 页码变化
        this.cateQueryInfo.pagenum = newNum
        // 重新发起请求
        this.getCategoriesApi()

      },
      // 是否显示添加分类dialog函数
      showCateDialogFunc() {
        // 获取父级分类菜单
        this.getCategoriesParentApi()
        this.showCateDialogVisible = true
      },
      // 监听级联选择器改变
      cascHandleChange() {
        if (this.cascSelectList.length > 0) {
          this.addCateForm.cat_pid = this.cascSelectList[this.addCateForm.length-1]
          this.addCateForm.cat_level = this.addCateForm.length
        }else {
          this.addCateForm.cat_level = 0
          this.addCateForm.cat_pid = 0
        }
      },
      // 监听用户关闭dialog清空数据
      clearDialogForm() {
        // 清空input框数据
        this.$refs.addCateFormRef.resetFields()
        // 清空级联数组
        this.cascSelectList = []
        // 恢复数据原本值
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      },
      // 关闭dialog清空数据
      // 确定添加分类函数
      addCateFunc() {
        // 校验下前端规则
        this.$refs.addCateFormRef.validate(vali => {
          if (!vali) return this.$message.error('添加分类信息填写有误,请重新填写')
          this.addCategoriesApi()
        })
      }
    },
    created() {
      // 获取商品分类数据
      this.getCategoriesApi()
    }
  }
</script>

<style scoped>
    .cate-btn-cls {
        margin-bottom: 5px;
    }

    .el-cascader {
        width: 100%;
    }
</style>
