<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" size="mini" @click="showAddCateDialog"
        >添加分类</el-button
      >
      <!-- 分类表格 -->
      <tree-table
        :data="tableData"
        :columns="columns"
        tree-type
        stripe
        show-index
        index-text="#"
        border
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 等级排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 编辑 -->
        <template slot="edit" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row.cat_id)"
          ></el-button>
        </template>
      </tree-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog
        title
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <el-form
          ref="addCateFormRef"
          :model="addCateForm"
          label-width="100px"
          :rules="addCateFormRules"
        >
          <!-- 添加分类输入框 -->
          <el-form-item label="添加分类:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <!-- 父级分类（级联选择器） -->
          <el-form-item label="父级分类:" prop="cat_pid">
            <!-- options：数据源 -->
            <!-- props：指定配置对象 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascadarProps"
              @change="parentCateChanged"
              clearable
              filterable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [], //表格绑定的数据数组
      queryInfo: {
        type: 3,
        pagenum: 1, // 当前页码
        pagesize: 5, // 每页显示多少条数据
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 定义当前列为模板列
          type: "template",
          // 表示当前这一列使用的模版名称
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },
        {
          label: "编辑",
          type: "template",
          template: "edit",
        },
      ],
      addCateDialogVisible: false, // 添加分类对话框默认关闭
      addCateForm: {
        cat_name: "",
        cat_pid: "", // 分类父ID
        cat_level: 0, // 分类层级
      }, // 添加分类表单数据对象
      addCateFormRules: {
        cat_name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      parentCateList: [], // 父级分类列表数据
      cascadarProps: {
        // 级联选择器配置项
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [], // 级联选择器选择的id数组
    };
  },
  created() {
    this.getCateList();
  },
  watch: {},
  computed: {},
  methods: {
    //   获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败！");
      }
      this.tableData = res.data.result;
      this.total = res.data.total;
    },
    // 监听 pageSizeChange
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听 pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    async showAddCateDialog() {
      this.addCateDialogVisible = true;
      // 获取父级分类数据列表
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类列表失败！");
      }
      this.parentCateList = res.data;
    },
    parentCateChanged() {
      // 父级分类选择改变时触发的函数
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        // 证明选择了父级
        // 父级id则为数组长度-1
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0;
        // 当前分类的等级
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      // 点击确认，添加分类
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", this.addCateForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }

        this.$message.success("添加分类成功！");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    addCateDialogClosed() {
      // 添加分类对话框关闭事件
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm = {};
      this.addCateDialogVisible = false;
    },
    // 删除分类
    async removeCate(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除商品分类失败！");
      }
      this.$message.success("删除商品分类成功！");
      this.getCateList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
