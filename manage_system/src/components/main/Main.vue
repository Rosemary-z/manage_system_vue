<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bool: false,
    };
  },
  methods: {
    jumpTo() {
      this.bool = true;
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  .layered-navigation {
    display: flex;
    font-size: 14px;
    color: #606266;
    .home-page {
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: #333333;
      }
    }
    .el-icon-arrow-right {
      margin: 0 10px;
    }
  }
}
</style>
