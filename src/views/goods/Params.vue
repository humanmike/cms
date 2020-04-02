<template>
    <!--分类参数页面-->
    <div id="params-contiainer">
        <!--顶部面包屑导航-->
        <!--顶部面包屑导航装饰-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!--中间内容使用el-card布局-->
        <el-card>
            <!--警告提示文字-->
            <el-row>
                <el-alert class="title-tips" title="警告提示的文案" type="warning" show-icon :closable="false"></el-alert>
            </el-row>

            <!--卡片顶部查询项-->
            <el-row>
                <span class="title-desc">商品分类:</span>
                <!--级联选择器Cascader填充查询内容-->
                <!--:options规则-->
                <el-cascader v-model="cascdetSelectList" :options="cateTableList"
                        :props="cascSelectProps"
                        @change="cascHandleChangeFunc"></el-cascader>
            </el-row>

            <!--标签页el-tags-->
            <!--v-model可以获取当点击标签页的时候获取el-tab-pane的name值-->
            <el-tabs v-model="elTagsActiveName" @tab-click="elTagsHandleClickFunc">
                <!--动态页-->
                <el-tab-pane label="动态参数" name="many">
                    <!--showAddButtonType计算属性根据该值判断添加参数按钮是否可点击-->
                    <el-button type="primary" size="mini" :disabled="showAddButtonType" @click="showAddParamsDialogFunc">添加参数</el-button>
                    <!--table标签渲染动态列表内容-->
                    <el-table :data="manyTableList" border>
                        <el-table-column type="expand" width="100">
                            <!--渲染额外添加栏内容-->
                            <template slot-scope="scope">
                                <el-tag closable class="expand-tag-cls" type="primary" v-for="(item, index) in scope.row.attr_vals" :key="index">
                                    {{item}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="showChangeParamsDialogFunc(scope.row)">编辑</el-button>
                                <el-button type="danger" @click="deleteParamsFunc(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!--静态页-->
                <el-tab-pane label="静态属性" name="only">
                    <!--showAddButtonType计算属性根据该值判断添加参数按钮是否可点击-->
                    <el-button type="primary" size="mini" :disabled="showAddButtonType" @click="showAddParamsDialogFunc">添加参数</el-button>
                    <!--table标签渲染静态列表内容-->
                    <el-table :data="onlyTableList" border>
                        <el-table-column type="expand" width="100">
                            <!--渲染额外添加栏内容-->
                            <template slot-scope="scope">
                                <el-tag closable class="expand-tag-cls" type="primary" v-for="(item, index) in scope.row.attr_vals" :key="index">
                                    {{item}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="showChangeParamsDialogFunc(scope.row)">编辑</el-button>
                                <el-button type="danger" @click="deleteParamsFunc(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!--添加动静态参数dialog框-->
        <el-dialog :title="'添加'+ showDialogTitle" :visible.sync="addDialogVisible" @close="clearAddDialogFunc">
            <el-form ref="addParamsFormRef" :model="addParamsForm" :rules="addParamsFormRules">
                <el-form-item label="参数名称" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="addParamsFunc">确 定</el-button>
          </span>
        </el-dialog>

        <!--编辑动静态dialog框-->
        <el-dialog :title="'编辑'+ showDialogTitle" :visible.sync="changeDialogVisible" @close="clearchangeDialogFunc">
            <el-form ref="changeParamsFormRef" :model="changeParamsForm" :rules="changeParamsFormRules">
                <el-form-item label="参数名称" prop="attr_name">
                    <el-input v-model="changeParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="changeDialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="changeParamsFunc">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>

<script>
    // 导入网络请求
    import {
      getCategoriesApi,
      getParamsStateApi,
      addParamsStateApi,
      changeParamsStateApi,
      deleteParamsStateApi,
    } from 'network/params'
  export default {
    name: "Params",
    data() {
      return {
        // 级联选择其双向绑定数据数组
        cascdetSelectList: [],
        // 渲染商品分类菜单
        cateTableList: [],
        // 级联菜单渲染规则
        cascSelectProps: {
          label: 'cat_name',
          value: 'cat_id',
          childeren: 'children',
          expandTrigger: 'hover'
        },
        // 选中标签页的的name存放位置
        elTagsActiveName: 'many',
        // 动态参数列表存放
        manyTableList: [],
        // 静态参数列表存放
        onlyTableList: [],
        // 是否展示添加动静态diaLog框
        addDialogVisible: false,
        // 添加动静态分类属性的双向绑定数据源
        addParamsForm: {
          attr_name: '',
        },
        // 添加动静态分类属性的双向绑定数据源校验规则
        addParamsFormRules: {
          attr_name: [
            { required: true, message: '请输入参数', trigger: 'blur' },
          ]
        },
        // 是否展示编辑动静态diaLog框
        changeDialogVisible: false,
        // 编辑动静态分类属性的双向绑定数据源
        changeParamsForm: {},
        // 编辑动静态分类属性的双向绑定数据源校验规则
        changeParamsFormRules: {
          attr_name: [
            { required: true, message: '请输入参数', trigger: 'blur' },
          ]
        },
      }
    },
    computed: {
      // 根据该值判断添加参数按钮是否可点击
      showAddButtonType() {
        if (this.cascdetSelectList.length >= 3) return false
        return true
      },
      // 添加动静态参数diaLog框名称
      showDialogTitle() {
        if (this.elTagsActiveName == 'many') {
          return '动态参数'
        }else {
          return '静态参数'
        }
      },
    },
    methods: {
      // 1.网络请求
      // 获取级联菜单多级商品分类信息Api
      getCategoriesApi() {
        getCategoriesApi().then(res => {
          if (res.meta.status != 200) return this.$message.error('获取多级商品分类信息失败')
          // 获取级联菜单信息
          this.cateTableList = res.data
        })
      },
      // 获取动静态参数列表Api
      getParamsStateApi() {
        // 获取三级菜单id
        const threeId = this.cascdetSelectList[this.cascdetSelectList.length-1]
        // 获取动态或者静态参数
        const sel = {
          sel: this.elTagsActiveName
        }
        getParamsStateApi(threeId, sel).then(res => {
          if (res.meta.status != 200) return this.$message.error('获取动静态数据失败')
          // 判断下获取的到底是静态还是动态数据
          if (this.elTagsActiveName == 'only') {
            // 静态数据存放
            this.onlyTableList = res.data
            console.log(this.onlyTableList);
            // 把拓展列的attv_vals内容改变为数组
            this.onlyTableList.forEach(n => {
              return n.attr_vals =n.attr_vals.split(',')
            })
          }else {
            // 动态数据存放
            this.manyTableList = res.data
            // 把拓展列的attv_vals内容改变为数组
            this.manyTableList.forEach(n => {
              return n.attr_vals =n.attr_vals.split(',')
            })
          }
        })
      },
      // 添加动静态父参数Api
      addParamsStateApi() {
        // 拼接添加值
        // 必传id值
        const threeId = this.cascdetSelectList[this.cascdetSelectList.length-1]
        // attr_name:新参数的值
        // attr_sel:具体是动态还是静态
        const attrForm = {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.elTagsActiveName,
        }
        addParamsStateApi(threeId, attrForm).then(res => {
          if (res.meta.status != 201) return this.$message.error('添加动静态参数失败')
          // 刷新页面
          this.getParamsStateApi()
          // 关闭dialog框
          this.addDialogVisible = false
          // 返回成功提示
          this.$message.success('添加动静态参数成功')
        })
      },
      // 编辑动静态父参数Api
      changeParamsStateApi() {
        // 拼接添加值
        // 必传id值
        const threeId = this.cascdetSelectList[this.cascdetSelectList.length-1]
        const attrId = this.changeParamsForm.attr_id
        // attr_name:新参数的值
        // attr_sel:具体是动态还是静态
        const attrForm = {
              attr_name: this.changeParamsForm.attr_name,
              attr_sel: this.elTagsActiveName,
        }
        changeParamsStateApi(threeId, attrId, attrForm).then(res => {
          if (res.meta.status != 200) return this.$message.error('编辑动静态参数失败')
          // 刷新页面
          this.getParamsStateApi()
          // 关闭dialog框
          this.changeDialogVisible = false
          // 返回成功提示
          this.$message.success('编辑动静态参数成功')
        })
      },
      // 删除动静态父参数Api
      deleteParamsStateApi(form) {
        // attr_id三级id,cat_id是当前三级id下参数的id
        const {attr_id, cat_id} = form
        const attrForm = {
          attr_sel: this.elTagsActiveName,
        }
        deleteParamsStateApi(cat_id, attr_id, attrForm).then(res => {
          if (res.meta.status != 200) return this.$message.error('删除动静态父参数失败')
          // 刷新页面
          this.getParamsStateApi()
          // 返回成功提示
          this.$message.success('删除动静态父参数成功')
        })
      },
      // 2.事件监听
      // 监听级联菜单选择的改变函数
      cascHandleChangeFunc() {
        // 因为业务规则的原因,此处只能选择三级菜单,所以需要判断下长度做处理
        if (this.cascdetSelectList.length < 3) {
          // 长度不足3直接清空数组
          this.cascdetSelectList = []
          this.onlyTableLikst = []
          this.manyTableLikst = []
        }
        // 如果长度等于3选中的同时发送获取其对应的数据
        this.getParamsStateApi()
      },
      // 监听标签页切换函数
      elTagsHandleClickFunc() {
        // 标签页切换的时候对应的去获取其对应动静态数据
        this.getParamsStateApi()
      },
      // 显示添加参数DiaLog框函数
      showAddParamsDialogFunc() {
        this.addDialogVisible = true
      },
      // 清空添加动静态参数dialog框函数
      clearAddDialogFunc() {
        // 清空数据
        this.$refs.addParamsFormRef.resetFields()
      },
      // 添加动静态参数到服务器
      addParamsFunc() {
        this.$refs.addParamsFormRef.validate(vali => {
          if(!vali) return this.$message.error('参数名称填写有误')
            this.addParamsStateApi()
        })
      },
      // 清空编辑动静态参数dialog框函数
      clearchangeDialogFunc() {
        this.$refs.changeParamsFormRef.resetFields()

      },
      // 展示编辑动静态参数dialog框函数
      showChangeParamsDialogFunc(row) {
        // 展示编辑dialog框页面
        this.changeDialogVisible = true
        // 把从编辑的作用域插槽数据给到编辑的form表单
        this.changeParamsForm = row
      },
      // 编辑动静态参数到服务器
      changeParamsFunc() {
        this.$refs.changeParamsFormRef.validate(vali => {
          if(!vali) return this.$message.error('编辑参数信息填写有误,请重新填写')
          this.changeParamsStateApi()
        })
      },
      // 删除动静态参数到服务器
      deleteParamsFunc(row) {
        this.$confirm('此操作将永久删除该三级菜单的父类参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(successRep => {
          this.deleteParamsStateApi(row)
        }).catch(errRep => {
          return this.$message.info('取消删除动静态父参数成功')
        })
      }
    },
    created() {
      // 发送获取级联菜单多级商品分类信息Api
      this.getCategoriesApi()
    }
  }
</script>

<style scoped>
    .title-tips {
        margin-bottom: 10px;
    }

    .title-desc {
        font-size: 10px;
        margin-right: 5px;
    }

    .expand-tag-cls {
        margin-right: 10px;
    }
</style>
