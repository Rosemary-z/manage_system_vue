<template>
  <el-container class="home-box">
    <!-- 头部区域 -->
    <el-header>
      <div class="home-header">
        <h2>
          <span class="user-avater"><img src="../assets/logo.png" alt="" /></span>
          <span>电商后台管理系统</span>
        </h2>
        <div class="login-box">
          <span>您好：{{ userInfo.username }}</span>
          <el-button type="info" class="login-btn" size="small" @click="signOut"
            >退出登录</el-button
          >
        </div>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <Aside></Aside>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <Main>
          <router-view></router-view>
        </Main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "./aside/Aside";
import Main from "../components/main/Main";
export default {
  components: {
    Aside,
    Main,
  },
  data() {
    return {
      userInfo: {
        username: "",
      },
    };
  },
  created() {
    this.userInfo.username = sessionStorage.getItem("username");
  },
  methods: {
    signOut() {
      // 销毁本地的token并返回登录页面
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
  // watch: {
  //   $route(to, from) {
  //     const tokenStr = window.sessionStorage.getItem("token");
  //     // console.log("to", to);
  //     // console.log("from", from);
  //     // console.log(from.path);
  //     if (to.path === "/login" && tokenStr) {
  //       window.sessionStorage.clear();
  //       this.$router.push(from.path);
  //     }
  //   },
  // },
};
</script>

<style lang="less" scoped>
.home-box {
  height: 100%;
  // 头部固定区域
  .el-header {
    background: #373d41;
    .home-header {
      display: flex;
      justify-content: space-between;
      color: #fff;
      h2 {
        font-size: 20px;
        display: flex;
        align-items: center;
        margin-left: 20px;
        .user-avater {
          display: inline-block;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          background: #fff;
          margin-right: 20px;
          img {
            height: 60px;
          }
        }
      }
      .login-box {
        display: flex;
        align-items: center;
        margin-right: 20px;
        button {
          margin-left: 20px;
        }
      }
    }
  }
  // 侧边栏部分
  .el-aside {
    background: #373d41;
    color: #fff;
  }
  // 主体区域
  .el-main {
    background: #eaedf1;
  }
}
</style>
