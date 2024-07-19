<template>
  <div class="uploader">
    <input class="file" type="file" webkitdirectory @change="filesChange" />
    <span class="el-button el-button--primary el-button--mini">批量上传</span>
  </div>
</template>
<script>
import upload from '@/mixins/upload.js'
export default {
  name: 'UploadFolder',
  mixins: [upload],
  data() {
    return {}
  },
  methods: {
    filesChange(e) {
      let files = e.target.files,
        length = e.target.files.length
      for (let i = 0; i < length; i++) {
        this.$emit('change', files[i])
      }
      e.target.value = ''
    }
  }
}
</script>
<style lang="less" scoped>
.uploader {
  position: relative;
  overflow: hidden;
  .el-button {
    margin-left: 20px;
  }
  .file {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    z-index: 1;
  }
}
</style>
