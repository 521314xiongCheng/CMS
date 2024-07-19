<!-- img preview component -->
<template>
  <div class="img-preview-component">
    <i class="el-icon-close" @click="close"></i>
    <img :src="src" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      required: true
    }
  },

  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.img-preview-component {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #000;

  .el-icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 50px;
    color: #fff;
  }

  > img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 85%;
  }
}
</style>
