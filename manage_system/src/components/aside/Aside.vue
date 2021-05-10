<template>
  <div>
    <el-menu
      :default-active="activePath"
      class="el-menu-vertical-demo"
      background-color="#373d41"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <!-- :default-active="activePath" 默认激活的当前父菜单，参数为当前激活的路由路径 -->
      <!-- 一级菜单 -->
      <!-- 用户管理 -->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconObj[item.authName]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
          :index="'/' + itm.path"
          v-for="itm in item.children"
          :key="itm.id"
        >
          <template slot="title">
            <i :class="iconObj[itm.authName]"></i>
            <span>{{ itm.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        用户管理: "el-icon-s-custom",
        用户列表: "el-icon-tickets",
        权限管理: "el-icon-unlock",
        角色列表: "el-icon-notebook-2",
        权限列表: "el-icon-set-up",
        商品管理: "el-icon-s-goods",
        商品列表: "el-icon-menu",
        分类参数: "el-icon-c-scale-to-original",
        商品分类: "el-icon-s-grid",
        订单管理: "el-icon-s-order",
        订单列表: "el-icon-menu",
        数据统计: "el-icon-s-marketing",
        数据报表: "el-icon-s-data",
      },
      activePath: "",
      userList: [],
      rolesList: [],
      routeList: ["home", "login", "homepage"], // 可访问的路由列表
      childRoute: [],
    }
  },

  mounted() {
    // 调用统一封装接口获取菜单列表数据
    this.$request("menus", "get").then((res) => {
      this.menuList = res.data.data
      // 多维数组展开
      // 获取到菜单权限列表后，追加到可访问的路由数组里
      this.unfold(res.data.data)
    })
  },
  updated() {
    // 用户在导航栏切换路由时拿到的当前激活的路由路径
    this.activePath = this.$route.path
  },
  computed: {
    activeTitle() {
      return this.$store.state.index.activeTitle
    },
  },
  watch: {
    $route(newVal, oldVal) {
      // 监听$route这个对象，用户如果访问了无权限路由，则警示
      if (newVal && !this.routeList.includes(newVal.path.slice(1))) {
        this.$message.error("您没有当前页面的访问权限")
        this.$router.push("/home")
      }
    },
  },
  methods: {
    // 点击子菜单选项，拿到path，跳转路由
    jumpTo(path) {
      this.$router.push(path)
    },
    unfold(arr) {
      // 展开多维数组
      arr.forEach((item) => {
        this.routeList.push(item.path)
        if (item.children) {
          this.unfold(item.children)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-menu {
  margin-top: 20px;
  border: none;
}
</style>
