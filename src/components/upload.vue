<template>
  <el-upload
    ref="upload"
    class="g-upload"
    action=""
    :auto-upload="autoUpload"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :file-list="fileList"
    :multiple="multiple"
    :list-type="listType"
    :show-file-list="showFileList"
    :accept="accept"
  >
    <el-button size="small" type="primary">{{ btnName }}</el-button>
    <div slot="tip" class="el-upload__tip"></div>
  </el-upload>
</template>

<script>
export default {
  name: 'upload',
  props: {
    accept: {
      type: String
    },
    fileList: {
      type: Array
    },
    listType: {
      type: String,
      default: 'picture'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    btnName: {
      type: String,
      default: 'Upload'
    },
    checkParams: {
      type: Object,
      default: () => {
        return {}
      }
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
    }
  },
  mounted() {}
}
</script>
