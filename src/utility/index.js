import { getVideoInfo } from '../api/index'
import { getTts } from '../api/library/material'
import utilUpload from '@/utility/upload'
import { Notification } from 'element-ui'

export const readCookie = name => {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

export const readUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) return {}
  try {
    return JSON.parse(userInfo)
  } catch (e) {
    return {}
  }
}

export const userClients = addAll => {
  let client = []

  if (addAll) {
    client.push({
      id: '',
      client_name: 'All'
    })
  }

  const userInfo = readUserInfo()
  for (let c of userInfo.clients) {
    client.push({
      id: c,
      client_name: c
    })
  }

  return client
}

export const readUserName = () => {
  try {
    console.log('readUserInfo()', readUserInfo())
    return readUserInfo().nickName
  } catch (_) {
    return 'NULL_USER'
  }
}

export const createCookie = (name, value, days) => {
  let expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toGMTString()
  }
  document.cookie = name + '=' + value + expires + '; path=/'
}

export const mergeObj = (a, b) => {
  for (let i in a) {
    if (b[i] !== undefined) {
      a[i] = b[i]
    }
  }
  return a
}

// 浅拷贝
export const assignObj = (a, b) => {
  for (const key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key]
    }
  }
  return a
}

export const checkLevel = (rule, value, callback) => {
  // value = parseInt(value, 10)
  if (value < 100 && value > 0) {
    callback()
  } else {
    callback(new Error('You can only enter 1-99 digits'))
  }
}

export const arrayMove = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length
    while (k-- + 1) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr
}

export const copyObj = obj => {
  if (null == obj || 'object' != typeof obj) return obj
  var copy = obj.constructor()
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
  }
  return copy
}

export const sortByKey = (array, key) => {
  if (!array) return
  return array.sort((a, b) => {
    const x = a[key]
    const y = b[key]
    return x < y ? -1 : x > y ? 1 : 0
  })
}

export const createQuery = params => {
  let query = ''
  for (let v in params) {
    query = query + `&${v}=${params[v]}`
  }
  return query.substring(1)
}

export const isLocalhost = () => {
  return location.hostname === 'localhost' || location.hostname === '127.0.0.1'
}

export const changeTimeFormatToUTCYYYYmmDDhhMMss = time_stamp => {
  // 将时间格式转为 yyyy-mm-dd hh:mm:ss的形式

  if (!time_stamp) return null
  let dateObj = new Date(time_stamp)

  let Y = dateObj.getFullYear() + '/'
  let M =
    (dateObj.getUTCMonth() + 1 < 10
      ? '0' + (dateObj.getUTCMonth() + 1)
      : dateObj.getUTCMonth() + 1) + '/'
  let D =
    (dateObj.getUTCDate() < 10
      ? '0' + dateObj.getUTCDate()
      : dateObj.getUTCDate()) + ' '
  let h =
    (dateObj.getUTCHours() < 10
      ? '0' + dateObj.getUTCHours()
      : dateObj.getUTCHours()) + ':'
  let m =
    (dateObj.getUTCMinutes() < 10
      ? '0' + dateObj.getUTCMinutes()
      : dateObj.getUTCMinutes()) + ':'
  let s =
    dateObj.getUTCSeconds() < 10
      ? '0' + dateObj.getUTCSeconds()
      : dateObj.getUTCSeconds()
  let formatedDate = Y + M + D + h + m + s

  return formatedDate
}

export const utc2gmt = function(date) {
  let d = new Date(date)
  d.setHours(d.getHours() + 8)
  return changeTimeFormatToUTCYYYYmmDDhhMMss(d)
}

export const treeData2Arr = function(data, key) {
  if (!data) return
  let list = []
  let oriArr = []
  if (Array.isArray(data)) {
    oriArr = data
  } else {
    oriArr.push(data)
  }
  const traverse = arr => {
    arr.forEach(o => {
      list.push(o)
      if (o[key]) {
        traverse(o[key])
      }
    })
  }
  traverse(oriArr)
  return list
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pySort = function(arr) {
  if (!String.prototype.localeCompare) return null
  var letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  var abcList = []
  var cnList = []
  var endList = []
  var returnList = []

  for (let m = 0; m < arr.length; m++) {
    if (!isChinese(arr[m].page_name)) {
      abcList.push([arr[m].page_name, arr[m].language, arr[m].app_name])
    }
  }

  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < abcList.length; j++) {
      if (abcList[j][0].charAt(0).toLowerCase() == letters[i].toLowerCase()) {
        endList.push(abcList[j])
        returnList.push(
          arr.find(
            x =>
              x.page_name == abcList[j][0] &&
              x.language == abcList[j][1] &&
              x.app_name == abcList[j][2]
          )
        )
      }
    }
  }

  console.log(endList, returnList)

  for (let m = 0; m < arr.length; m++) {
    if (isChinese(arr[m].page_name)) {
      cnList.push([arr[m].page_name, arr[m].language, arr[m].app_name])
    }
  }

  var letters2 = '*abcdefghjklmnopqrstwxyz'.split('')
  var zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('')

  var segs = []
  var curr
  for (let i = 0; i < letters2.length; i++) {
    curr = {
      letter: letters2[i],
      data: []
    }
    for (let j = 0; j < cnList.length; j++) {
      var initial = cnList[j][0].charAt(0) //截取第一个字符
      if (
        (!zh[i - 1] || zh[i - 1].localeCompare(initial) <= 0) &&
        initial.localeCompare(zh[i]) == -1
      ) {
        curr.data.push(cnList[j])
        returnList.push(
          arr.find(
            x =>
              x.page_name == cnList[j][0] &&
              x.language == cnList[j][1] &&
              x.app_name == cnList[j][2]
          )
        )
      }
    }
    if (curr.data.length > 0) {
      segs.push(curr)
    }
  }
  return returnList
}

var isChinese = function(temp) {
  var re = /[^\u4E00-\u9FA5]/
  if (re.test(temp)) {
    return false
  }
  return true
}

export const isChar = function(char) {
  var reg = /[A-Za-z]/
  if (!reg.test(char)) {
    return false
  }
  return true
}

export const isNumber = function(char) {
  var reg = /[0-9]/
  if (!reg.test(char)) {
    return false
  }
  return true
}

// 删除数组中的某一项
export const deleteOneofArray = function(value, array) {
  array.forEach((o, i, array) => {
    if (o === value) {
      array.splice(i, 1)
    }
  })
}

// 对比两个数组，返回差异项下标
export const delIndex = function(a, b) {
  let index
  a.forEach((o, i) => {
    if (b.indexOf(o) === -1) {
      index = i
      return
    }
  })
  return index
}

export const clones = function(obj) {
  if (obj === null || typeof obj !== 'object') return obj

  // Handle Array
  if (obj instanceof Array) {
    let copy = []
    for (let i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clones(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    let copy = {}
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clones(obj[attr])
    }
    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}

export const deepCopy = function(obj, cache = []) {
  // typeof [] => 'object'
  // typeof {} => 'object'
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
  /**
   * 类似下面这种
   * var a = {b:1}
   * a.c = a
   * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
   */
  const hit = cache.filter(c => c.original === obj)[0]
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
  cache.push({
    original: obj,
    copy
  })
  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

export const cutString = function(str, len) {
  if (str.length * 2 <= len) {
    return str
  }

  var strlen = 0

  var s = ''

  for (var i = 0; i < str.length; i++) {
    s = s + str.charAt(i)

    if (str.charCodeAt(i) > 128) {
      strlen = strlen + 2

      if (strlen >= len) {
        return s.substring(0, s.length - 1) + '...'
      }
    } else {
      strlen = strlen + 1

      if (strlen >= len) {
        return s.substring(0, s.length - 2) + '...'
      }
    }
  }
  return s
}

// 判断参数是否是其中之一
export const oneOf = function(value, validList) {
  //console.log(validList)
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

// 时间格式化
export const formatDate = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
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

export const getImageSizeAsync = async file => {
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
}

// 截取视频第一帧作为poster 并获取视频时长
export const getVideoInfoAsync = async file => {
  return new Promise((resolve, reject) => {
    try {
      let videoElement = document.createElement('video')
      videoElement.src = file.url
      videoElement.currentTime = 1 // 第一帧
      videoElement.addEventListener('canplay', function() {
        let canvas = document.createElement('canvas')
        canvas.width = videoElement.videoWidth
        canvas.height = videoElement.videoHeight
        canvas
          .getContext('2d')
          .drawImage(videoElement, 0, 0, canvas.width, canvas.height)
        let poster = canvas.toDataURL('image/png') //第一帧图片url
        const posterFile = base64ToFile(poster)
        utilUpload(posterFile, 'LibraryResource').then(res => {
          //上传到resources
          let info = {
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
            poster: res,
            duration: parseInt(videoElement.duration)
          }
          resolve(info)
        })
      })
    } catch (err) {
      reject(err)
    }
  })
}

// 获取音频时长
export const getAudioInfoAsync = async file => {
  return new Promise((resolve, reject) => {
    try {
      let audioElement = document.createElement('audio')
      audioElement.src = file.url
      audioElement.addEventListener('canplay', function() {
        let info = {
          duration: parseInt(audioElement.duration)
        }
        resolve(info)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const ttsBufferToResource = async text => {
  let audioBuffer = await getTts(text)
  return new Promise((resolve, reject) => {
    try {
      let file = new File([audioBuffer], '音频.mp3', { type: 'audio/mp3' })
      file.url = URL.createObjectURL(file)
      utilUpload(file, 'LibraryResource')
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    } catch (err) {
      reject(err)
    }
  })
}

export const getVideoInfoByUrl = async url => {
  return new Promise((resolve, reject) => {
    try {
      getVideoInfo(url)
        .then(async res => {
          let file = new File([res], '视频', { type: 'video/mp4' })
          file.url = URL.createObjectURL(file)
          console.log(file)
          let info = await getVideoInfoAsync(file)
          resolve(info)
        })
        .catch(err => {
          console.log(err)
          reject(err)
          Notification({
            message: '获取视频信息失败!请上传本地视频文件',
            type: 'error',
            duration: 3000
          })
        })
    } catch (err) {
      reject(err)
    }
  })
}

export const checkImageSize = (file, size) => {
  if (file.raw.type.indexOf('image') > -1) {
    if (file.size / 1024 > size) {
      return false
    }
  }
  return true
}

function sortBy(props) {
  return (a, b) => {
    return a[props] - b[props]
  }
}

export const toTree = data => {
  let date = new Date().getTime()
  data.forEach(ele => {
    let pid = ele.parentCategoryId
    if (!ele.children) {
      //很多都有bug的，少了这个校验
      ele.children = []
    }
    if (pid == 0) {
      //是根元素的hua ,不做任何操作,如果是正常的for-i循环,可以直接continue.
      ele.level = 1
    } else {
      //如果ele是子元素的话 ,把ele扔到他的父亲的child数组中.
      data.forEach(d => {
        if (d.id == pid) {
          let childArray = d.children
          if (!childArray) {
            childArray = []
          }
          ele.parentName = d.categoryName
          // ele.categoryType = d.categoryType
          ele.level = d.level + 1
          childArray.push(ele)
          d.children = childArray.sort(sortBy('sort'))
        }
      })
    }
  })
  var result = []
  for (let i = 0; i < data.length; i++) {
    var ele = data[i]
    if (ele.parentCategoryId == 0) {
      result.push(ele)
    }
  }
  console.log(new Date().getTime() - date)
  return result
}

export const base64ToFile = (dataurl, filename) => {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  if (!filename) {
    filename = `${new Date().getTime()}.${mime.substr(mime.indexOf('/') + 1)}`
  }
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// 缩略图
export const thumbImage = (url, width, height) => {
  let thumbPrex = `_@_thumb_center_${width}x${height}`
  url = url.replace('s3.xxxxxxx.com.cn', 's3-website.xxxxxxx.com.cn')
  let fileName = url.substring(0, url.lastIndexOf('.'))
  let suffix = url.substring(url.lastIndexOf('.'))
  return `${fileName}${thumbPrex}${suffix}`
}
