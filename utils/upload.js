// const { uploadAuth, uploadSetPublic, uploadFile } = require('../src/api/index')
const axios = require('axios')
const SHA256 = require('js-sha256')

// 时间格式化
function formatDate(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) {
    return ''
  }
  // date = date.replace(/-/g, '/')
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  var o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '\u661f\u671f'
          : '\u5468'
        : '') + week[date.getDay() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

async function upload(buffer, objectKey) {
  let API_URL = process.env.API_URL
  return new Promise((resolve, reject) => {
    let contentType = 'audio/mp3'
    const contentHash = SHA256(buffer)
    let params = {
      contentHash: contentHash,
      contentLength: buffer.length,
      contentType: contentType
    }
    if (objectKey) {
      let name = formatDate(new Date(), 'YYYYMMDDHHmmss_S')
      params.objectKey = `${objectKey}/${name}.mp3`
    }
    return axios({
      method: 'POST',
      url: `${API_URL}/s3/authorization`,
      headers: {
        'Content-Type': 'application/json',
        clientKey: process.env.CLIENT_KEY
      },
      data: params
    })
      .then(authRes => {
        authRes = authRes.data
        return axios({
          method: 'PUT',
          url: authRes.uri,
          NoAuth: true,
          headers: {
            'X-Amz-Content-SHA256': contentHash,
            'content-type': contentType,
            Authorization: authRes.authorization,
            'X-Amz-Date': authRes.xamzDate
          },
          data: buffer
        })
          .then(() => {
            return axios({
              method: 'PUT',
              url: `${API_URL}/s3/setpublic`,
              headers: {
                'Content-Type': 'application/json',
                clientKey: process.env.CLIENT_KEY
              },
              data: { objectKey: authRes.objectKey }
            }).then(() => {
              if (
                process.env.NODE_ENV === 'dev' ||
                process.env.NODE_ENV === 'qa' ||
                process.env.NODE_ENV === 'uat'
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
            })
          })
          .catch(err => {
            reject(err)
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}

exports.upload = upload
