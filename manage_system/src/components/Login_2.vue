<template>
  <div class="login-page">
    <div class="login-page-form">
      <h3>用户登录</h3>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        class="login_form"
        status-icon
      >
        <el-form-item prop="tel">
          <el-input
            v-model="ruleForm.tel"
            placeholder="手机号"
            prefix-icon="iconfont icon-tel"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item class="code" prop="code">
          <el-input
            v-model="ruleForm.code"
            placeholder="验证码"
            prefix-icon="iconfont icon-lock"
          ></el-input>
          <div class="code-button" @click="sendCode" ref="code_button">
            <span v-if="isShow">请输入验证码</span>
            <span v-else class="sendCode">
              <em>{{ count }}</em>
              秒后重发
            </span>
          </div>
        </el-form-item>
        <el-form-item class="button-line">
          <el-button
            :plain="true"
            class="my-button"
            type="primary"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { login } from "../api/sendRequest.js";
// import { getLogin } from "../api/getLogin";
export default {
  data() {
    var checkTel = (rule, value, callback) => {
      console.log(value);
      // 定义电话号码校验正则表达式
      var phoneReg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      } else if (!phoneReg.test(value)) {
        return callback(new Error("电话号码不合法"));
      } else {
        callback();
      }
    };
    // 判断验证码
    var checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      } else if (value != 111111 || this.isShow) {
        return callback(new Error("验证码错误"));
      } else {
        callback();
      }
    };
    return {
      count: 10,
      isShow: true,
      countTimer: "",
      ruleForm: {
        // 登录表单的数据绑定对象
        tel: "",
        code: "",
        checkTel: "",
        checkCode: "",
      },
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        // 定义表单各个input框验证规则
        tel: [{ validator: checkTel, trigger: "blur" }], // 定义电话号码验证规则
        code: [{ validator: checkCode, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (this.isShow) {
          this.$notify({
            title: "错误",
            message: "验证码错误",
            type: "error",
          });
          this.$refs[ruleForm].resetFields();
        } else if (valid) {
          // 发送登录请求，返回携带token的data数据
          const { data: res } = await this.$http.post("login", this.loginForm);
          console.log(res);
          // 如果后端返回的状态不等于200，登录失败
          if (res.meta.status !== 200) {
            this.$notify({
              title: "错误",
              message: "登录失败",
              type: "error",
            });
          }
          this.$notify({
            title: "成功",
            message: "登录成功",
            type: "success",
          });
          // 存储用户登录的token值
          window.sessionStorage.setItem("token", res.data.token);
          this.$router.replace("/home");
        }
      });
    },
    // 设置定时器
    sendCode() {
      this.isShow = false;
      if (!this.countTimer) {
        this.count = 10; // 这里一定要先对count重新赋值，不然下次再点击的时候，count值已经变成-1，
        this.countTimer = setInterval(() => {
          this.count--;
          if (this.count < 0) {
            this.isShow = true;
            // 关闭定时器
            clearInterval(this.countTimer);
            this.countTimer = null; // 关闭了定时器之后，将定时器赋值为null
          }
        }, 1000);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-page {
  height: 100%;
  background: #86c9c6;
  position: relative;
  .login-page-form {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
    height: 300px;
    background: #fff;
    h3 {
      color: #333333;
      text-align: center;
      padding: 20px;
    }
    .login_form {
      width: 300px;
      .button-line {
        display: flex;
        justify-content: center;
        .my-button {
          width: 300px;
          background: #3eb991;
          color: #fff;
        }
      }
      /deep/.code {
        .el-form-item__content {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          width: 100%;
          input {
            width: 200px;
          }
          .code-button {
            width: 120px;
            border: none;
            cursor: pointer;
            background: #86c9c6;
            text-align: center;
          }
        }
        /deep/.sendCode {
          cursor: not-allowed;
          display: inline-block;
          background: darkgray;
          width: 100%;
          height: 100%;
        }
        /deep/.el-input__suffix {
          right: 20px;
        }
      }
    }
  }
}
</style>
