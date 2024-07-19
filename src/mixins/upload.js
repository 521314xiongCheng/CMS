import upload from '../utility/upload'
import Upload from '@/components/upload.vue'
import { delIndex } from '@/utility/index'

import { Loading } from 'element-ui'

let loadinginstace
let needLoadingRequestCount = 0

function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    loadinginstace = Loading.service({
      text: '文件上传中……',
      background: 'rgba(0, 0, 0, 0.8)',
      spinner: 'el-icon-loading',
      body: true
    })
  }
  needLoadingRequestCount++
}
function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    loadinginstace.close()
  }
}
export default {
  data() {
    return {}
  },
  components: {
    Upload
  },
  methods: {
    checkImageSize(file) {
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
    },
    handleUpload(file, fileList, fileUrl, fileArray, callback) {
      this.form[fileUrl] = ''
      if (!file) {
        this[fileArray] = []
        return
      }
      if (!this.checkImageSize(file)) return
      this[fileArray] = fileList
      upload(file.raw)
        .then(url => {
          console.log(url)
          this.form[fileUrl] = url
          if (this.addForm) {
            console.log(url)
            this.addForm[fileUrl] = url
          }
          if (this.addxxxxxxxTaskForm) {
            this.addxxxxxxxTaskForm[fileUrl] = url
          }
          if (this.resourceSearchForm) {
            console.log('url-->', url)
            this.resourceSearchForm[fileUrl] = url
          }

          if (typeof callback === 'function') {
            callback(url)
          }
        })
        .catch(() => {
          this[fileArray] = []
          this.form[fileUrl] = ''
        })
    },
    handleUploadFile(file, fileList, fileUrl, fileArray, callback) {
      this.form[fileUrl] = ''
      if (!file) {
        this[fileArray] = fileList
        callback('', file)
        return
      }
      this[fileArray] = fileList
      console.log(fileArray)
      console.log(this[fileArray])
      // , 'ProductResource'
      upload(file.raw, 'ProductResource')
        .then(url => {
          this.form[fileUrl] = url
          if (this.addForm) {
            console.log(url)
            this.addForm[fileUrl] = url
          }
          if (this.resourceSearchForm) {
            console.log('url-->', url)
            this.resourceSearchForm[fileUrl] = url
          }

          if (typeof callback === 'function') {
            callback(url)
          }
        })
        .catch(() => {
          this[fileArray] = []
          this.form[fileUrl] = ''
        })
    },
    // 自定义上传s3 objectKey
    customUploadObjectKey(params, callback) {
      showFullScreenLoading()
      let file = params.file
      let fileList = params.fileList
      let fileUrl = params.fileUrl
      let fileArray = params.fileArray
      let objectKey = params.objectKey
      this.form[fileUrl] = ''
      if (!file) {
        let index = delIndex(this[fileArray], fileList)
        this[fileArray] = fileList
        tryHideFullScreenLoading()
        callback('', index)
        return
      }
      this[fileArray] = fileList
      // , 'ProductResource'
      upload(file.raw, objectKey)
        .then(url => {
          this.form[fileUrl] = url
          if (this.addForm) {
            console.log(url)
            this.addForm[fileUrl] = url
          }
          if (this.resourceSearchForm) {
            console.log('url-->', url)
            this.resourceSearchForm[fileUrl] = url
          }

          if (typeof callback === 'function') {
            tryHideFullScreenLoading()
            callback(url)
          }
        })
        .catch(() => {
          tryHideFullScreenLoading()
          this[fileArray] = []
          this.form[fileUrl] = ''
        })
    },
    handleUploadFolder(file, callback) {
      console.log(file)
      upload(file, 'ProductResource')
        .then(url => {
          console.log(url)
          callback(url)
        })
        .catch(() => {
          callback()
        })
    },
    handleMultipUpload(file, fileList, fileUrl, fileArray, callback) {
      if (!file) {
        this[fileArray] = fileList
        if (this[fileArray].length === 0) {
          this.form[fileUrl] = []
        }
        return
      }
      fileList.forEach((item, index) => {
        if (item.uid === file.uid) {
          fileList.splice(index, 1)
        }
      })
      if (!this.checkImageSize(file)) return
      this[fileArray] = fileList
      upload(file.raw)
        .then(url => {
          this.form[fileUrl].push(url)
          this[fileArray].push({
            name: url,
            url: url
          })

          if (typeof callback === 'function') {
            callback()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    async getImageSizeAsync(file) {
      return new Promise((resolve, reject) => {
        try {
          var img = new Image()
          img.onload = function() {
            var result = {
              width: img.width,
              height: img.height,
              size: file.size
            }
            resolve(result)
          }
          img.src = file.url
        } catch (err) {
          reject(err)
        }
      })
    },
    getVideoInfoAsync(file) {
      return new Promise((resolve, reject) => {
        try {
          var video = document.createElement('video')
          video.preload = 'metadata'
          video.onloadedmetadata = function() {
            var myVideo = this
            var result = {
              width: myVideo.videoWidth,
              height: myVideo.videoHeight,
              size: file.size,
              duration: video.duration
            }
            window.URL.revokeObjectURL(this.src)
            resolve(result)
          }
          video.src = URL.createObjectURL(file)
        } catch (err) {
          reject(err)
        }
      })
    },
    getAudioInfoAsync(file) {
      return new Promise((resolve, reject) => {
        try {
          var audio = document.createElement('audio')
          audio.preload = 'metadata'
          audio.onloadedmetadata = function() {
            var result = {
              width: audio.width,
              height: audio.height,
              size: file.size,
              duration: audio.duration
            }
            window.URL.revokeObjectURL(this.src)
            console.log(result)
            resolve(result)
          }
          audio.src = URL.createObjectURL(file)
        } catch (err) {
          reject(err)
        }
      })
    }
  }
}
