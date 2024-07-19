<template>
  <div class="editor">
    <quill-editor
      class="ql-editor"
      ref="myTextEditor"
      v-model="editorContent"
      :options="editorOption"
      @change="editorChange"
    >
    </quill-editor>
  </div>
</template>

<script>
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code'], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction
  [{ size: ['10px', false, '14px', '16px', '20px', '24px', '36px'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['clean']
]

export default {
  name: 'editor',
  data() {
    return {
      // content:this.editorContent,
      dialogVisible: false,
      editorOption: {
        placeholder: '请输入文字',
        modules: {
          toolbar: {
            container: toolbarOptions
          }
        }
      }
    }
  },
  props: {
    editorContent: {
      type: String,
      required: true
    }
  },
  mounted() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.myTextEditor.quill
      .getModule('toolbar')
      .addHandler('link', this.linkHandler) // 为视频ICON绑定事件
  },
  methods: {
    addLink(link) {
      this.$refs.myTextEditor.quill.format('link', link)
      this.dialogVisible = false
    },
    linkHandler() {
      let range = this.$refs.myTextEditor.quill.getSelection()
      if (range.length) {
        this.dialogVisible = true
      }
    },
    editorChange(event) {
      // this.contentLength = this.$refs.myTextEditor.quill.getLength()-1
      console.log(event)
      this.$emit('editorChange', { event })
    }
  }
}
</script>

<style lang="less" scoped>
.editor {
  /*/deep/ .ql-editor{padding:0}*/
  /deep/ .ql-container {
    min-height: 150px;
  }
}
</style>
