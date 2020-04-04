<template>
    <div id="add-good-container">
        <!--顶部面包屑导航装饰-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!--中间内容使用el-card布局-->
        <el-card>
            <!--卡片顶部内容-->
            <el-row>
                <!--卡片顶部文字警告内容-->
                <el-alert title="添加商品信息" type="info" closable center show-icon></el-alert>
                <!--卡片顶部步骤条el-steps内容-->
                <!--active接收一个number,根据该索引来显示对应el-step-->
                <el-steps align-center class="add-good-steps-cls" :active="activeValueIndex - 0" finish-status="success">
                    <el-step title="基本信息"></el-step>
                    <el-step title="商品参数"></el-step>
                    <el-step title="商品属性"></el-step>
                    <el-step title="商品图片"></el-step>
                    <el-step title="商品内容"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
            </el-row>
            <!--使用form表单来包裹内容,保证其内容可以得到验证-->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
                <!--使用标签页el-tabs来包裹主要内容-->
                <!--tab-position标签页的具体显示位置-->
                <!--v-model和步骤条绑定同一索引值保证两者可以联动-->
                <!--before-leave接收一个函数判断条件是否满足可以离开当前标签页,通过返回布尔值来切换,会自动传来两个值:activeName(即将进入的标签),,oldActiveName(即将离开的标签)-->
                <!--tab-click事件,监听标签页切换-->
                <el-tabs class="add-good-tabs-cls" tab-position="left" :before-leave="tabsBeforeLeaveFunc"
                         @tab-click="listenTabClickFunc" v-model="activeValueIndex">

                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>

                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>

                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>

                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>

                        <!--商品分类级联菜单-->
                        <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateTableList"
                                :props="cascSelectProps"
                                @change="cascHandleChange"></el-cascader>
                    </el-tab-pane>

                    <el-tab-pane label="商品参数" name="1">
                        <!--遍历动态数据数组-->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableList" :key="item.attr_id">
                            <!--使用复选框el-checkbox来添加三级菜单子参数列表-->
                            <!--v-model直接绑定添加的表单manyTableList数组的item的attr_vals数组随时修改-->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="iitem" v-for="(iitem,index) in item.attr_vals" :key="index">
                                    {{iitem}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品属性" name="2">
                        <!--遍历静态数据数组-->
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableList" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品图片" name="3">
                        <!--上传图片组件el-upload-->
                        <!--action指定上传的url-->
                        <!--on-preview监听点击图片浏览触发函数-->
                        <!--on-remove监听浏览图片删除后函数,该函数在删除的时候可以会传递一个参数获得该图片对象-->
                        <!--on-success监听上传到服务器之后的回掉函数,会返回一个rep对象参数-->
                        <!--list-type浏览图片的展示方式-->
                        <!--headers:需要一个对象指定上传时的请求头内容,因为他是走自己的的ajax-->
                        <el-upload
                                :action="uploadUrl"
                                :headers="uploadHeaders"
                                :on-success="uploadHandleSuccess"
                                :on-remove="uploadHandleRemove"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>

                    <el-tab-pane label="商品内容" name="4">
                        <!--提交添加商品表单-->
                        <el-button class="add-btn-cls" type="primary" @click="submitAddFormFunc">提交商品</el-button>
                        <!--使用quill-editor第三方富文本编辑器库-->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    // 导入网络请求
    import {
      getCategoriesApi,
      getParamsDynamicStateApi,
      getParamsStaticStateApi,
      addGoodsApi,
    } from 'network/addGood'

    // 导入辅助函数
    import _ from 'lodash'
  export default {
    name: "AddGood",
    data() {
      return {
        // 激活步骤条索引
        activeValueIndex: '0',
        // 商品分类列表
        cateTableList: [],
        // 动态参数列表存放
        manyTableList: [],
        // 静态参数列表存放
        onlyTableList: [],
        // 添加商品表单
        addForm: {
          // 商品名称
          goods_name: '',
          // 商品价格
          goods_price: '',
          // 商品重量
          goods_weight: '',
          // 选择的三级分类列表id,最后传递给服务器需要转回字符串
          goods_cat: [],
          // 商品数量
          goods_number: '',
          // 商品介绍
          goods_introduce: '',
          // 图片临时存放数组
          pics: [],
        },
        // 添加三级商品表单校验规则
        addFormRules: {
          // 商品名称校验规则
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          // 商品价格规则
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'blur' },
          ],
          // 商品重量规则
          goods_weight: [
            {required: true, message: '请输入商品重量', trigger: 'blur' },
          ],
          // 选择的三级分类列表id规则
          goods_cat: [
            {required: true, message: '请选择分级菜单', trigger: 'blur' },
          ],
          // 商品数量规则
          goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'blur' },
          ],
        },
        // 商品分类级联菜单展示规则
        cascSelectProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
        },
        // 上传地址url
        uploadUrl: 'http://192.168.0.107:8888/api/private/v1/upload',
      }
    },
    computed: {
      // 获取商品分类三级id
      showThreeId() {
        return this.addForm.goods_cat[this.addForm.goods_cat.length-1]
      },
      // 上传图片必传请求偷
      uploadHeaders() {
        return {
          Authorization: window.sessionStorage.token
        }
      }
    },
    methods: {
      // 1.网络请求
      // 获取三级商品分类列表Api
      getCategoriesApi() {
        getCategoriesApi().then(res => {
          if (res.meta.status != 200) return this.$message.error('获取商品分类列表失败')
          // 存储三级分类列表
          this.cateTableList = res.data
        })
      },
      // 获取动态参数列表Api
      getParamsDynamicStateApi() {
        getParamsDynamicStateApi(this.showThreeId).then(res => {
          if (res.meta.status != 200) return this.$message.error('获取商品参数数据失败')
          // 把动态数据的attr_vals全部转换为数组方便遍历
          res.data.forEach(n => {
            // 三元表达式判断如果没有数组直接返回一个空数组
            n.attr_vals = n.attr_vals ? n.attr_vals.split(',') : []
          })
          this.manyTableList = res.data
        })
      },
      // 获取静态参数列表Api
      getParamsStaticStateApi() {
        getParamsStaticStateApi(this.showThreeId).then(res => {
          if (res.meta.status != 200) return this.$message.error('获取商品属性数据失败')
          // 静态数据attr_vals值不多所以不转数组
          this.onlyTableList = res.data
        })
      },
      // 添加商品Api
      addGoodsApi(form) {
        addGoodsApi(form).then(res => {
          if (res.meta.status != 201) return this.$message.error('添加商品失败')
          // 弹出成功提示
          this.$message.success('添加商品成功')
          // 跳转商品列表页
          return this.$router.push('/goods')
        })
      },
      // 2.事件监听
      // 监听级联菜单切换函数
      cascHandleChange() {
        // 判断如果选择的不是三级菜单直接清空
        if (this.addForm.goods_cat.length != 3) {
          this.addForm.goods_cat = []
        }
      },
      // 判断标签页是否满足离开函数
      tabsBeforeLeaveFunc(activeName,oldActiveName) {
        // 根据是否选择三级分类id来判断是否可以离开0级标签页
        if (oldActiveName == '0' && this.addForm.goods_cat.length != 3) {
          // 不满足条件不允许跳转
          this.$message.error('请先选择商品分类菜单')
          return false
        }else {
          return true
        }
      },
      // 监听标签页切换函数
      listenTabClickFunc() {
        switch (this.activeValueIndex) {
          case "1":
            this.getParamsDynamicStateApi()
            break
          case "2":
            this.getParamsStaticStateApi()
            break
        }
      },
      // 监听图片上传成功函数
      uploadHandleSuccess(rep) {
        // 获取需要最后统一上传服务器addForm需要的pics
        const pic = {
          pic: rep.data.tmp_path
        }
        // 把数据添加到addForm pics数组
        this.addForm.pics.push(pic)
        console.log(this.addForm.pics);
      },
      // 监听图片上传后关闭浏览图片函数
      uploadHandleRemove(uploadObj) {
        const deletePath = uploadObj.response.data.tmp_path
        // 通过当前上传对象的tmp_path来查询pics数组中的索引
        const index = this.addForm.pics.findIndex(n => n.pic == deletePath)
        // 删除具体图片
        this.addForm.pics.splice(index, 1)
      },
      // 添加表单数据函数
      submitAddFormFunc() {
        // 提交前验证
        this.$refs.addFormRef.validate(vali => {
          if (!vali) return this.$message.error('添加的表单信息有误,请重新填写')
          // 提交前数据处理
          // 将goods_cat转换为字符串提交
          // 使用深拷贝复制数据
          const newForm = _.cloneDeep(this.addForm)
          // 把数组转换为字符串
          newForm.goods_cat = newForm.goods_cat.join(',')
          // 向服务器提交数据
          this.addGoodsApi(newForm)
        })
      }

    },
    created() {
      // 发送获取商品分类Api
      this.getCategoriesApi()
    }
  }
</script>

<style scoped>
    /*设置步骤条样式*/
    .add-good-steps-cls {
        width: 1000px;
        margin-top: 10px;
        font-size: 10px;
    }

    /*设置标签页样式*/
    .add-good-tabs-cls {
        margin-top: 10px;
    }

    /*设置提交表单按钮样式*/
    .add-btn-cls {
        margin-bottom: 10px;
    }

    /*设置富文本高度*/
    .quill-editor {
        height: 300px;
    }

</style>
