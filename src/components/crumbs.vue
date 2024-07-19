<!-- 面包屑 -->
<template>
  <div class="bgfff">
    <div class="crumbs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="is-path" :to="{ path: '/' }">
          Dashboard
        </el-breadcrumb-item>
        <transition-group name="breadcrumb">
          <el-breadcrumb-item
            v-for="(item, index) in crumbsData"
            :to="item.path"
            :class="{ 'is-path': item.path }"
            :key="item.name + index"
            >{{ item.name }}</el-breadcrumb-item
          >
        </transition-group>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    crumbsData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {},

  computed: {},

  created() {},

  mounted() {},

  methods: {}
}
</script>
<style lang="less" scoped>
.crumbs {
  height: 40px;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 30px;
  border-bottom: 1px solid #dedede;
  .el-breadcrumb {
    font-weight: bold;
  }
  // /deep/.el-breadcrumb__inner {
  //   color: #97a8be;
  // }
  .is-path {
    /deep/.el-breadcrumb__inner {
      color: #2f93ff;
    }
  }
  // /deep/.el-breadcrumb__separator {
  //   color: #97a8be;
  // }
}
</style>
