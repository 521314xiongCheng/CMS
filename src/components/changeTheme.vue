<style lang="less">
// .svg-icon {
//   width: 20px;
//   height: 20px;
//   fill: #2d8cf0;
//   overflow: hidden;
//   vertical-align: sub;
// }
.change-theme-btn {
  margin-right: 10px;
  width: 30px;
  height: 30px;
  fill: currentColor;
}
</style>

<template>
  <el-dropdown @command="changeTheme">
    <span class="">
      <svg-icon class="" style="fill:#fff" icon-class="pifu" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item class="clearfix" command="default">
        青铜绿
      </el-dropdown-item>
      <el-dropdown-item class="clearfix" command="black">
        黑
      </el-dropdown-item>
      <!-- <el-dropdown-item divided command="customize">
        自定义
      </el-dropdown-item> -->
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
// import '@/assets/custom-theme/science-blue.css' // the theme changed version element-ui css
import { addClass, removeClass } from '@/utils/element'
export default {
  methods: {
    // change theme - 换肤
    changeTheme(command) {
      if (command === 'default') {
        removeClass(document.getElementById('app'), 'black-theme')
        return
      }
      if (command === 'black') {
        addClass(document.getElementById('app'), 'black-theme')
        return
      }
      // 自定义
      if (command === 'customize') {
        const h = this.$createElement
        this.$notify.info({
          title: '提示',
          message: h(
            'i',
            { style: 'color: teal' },
            '自定义颜色主题功能，请在左侧菜单中选择【主题】'
          ),
          position: 'bottom-right'
        })
      }
    }
  }
}
</script>
