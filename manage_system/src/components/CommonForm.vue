<template>
  <el-form
    :model="loginForm"
    :inline="inline"
    :rules="loginFormRules"
    ref="form"
  >
    <el-form-item
      :label="item.label"
      v-for="(item, index) in formLabel"
      :key="index"
      :prop="item.prop"
    >
      <el-input
        v-model="loginForm[item.prop]"
        v-if="item.type === 'input'"
        :prefix-icon="item.prefixIcon"
        :type="item.inputType"
        :style="{ width: item.with }"
        :placeholder="item.placeholder"
      ></el-input>
      <el-button
        v-if="item.type === 'button'"
        :type="item.styleType"
        @click="login"
        >{{ item.text }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    inline: Boolean,
    labelWith: String,
    size: String,
    formLabel: Array,
    editData: Object,
    loginForm: Object,
    login: Function,
    loginFormRules: Object,
  },
  mounted() {
    // console.log(this.$refs.loginFormRef)
  },
  methods: {
    // change() {
    //   this.$parent.change()
    // },
  },
}
</script>

<style lang="less" scoped></style>
