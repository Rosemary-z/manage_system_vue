<template>
  <div>
    <!-- 头部层级导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 中部内容卡片区域 -->
    <el-card class="box-card">
      <!-- 头部搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 头部搜索框 -->
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              class="input-with-select"
              clearable
              @clear="getGoodsList"
            >
              <!-- 添加商品按钮 -->
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getGoodsList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" stripe border style="width: 100%">
        <el-table-column type="index" width="40" label="#"></el-table-column>
        <el-table-column prop="goods_name" width="600" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          width="100"
          label="商品价格(元)"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          width="100"
          label="商品重量"
        ></el-table-column>
        <el-table-column prop="upd_time" width="100" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodsById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页器 -->
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        background
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        // 获取用户列表携带的参数对象
        pagenum: 1, // 当前页
        pagesize: 10, // 每页显示条数
      },
      total: 0, // 总共的商品数量
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      let { data: res } = await this.$http.get("goods", { params: this.queryInfo });
      if (res.meta.status != 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(currentSize) {
      // size-change函数触发一个回调函数，拿到新的每页显示的条数值
      // 赋值  重新获取数据，渲染页面
      this.queryInfo.pagesize = currentSize;
      this.getGoodsList();
    },
    handleCurrentChange(currentPage) {
      // 拿到最新的当前页信息，重新获取数据，渲染页面
      this.queryInfo.pagenum = currentPage;
      this.getGoodsList();
    },
    async removeGoodsById(goods_id) {
      // 删除商品
      const removeRes = await this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (removeRes != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(`goods/${goods_id}`);
      console.log("触发删除之后拿到的返回数据", res);
      if (res.meta.status != 200) {
        this.$message.error("删除失败");
      }
      this.$message.success("删除商品操作成功");
      this.getGoodsList();
    },
    addGoods() {
      // 添加商品
      this.$router.push("/addgoods");
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.level1 {
  border-bottom: 1px solid #eeeeee;
}
.firstChild {
  border-top: 1px solid #eeeeee;
}
.vtcenter {
  display: flex;
  align-items: center;
}
</style>
