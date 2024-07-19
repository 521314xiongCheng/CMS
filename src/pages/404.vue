<template>
  <div class="page404">
    <img :src="img" alt="" />
    <p>Page not found</p>
  </div>
</template>

<script>
const img = require('@/images/404.png')
export default {
  data() {
    return {
      img
    }
  }
}
</script>

<style scoped lang="less">
.page404 {
  margin-top: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    color: #b4b8be;
    font-size: 14px;
    margin-left: 60px;
  }
}
</style>
