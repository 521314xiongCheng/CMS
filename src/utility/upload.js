import { uploadAuth, uploadSetPublic, uploadFile } from '../api/index'
import { formatDate, isLocalhost } from './index'
import SHA256 from 'js-sha256'
import Vue from 'vue'

function upload(file, objectKey) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
    let contentType
    if (file.type.indexOf('image') > -1) {
      contentType = file.type
    } else {
      switch (suffix) {
        case 'zip':
          contentType = 'application/zip'
          break
        case 'pdf':
          contentType = 'application/pdf'
          break
        case 'mp4':
          contentType = 'video/mp4'
          break
        case 'mp3':
          contentType = 'audio/mp3'
          break
        case 'xls':
          contentType = 'application/xls'
          break
        case 'xlsx':
          contentType = 'application/xlsx'
          break
        case 'ppt':
          contentType = 'application/ppt'
          break
        case 'pptx':
          contentType = 'application/pptx'
          break
        case 'doc':
          contentType = 'application/doc'
          break
        case 'docx':
          contentType = 'application/docx'
          break
        default:
          reject('The file type must be mp4/mp3/zip/pdf/image')
      }
    }

    reader.onload = () => {
      const buffer = reader.result
      const contentHash = SHA256(buffer)
      let params = {
        contentHash: contentHash,
        contentLength: file.size,
        contentType: contentType
      }
      if (objectKey) {
        console.log(suffix)
        let name = formatDate(new Date(), 'YYYYMMDDHHmmss_S')
        params.objectKey = `${objectKey}/${name}.${suffix}`
      }
      return uploadAuth(params)
        .then(authRes => {
          return uploadFile({
            url: authRes.uri,
            headers: {
              'X-Amz-Content-SHA256': contentHash,
              'content-type': contentType,
              Authorization: authRes.authorization,
              'X-Amz-Date': authRes.xamzDate
            },
            data: file.slice()
          })
            .then(() => {
              return uploadSetPublic({ objectKey: authRes.objectKey }).then(
                () => {
                  new Vue().$notify({
                    message: 'Upload Success',
                    type: 'success',
                    duration: 1000
                  })
                  if (
                    window.location.href.toLowerCase().indexOf('dev') > -1 ||
                    window.location.href.toLowerCase().indexOf('qa') > -1 ||
                    window.location.href.toLowerCase().indexOf('uat') > -1 ||
                    isLocalhost()
                  ) {
                    authRes.uri = authRes.uri.replace(
                      'bjs-s3-mdm-dev-community-app.s3.cn-north-1.amazonaws.com.cn',
                      'dev-community-s3.xxxxxxx.com.cn'
                    )
                  } else {
                    authRes.uri = authRes.uri.replace(
                      'bjs-s3-mdm-prod-community-app.s3.cn-north-1.amazonaws.com.cn',
                      'community-s3.xxxxxxx.com.cn'
                    )
                  }
                  return resolve(authRes.uri)
                }
              )
            })
            .catch(err => {
              new Vue().$notify({
                message: 'Upload Failed',
                type: 'error',
                duration: 1000
              })
              reject(err)
            })
        })
        .catch(err => {
          new Vue().$notify({
            message: 'Upload Failed',
            type: 'error',
            duration: 1000
          })
          reject(err)
        })
    }
    reader.readAsArrayBuffer(file)
  })
}

export default upload
