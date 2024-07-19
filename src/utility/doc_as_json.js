import {
  learn_uploadAuth,
  learn_uploadSetPublic,
  uploadFile
} from '../api/index'
import SHA256 from 'js-sha256'
import Vue from 'vue'

function uploadAsJson(buffer, objectKey) {
  return new Promise((resolve, reject) => {
    const contentHash = SHA256(buffer)
    return learn_uploadAuth({
      contentHash: contentHash,
      contentLength: buffer.length,
      contentType: 'application/json',
      objectKey: objectKey
    })
      .then(authRes => {
        return uploadFile({
          url: authRes.uri,
          headers: {
            'X-Amz-Content-SHA256': contentHash,
            'content-type': 'application/json',
            Authorization: authRes.authorization,
            'X-Amz-Date': authRes.xamzDate
          },
          data: buffer
        }).then(() => {
          return learn_uploadSetPublic({
            objectKey: authRes.objectKey
          }).then(() => {
            new Vue().$notify({
              message: 'Upload Success',
              type: 'success',
              duration: 1000
            })
            return resolve(authRes.uri)
          })
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
  })
}

export default uploadAsJson
