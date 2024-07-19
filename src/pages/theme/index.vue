<template>
  <div class="app-container">
    <div class="block">
      <el-card class="box-card">
        <div class="drawer-item" v-if="false">
          <span class="field-label">主题色 : </span>
          <theme-picker
            style="height: 26px;margin: -3px 8px 0 0;"
            :ORIGINAL_THEME="'#409EFF'"
          />
        </div>
        <div>
          <span class="field-label">换肤 : </span>
          <el-switch v-model="theme" />
        </div>
      </el-card>
    </div>

    <el-row class="block">
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>

    <el-row class="block">
      <el-button plain>朴素按钮</el-button>
      <el-button type="primary" plain>主要按钮</el-button>
      <el-button type="success" plain>成功按钮</el-button>
      <el-button type="info" plain>信息按钮</el-button>
      <el-button type="warning" plain>警告按钮</el-button>
      <el-button type="danger" plain>危险按钮</el-button>
    </el-row>

    <el-row class="block">
      <el-button round>圆角按钮</el-button>
      <el-button type="primary" round>主要按钮</el-button>
      <el-button type="success" round>成功按钮</el-button>
      <el-button type="info" round>信息按钮</el-button>
      <el-button type="warning" round>警告按钮</el-button>
      <el-button type="danger" round>危险按钮</el-button>
    </el-row>

    <el-row class="block">
      <el-button icon="el-icon-search" circle></el-button>
      <el-button type="primary" icon="el-icon-edit" circle></el-button>
      <el-button type="success" icon="el-icon-check" circle></el-button>
      <el-button type="info" icon="el-icon-message" circle></el-button>
      <el-button type="warning" icon="el-icon-star-off" circle></el-button>
      <el-button type="danger" icon="el-icon-delete" circle></el-button>
    </el-row>
  </div>
</template>

<script>
import themePicker from '@/components/themePicker'
import { toggleClass } from '@/utility'
import '@/styles/custom-theme/index.css' // the theme changed version element-ui css

export default {
  components: { themePicker },
  name: 'Theme',
  data() {
    return {
      theme: false,
      tags: [
        { name: 'Tag One', type: '' },
        { name: 'Tag Two', type: 'info' },
        { name: 'Tag Three', type: 'success' },
        { name: 'Tag Four', type: 'warning' },
        { name: 'Tag Five', type: 'danger' }
      ],
      slideValue: 50,
      radio: 3
    }
  },
  watch: {
    theme() {
      toggleClass(document.body, 'custom-theme')
    }
  }
}
</script>

<style scoped>
.drawer-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.field-label {
  vertical-align: middle;
  width: 100px;
  text-align: left;
  display: inline-block;
}
.box-card {
  width: 400px;
  max-width: 100%;
  margin-bottom: 20px;
}

.block {
  padding: 30px 24px 0 24px;
}

.tag-item {
  margin-right: 15px;
}
</style>
