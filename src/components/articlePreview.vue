<template>
  <div
    :class="isMobile ? 'preview-mobile-wrap' : 'preview-pc-wrap'"
    :style="{ 'background-image': isMobile ? 'url(' + previewImage + ')' : '' }"
  >
    <iframe frameborder="0" ref="iframe" class="iframe"></iframe>
  </div>
</template>

<script>
import { article2RichText } from '@/utility/tinyMCE_util'

export default {
  data() {
    return {
      html: '',
      type: '',
      previewImage: require('@/images/preview-bg.png')
    }
  },
  props: ['data', 'model'],
  computed: {
    isMobile() {
      return this.model === 'mobile'
    }
  },
  watch: {
    data(val) {
      this.type = val.type
      this.html = article2RichText(val.articleDetails, this.type)
    },
    html(val) {
      this.$refs['iframe'].contentDocument.body.innerHTML = val
    }
  },
  mounted() {
    // const cssLink = document.createElement('link')
    // cssLink.setAttribute('href', 'https://appdl.xxxxxxx.com.cn/ContentCMS/tinymce/skins/content/default/content.min.css')
    // cssLink.setAttribute('rel', 'stylesheet')
    // this.$refs['iframe'].contentDocument.head.appendChild(cssLink)

    const styleEl = document.createElement('link')
    styleEl.rel = 'stylesheet'
    styleEl.type = 'text/css'
    styleEl.href =
      'https://appdl.xxxxxxx.com.cn/ContentCMS/tinymce/skins/content/default/content.min.css'
    // styleEl.setAttribute('href', )
    const metaViewportEl = document.createElement('meta')
    metaViewportEl.setAttribute(
      'content',
      'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
    )
    metaViewportEl.setAttribute('name', 'viewport')

    const metaCharsetEl = document.createElement('meta')
    metaCharsetEl.setAttribute('charset', 'UTF-8')
    this.$refs['iframe'].contentDocument.head.appendChild(metaViewportEl)
    this.$refs['iframe'].contentDocument.head.appendChild(metaCharsetEl)
    this.$refs['iframe'].contentDocument.head.appendChild(styleEl)
  },
  created() {
    this.type = this.data.type
    this.html = article2RichText(this.data.articleDetails, this.type)
  },
  methods: {},
  components: {}
}
</script>

<style lang="less" scoped>
.preview-mobile-wrap {
  background-repeat: no-repeat;
  background-size: contain;
  height: 660px;
  width: 303px;
  margin: 0 auto;
  margin-bottom: 60px;
  padding: 72px 10px 0 10px;
  box-sizing: border-box;

  .iframe {
    height: 500px;
    width: 100%;
  }
}
.preview-pc-wrap {
  width: 100%;
  height: 700px;
  .iframe {
    height: 100%;
    width: 100%;
  }
}
</style>
