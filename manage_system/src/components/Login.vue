<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="avatar" />
      </div>
      <!-- 登录表单 -->
      <!-- <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="60px"
          class="login_form"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="iconfont icon-user"
              @focus="changeInputStyle"
              ref="inputBox"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              prefix-icon="iconfont icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login" :disabled="loginDisabled"
              >登录</el-button
            >
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form> -->
      <CommonForm
        :inline="inline"
        :formData="formData"
        :label-with="labelWith"
        :formLabel="formLabel"
        :loginForm="loginForm"
        :login="login"
        ref="loginFormRef"
        :loginFormRules="loginFormRules"
      />
    </div>
  </div>
</template>

<script>
import CommonForm from "../components/CommonForm"
export default {
  components: {
    CommonForm,
  },
  data() {
    return {
      inline: true,
      size: "small",
      formData: {},
      labelWith: "100px",
      formLabel: [
        {
          type: "input",
          placeholder: "账号",
          prop: "username",
          inputType: "text",
          prefixIcon: "iconfont icon-user",
          with: "300px",
        },
        {
          type: "input",
          placeholder: "密码",
          prop: "password",
          inputType: "password",
          prefixIcon: "iconfont icon-lock",
          with: "300px",
        },
        {
          type: "button",
          text: "登录",
          styleType: "primary",
          with: "300px",
          handler: () => {
            this.login()
          },
        },
        {
          type: "button",
          text: "重置",
          styleType: "info",
          with: "300px",
        },
      ],
      loginForm: {
        username: "",
        password: "",
      },
      loginDisabled: true,
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "submit" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "submit",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "submit" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "submit",
          },
        ],
      },
      routeList: ["home", "login", "homepage"], // 可访问的路由列表
    }
  },
  watch: {
    loginForm: {
      // 监听登录表单对象，如果对象里面的值都不为空，则解除禁用，反之设置禁用
      handler(newValue) {
        if (newValue.username && newValue.password) {
          this.loginDisabled = false
        } else {
          this.loginDisabled = true
        }
      },
      deep: true,
    },
  },
  methods: {
    // 表单重置按钮
    resetLoginForm() {
      // console.log(this)
      // resetFields：element-ui提供的表单方法
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      console.log(123)
      // 表单预验证
      // valid：bool类型
      console.log(this.$refs.loginFormRef)
      this.$refs.loginFormRef.$refs.form.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return false
        const { data: res } = await this.$request(
          "login",
          "post",
          this.loginForm
        )
        if (res.status === 200) {
          this.$notify({
            title: "成功",
            type: "success",
            message: res.meta.msg,
          })
        }
        // 1、将登陆成功之后的token, 保存到客户端的sessionStorage中; localStorage中是持久化的保存
        //   1.1 项目中出现了登录之外的其他API接口，必须在登陆之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token)
        window.sessionStorage.setItem("username", res.data.username)
        // 2、通过编程式导航跳转到后台主页, 路由地址为：/home
        this.$router.replace("/home")
      })
    },
    changeInputStyle() {
      this.$refs.inputBox.className = "inputBox"
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 360px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 60px;
  margin-top: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}
form {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.btns {
  display: flex;
  justify-content: center;
}
.info {
  font-size: 13px;
  margin: 10px 15px;
}

/deep/.el-input__inner:focus {
  border: 1px solid #41b883;
  // box-shadow: 0px 0px 4px 4px #41b883;
  animation: change 0.5s;
}
@keyframes change {
  0% {
    box-shadow: none;
  }
  100% {
    box-shadow: 0px 0px 20px 0px #86c9c6;
  }
}
</style>
