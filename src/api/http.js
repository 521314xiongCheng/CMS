import axios from 'axios'
import Vue from 'vue'
import NProgress from 'nprogress'
import { track } from '../api/index'
import { readUserInfo, isLocalhost, readCookie } from '../utility/index'

const client = axios.create()

const Http = function(options) {
  const { email } = readUserInfo()
  const basePath = options.basePath || '/proxy/content/'
  if (!options.headers) options.headers = {}
  options.headers.token = readCookie('token')
  NProgress.start()
  if (!options.NoAuth) {
    options.headers.username = email
    if (isLocalhost()) {
      console.log(options.url)
      if (options.url === 'doctojson') {
        options.url = `http://localhost:3002${basePath}${options.url}`
      } else if (options.url.includes('mock')) {
        options.url = `https://mock.xxxxxxx.com.cn/${options.url}`
      } else if (options.NoProxy) {
        options.url = `${options.url}`
      } else if (
        options.url === '/ttsTest' ||
        options.url === '/getTts' ||
        options.url === '/clearIM' ||
        options.url === '/getVideoInfoByUrl'
      ) {
        options.url = `https://dev-contentcms.xxxxxxx.cn${options.url}`
      } else {
        options.url = `https://dev-contentcms.xxxxxxx.cn${basePath}${options.url}`
      }
      // options.url = `https://contentcms-api-lastest.dev.pcf-internal.mkc.io${basePath}${options.url}`
    } else {
      if (
        options.url === '/ttsTest' ||
        options.url === '/getTts' ||
        options.url === '/clearIM' ||
        options.url === '/getVideoInfoByUrl'
      ) {
        options.url = `${options.url}`
      } else {
        options.url = `${basePath}${options.url}`
      }
    }
  }

  const onSuccess = response => {
    NProgress.done()
    const message = response.data.message
    if (
      message &&
      !response.data.groupId &&
      !response.data.pushType &&
      !options.NoAuth &&
      !options.NoNotify &&
      options.url.indexOf('/s3/release') === -1
    ) {
      new Vue().$notify({
        message,
        type: 'success',
        duration: 1000
      })
    }
    return response.data
  }

  const onError = error => {
    NProgress.done()
    if (error.response) {
      let message = ''
      if (error.response.status === 400) {
        message = error.response.data.errors
          ? error.response.data.errors[0].defaultMessage
          : error.response.data.message
      } else if (error.response.status === 401) {
        location.href = '/auth'
      } else {
        message = error.response.data.message
      }
      if (!options.NoAuth && message && !options.NoErrNotify) {
        new Vue().$notify({
          message,
          type: 'error',
          duration: 3000
        })
      }
      // splunk track
      track({
        LogLevel: 'error',
        RequestData: error.response.config.data,
        ResponseData: JSON.stringify(error.response.data),
        Url: error.response.config.url
      })
    }

    return Promise.reject(error.response || error.message)
  }

  return client(options)
    .then(onSuccess)
    .catch(onError)
}

export default Http
