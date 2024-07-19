<template>
  <el-header class="app-header">
    <div class="app-title">CMS</div>
    <el-container class="app-header-info">
      <div class="link text-right">
        <change-theme class="theme-container"></change-theme>
        <span class="username">Welcome, {{ userName }}</span>
        <el-button type="text" @click="signOut" class="ml20">
          Sign Out
        </el-button>
      </div>
    </el-container>
  </el-header>
</template>

<script>
import changeTheme from '@/components/changeTheme'
export default {
  props: ['userName'],
  data() {
    return {}
  },
  methods: {
    signOut() {
      location.href = '/signOut'
    }
  },
  components: { changeTheme },
  created() {}
}
</script>

<style lang="less" scoped>
.el-header {
  border-bottom: 1px solid #757272;
  padding: 0 40px 0 220px;

  .el-col {
    line-height: 60px;
  }
}
.link {
  float: right;
}
.app-title {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 30px;
  width: 220px;
  line-height: 60px;
  text-align: center;
}
.app-header-info {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  float: right;
}
.app-header /deep/ .theme-container {
  //position:absolute;
  //top:15px;
  //right: 225px;
  //background-color :#fff;
  font-size: 24px;
  cursor: pointer;
  //background-image:linear-gradient(#fff, #fff)
}
</style>
