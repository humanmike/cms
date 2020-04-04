<template>
    <div id="goods-container">
        <!--顶部面包屑导航装饰-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--中间内容使用el-card布局-->
        <el-card>
            <!--el-card头部搜索和添加商品功能-->
            <el-row class="header-search">
                <el-input clearable v-model="goodsQueryInfo.query" placeholder="请输入查询内容" @clear="getGoodsListApi" />
                <el-button type="primary" @click="getGoodsListApi">查询</el-button>
                <el-button type="primary" @click="goAddGoodPageFunc">添加商品</el-button>
            </el-row>
            <!--el-table装载主要内容-->
            <el-table :data="goodsTableList" border>
                <el-table-column type="index" label="#" width="80"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
                <el-table-column label="创建时间" width="120">
                    <template slot-scope="scope">
                        <!--filters格式化时间参数-->
                        <span>{{scope.row.add_time | showTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="primary">编辑</el-button>
                        <el-button type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--底部分页-->
            <el-pagination @size-change="pageHandleSizeChange"
                    @current-change="pageHandleCurrentChange"
                    :current-page="goodsQueryInfo.pagenum"
                    :page-sizes="[3, 5, 7, 10]"
                    :page-size="goodsQueryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="goodsTotal">
            </el-pagination>
        </el-card>
    </div>

</template>

<script>
    // 导入网络请求
    import {
      getGoodsListApi,
    }
    from 'network/goods'
  export default {
    name: "Goods",
    data() {
      return {
        // 获取商品列表数据必传参数
        goodsQueryInfo: {
          // 查询参数
          query: '',
          // 当前页码
          pagenum: 1,
          // 每页展示条数
          pagesize: 10,
        },
        // 商品列表总条数
        goodsTotal: 0,
        // 商品存放列表
        goodsTableList: [],
      }
    },
    filters: {
      // 过滤时间
      showTime(date) {
        let newDate = new Date(date);
        let y = newDate.getFullYear();
        let MM = newDate.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = newDate.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + MM + '-' + d
      }
    },
    methods: {
      // 1.网络请求
      getGoodsListApi() {
        getGoodsListApi(this.goodsQueryInfo).then(res => {
          if (res.meta.status != 200) return this.$message.error('获取商品列表数据失败')
          // 获取商品列表
          this.goodsTableList = res.data.goods
          // 获取商品总数
          this.goodsTotal = res.data.total
        })
      },
      // 2.事件监听
      // 监听每页展示总数变化函数
      pageHandleSizeChange(newSize) {
        // 获取新的每页展示总数
        this.goodsQueryInfo.pagesize = newSize
        // 重新发起请求
        this.getGoodsListApi()
      },
      // 监听当前页码变化函数
      pageHandleCurrentChange(newNum) {
        // 获取新的当前页
        this.goodsQueryInfo.pagenum = newNum
        // 重新发起请求
        this.getGoodsListApi()
      },
      // 跳转添加商品函数
      goAddGoodPageFunc() {
        this.$router.push('/goods/add')
      }
    },
    created() {
      this.getGoodsListApi()
    }
  }
</script>

<style scoped>
    .header-search .el-input {
        width: 400px;
    }
    .header-search .el-button {
        margin-left: 10px;
    }

    .el-table {
        margin-top: 10px;
    }
</style>
