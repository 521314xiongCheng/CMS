<template>
  <div>
    <h3 style="color: #000;">{{ previewInfo.title }}</h3>
    <div style="color: #ccc;font-size: 12px;">
      {{ previewInfo.createdDate }}
    </div>
    <div class="ql-editor">
      <div v-for="item in previewInfo.articleDetails" :key="item.id">
        <div
          style="margin-top:20px"
          v-if="item.type === 'Text'"
          v-html="item.content"
        ></div>
        <div style="width: 400px;" v-else-if="item.type === 'Video'">
          <video style="width:100%" :src="item.content" controls></video>
        </div>
        <div style="width: 400px;" v-else-if="item.type === 'Audio'">
          <audio :src="item.content" controls></audio>
        </div>
        <div v-else-if="item.type === 'Animation'">
          <img style="max-width: 400px;" :src="item.content" />
        </div>
        <div v-else>
          <img style="max-width: 400px;" :src="item.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'testApplet-BGC-preview',
  data() {
    return {
      previewInfo: {}
    }
  },
  mounted() {
    let data = JSON.parse(sessionStorage.getItem('bgcPreviewRow'))
    this.previewInfo = { ...data }
  },
  methods: {
    previewAction(row) {
      console.log(row)
      this.previewInfo = { ...row }
      this.previewDialog = true
    }
  }
}
</script>

<style lang="less" scoped>
.page-box {
  margin: 30px 0;
  text-align: right;
}
</style>
