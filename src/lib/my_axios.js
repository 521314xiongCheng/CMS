'use strict'
import axios from 'axios'
import NProgress from 'nprogress'
import { isLocalhost, readUserInfo, readCookie } from './help'

axios.defaults.timeout = 300000

axios.interceptors.request.use(config => {
  // 发送请求前处理
  NProgress.start()

  config.baseURL = `https://${window.location.hostname}`

  // 本地调试时，调用dev环境接口，将请求转发至内网
  if (isLocalhost()) {
    config.baseURL = 'https://dev-contentcms.xxxxxxx.cn'

    if (config.url.indexOf('users/login') > -1) {
      config.url = 'local/check/' + config.url
    }
  }

  // 如果是对同域名的请求，添加headers及相关路由
  if (
    config.url.toLowerCase().indexOf('s3') < 0 ||
    config.url.toLowerCase().indexOf('contentcms.xxxxxxx') > -1
  ) {
    config.headers.username = readUserInfo() ? readUserInfo().email : ''
    config.headers.subsidiaryCode = 'CN'
    config.headers.token = readCookie('token')
  }

  if (config.url.indexOf('users/login') < 0) {
    config.url = 'proxy/content/' + config.url
  }
  return config
}, undefined)

axios.interceptors.response.use(
  response => {
    NProgress.done()
    return response.data
  },
  error => {
    NProgress.done()
    return Promise.reject(error)
  }
)

export default axios
