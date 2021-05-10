<template>
  <div>
    <!-- 头部层级导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片区 -->
    <el-card>
      <!-- 信息区 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        align-center
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧标签 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTabData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传组件 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="add" class="addGoodsBtn"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewUrl" alt="" class="previewPic" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash"; // 引入lodash依赖包
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        // 表单对象
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [], // 商品所属分类数组
        pics: [], // 图片信息对象数组
        goods_introduce: "", // 商品描述
        attrs: [], // 添加商品之后的动态参数和静态属性的集合
      },
      cateList: [],
      cascaderProps: {
        //级联选择器配置
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      manyTabData: [], //动态列表数据
      onlyTabData: [], //静态列表数据
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload", //图片上传地址
      headerObj: { Authorization: window.sessionStorage.getItem("token") }, // 图片上传组件的headers请求头对象
      addFormRules: {
        goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
        goods_number: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
        goods_cat: [{ required: true, message: "请选择商品分类", trigger: "blur" }],
      },
      previewUrl: "", // 图片预览完整地址
      previewVisible: false, // 图片预览窗口是否打开
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      // 获取商品分类列表
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.cateList = res.data;
    },
    handleChange() {
      // 级联选择器选择发生变化时触发的函数
      console.log(this.addForm.goods_cat);
      //   只允许选中第三级
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      console.log(oldActiveName, activeName);
      // 标签切换触发的事件
      if (oldActiveName == "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false; // 终止一切操作
      }
    },
    async tabClicked() {
      // tab被选中触发的函数
      // 判断访问的是静态还是动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );
        if (res.meta.status !== 200) {
          return this.$Message.error("获取商品参数失败");
        }
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTabData = res.data;
        // console.log("动态商品参数", this.manyTabData);
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态参数失败");
        }
        this.onlyTabData = res.data;
        // console.log("静态商品参数", this.onlyTabData);
      }
    },
    handlePreview(file) {
      // 处理图片预览效果
      console.log(file);
      this.previewUrl = file.response.data.url;
      this.previewVisible = true;
    },
    handleRemove(imgFile) {
      // 处理移出图片效果
      //   1. 拿到即将移除的图片路径
      const filePath = imgFile.response.data.tmp_path;
      //   2. 找到图片数组pics里面对应的索引
      const index = this.addForm.pics.findIndex((item) => item.pic === filePath);
      //   3. 移除对应的图片
      this.addForm.pics.splice(index, 1);
    },
    handleSuccess(response) {
      // 图片上传成功执行的回调函数
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2. 将图片信息对象push到pics数组
      this.addForm.pics.push(picInfo);
    },
    add() {
      // 富文本编辑页末尾添加商品触发的事件函数
      console.log(this.addForm);
      //   添加商品时触发表单验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项！");
        }
        // 执行添加的业务逻辑
        // 深拷贝数组，避免与级联选择器的-vmodel属性绑定冲突
        const cloneForm = _.cloneDeep(this.addForm);
        // 以逗号分隔，作为字符串返回
        cloneForm.goods_cat = cloneForm.goods_cat.join(",");
        // 处理动态参数
        this.manyTabData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTabData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
        });
        cloneForm.attrs = this.addForm.attrs;
        // console.log("深拷贝过来的form", cloneForm);
        // 发起添加商品请求
        const { data: res } = await this.$http.post("goods", cloneForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败！");
        }
        this.$message.success("添加商品成功!");
        this.$router.push("/goods");
      });
    },
  },
  computed: {
    getCateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
/deep/.el-step__title {
  font-size: 13px;
}
/deep/.el-checkbox {
  margin: 0 10px 0 0;
}
.previewPic {
  width: 100%;
  height: 100%;
}
/deep/.ql-editor {
  height: 300px;
}
.addGoodsBtn {
  margin-top: 15px;
}
</style>
