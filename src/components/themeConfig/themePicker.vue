<template>
  <el-color-picker
    v-model="theme"
    :predefine="[
      '#409EFF',
      '#1890ff',
      '#304156',
      '#212121',
      '#11a983',
      '#13c2c2',
      '#6959CD',
      '#f5222d'
    ]"
    size="mini"
    class="color-picker"
  />
</template>

<script>
export default {
  data() {
    return {
      chalk: '', // content of theme-chalk css
      theme: ''
    }
  },
  props: {
    ORIGINAL_THEME: {
      type: String,
      default: ''
    }
  },
  computed: {
    defaultTheme() {
      return this.ORIGINAL_THEME
    }
  },
  watch: {
    defaultTheme: {
      handler: function(val) {
        this.theme = val
      },
      immediate: true
    },
    theme(val) {
      this.$emit('change', val)
    }
  },
  methods: {}
}
</script>

<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
.color-picker {
  margin-left: 10px;
}
</style>
