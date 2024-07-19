import upload from '../utility/upload'
import Upload from '@/components/upload.vue'

/**
 *  Mixins upload
 *
 *  @function uploadFile 上传文件
 *    @param [file/fileList] 为elementUi upload组件的onchangge事件的返回值
 *    @param [fileUrl] this对象下，用于保存上传图片url的变量
 *    @param [fileArray] this对象下，用于保存图片列表的变量
 */

/**
 *  Usage
 * 
 <template>

    <upload
      @change="uploadFileChangeEvent"
      accept="image/png, image/jpeg"
      :fileList="imageUrlList"
    ></upload>
 </template>

 <script>

  data() {
    return {
      imageUrl: '',
      imageUrlList: []
    }
  },
  methods: {
    uploadFileChangeEvent(file, fileList) {
      this.uploadFile(file, fileList, imageUrl, imageUrlList)
    }
  }
 </script>
 *
 */
export default {
  data() {
    return {}
  },
  components: { Upload },
  methods: {
    uploadFile(file, fileList, fileUrl, fileArray) {
      this.form[fileUrl] = ''
      if (!file) {
        this[fileArray] = []
        return
      }
      if (!this._checkImageSize(file)) return
      this[fileArray] = fileList
      upload(file.raw)
        .then(url => {
          this.form[fileUrl] = url
        })
        .catch(() => {
          this[fileArray] = []
          this.form[fileUrl] = ''
        })
    },
    _checkImageSize(file) {
      if (file.raw.type.indexOf('image') > -1 && file.size / 1024 > 500) {
        this.$notify.error({
          title: 'Error',
          message:
            'Please upload JPG, PNG, JPEG format pictures, size limit of less than 500KB',
          duration: 1000
        })
        return false
      }
      return true
    }
  }
}
