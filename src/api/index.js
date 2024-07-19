import Http from './http'
import { readUserInfo } from '../utility/index'

// track
export const track = params => {
  const { env } = readUserInfo()
  let query = `AppId=MK.ContentCMS&ENV=${env}`
  for (let v in params) {
    query = query + `&${v}=${params[v]}`
  }
  const url = `https://track.xxxxxxx.com.cn/?${query}`
  Http({
    method: 'GET',
    url,
    NoAuth: true
  })
}

// dashboard
export const getDashboard = () =>
  Http({
    method: 'GET',
    url: 'dashboard'
  })

// upload
export const uploadAuth = params =>
  Http({
    method: 'POST',
    url: `s3/authorization`,
    data: params
  })

export const uploadSetPublic = params =>
  Http({
    method: 'PUT',
    url: `s3/setpublic`,
    data: params
  })

// 生成json上传s3
export const pushJson = params =>
  Http({
    method: 'POST',
    url: 'pushJson',
    params
  })

export const uploadFile = params =>
  Http({
    method: 'PUT',
    url: params.url,
    NoAuth: true,
    headers: params.headers,
    data: params.data
  })

export const uploadToResource = data =>
  Http({
    method: 'POST',
    url: 'system/resources',
    data: data
  })

export const localLogin = email =>
  Http({
    method: 'GET',
    basePath: '/local/check/',
    url: `users/login?email=${email}`
  })

// node服务端获取视频流信息
export const getVideoInfo = url =>
  Http({
    method: 'POST',
    url: '/getVideoInfoByUrl',
    data: { url: url },
    responseType: 'blob'
  })

// s3源站地址获取视频流信息（s3源站地址允许跨域）
// export const getVideoInfo = url =>
//   Http({
//     headers: { filename: 'utf-8' },
//     method: 'GET',
//     url: url
//       .replace(
//         'dev-community-s3.xxxxxxx.com.cn',
//         'bjs-s3-mdm-dev-community-app.s3.cn-north-1.amazonaws.com.cn'
//       )
//       .replace(
//         'community-s3.xxxxxxx.com.cn',
//         'bjs-s3-mdm-prod-community-app.s3.cn-north-1.amazonaws.com.cn'
//       ),
//     NoProxy: true,
//     responseType: 'blob'
//   })
