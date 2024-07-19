<template>
  <el-upload
    ref="upload"
    class="avatar-uploader"
    action=""
    :auto-upload="autoUpload"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :on-exceed="onExceed"
    :multiple="multiple"
    :show-file-list="showFileList"
    :limit="limit"
    v-bind="$attrs"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
export default {
  name: 'upload',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    imageUrl: {
      type: String,
      default: ''
    },
    showFileList: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      autoUpload: false
    }
  },
  methods: {
    handleChange(file, fileList) {
      if (this.multiple) {
        this.$emit('change', file, fileList)
      } else {
        this.$emit('change', file, [fileList.pop()])
      }
    },
    handleRemove(file, fileList) {
      if (this.multiple) {
        this.$emit('change', '', fileList)
      } else {
        this.$emit('change', '', [])
      }
    },
    onExceed() {
      this.$notify.error({
        title: 'Error',
        message: `最多上传${this.limit}张图片`,
        duration: 3000
      })
    }
  },
  mounted() {}
}
</script>
