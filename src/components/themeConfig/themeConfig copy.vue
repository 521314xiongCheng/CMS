<template>
  <div class="drawer-container">
    <div>
      <div style="text-align:right;">
        <el-button size="mini" plain @click="reset">重置</el-button>
        <el-button size="mini" type="primary" @click="download">下载</el-button>
      </div>
      <h3 class="drawer-title">Page style setting</h3>
      <div class="drawer-item">
        <span>color-primary</span>
        <div class="color-row">
          <el-input size="mini" readonly v-model="colors.primary"></el-input>
          <themePicker
            :ORIGINAL_THEME="colors.primary"
            @change="themeChange($event, 'primary')"
          />
        </div>
      </div>
      <div class="drawer-item">
        <span>color-success</span>
        <div class="color-row">
          <el-input size="mini" readonly v-model="colors.success"></el-input>
          <themePicker
            :ORIGINAL_THEME="colors.success"
            @change="themeChange($event, 'success')"
          />
        </div>
      </div>
      <div class="drawer-item">
        <span>color-info</span>
        <div class="color-row">
          <el-input size="mini" readonly v-model="colors.info"></el-input>
          <themePicker
            :ORIGINAL_THEME="colors.info"
            @change="themeChange($event, 'info')"
          />
        </div>
      </div>
      <div class="drawer-item">
        <span>color-warning</span>
        <div class="color-row">
          <el-input size="mini" readonly v-model="colors.warning"></el-input>
          <themePicker
            :ORIGINAL_THEME="colors.warning"
            @change="themeChange($event, 'warning')"
          />
        </div>
      </div>
      <div class="drawer-item">
        <span>color-danger</span>
        <div class="color-row">
          <el-input size="mini" readonly v-model="colors.danger"></el-input>
          <themePicker
            :ORIGINAL_THEME="colors.danger"
            @change="themeChange($event, 'danger')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const version = require('element-ui/package.json').version // element-ui version from node_modules
import themePicker from '@/components/themeConfig/themePicker'
export default {
  components: { themePicker },
  data() {
    return {
      colors: {
        primary: '#409EFF',
        success: '#67C23A',
        info: '#909399',
        warning: '#E6A23C',
        danger: '#F56C6C'
      },
      rules: {},
      originalStyle: '',
      styleFiles: [],
      fontFiles: ['element-icons.ttf', 'element-icons.woff'],
      fonts: []
    }
  },
  methods: {
    themeChange(val, name) {
      this.colors[name] = val
      this.writeNewStyle()
    },
    reset() {
      this.colors = {
        primary: '#409EFF',
        success: '#67C23A',
        info: '#909399',
        warning: '#E6A23C',
        danger: '#F56C6C'
      }
    },
    download() {},
    getStyleTemplate(data) {
      const colorMap = {
        primary: '#409EFF',
        success: '#67C23A',
        info: '#909399',
        warning: '#E6A23C',
        danger: '#F56C6C'
      }
      return colorMap[data]
    },
    getCSSString(url, variable) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
            console.log(this[variable])
            resolve()
          }
        }
        xhr.open('GET', url)
        xhr.send()
      })
    },

    getIndexStyle() {
      this.getCSSString(
        `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`,
        'originalStyle'
      )
    },
    writeNewStyle() {
      let cssText = this.originalStyle
      Object.keys(this.colors).forEach(key => {
        let oldVal = this.getStyleTemplate(key)
        cssText = cssText.replace(new RegExp(oldVal, 'ig'), this.colors[key])
      })
      let styleTag = document.getElementById('chalk-style')
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.setAttribute('id', 'chalk-style')
        document.head.appendChild(styleTag)
      }
      styleTag.innerText = cssText
    }
  },
  created() {
    this.getIndexStyle()
  }
}
</script>

<style lang="less" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }
  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
    .color-row {
      display: flex;
      align-items: center;
      .color-picker {
        margin-left: 10px;
      }
    }
  }
  .drawer-switch {
    float: right;
  }
}
</style>
