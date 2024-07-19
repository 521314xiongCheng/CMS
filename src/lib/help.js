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

export const cleanCookie = () => {
  var myDate = new Date()
  myDate.setTime(-1000) //设置时间
  var data = document.cookie
  var dataArray = data.split('; ')
  for (var i = 0; i < dataArray.length; i++) {
    var varName = dataArray[i].split('=')
    document.cookie = varName[0] + "=''; expires=" + myDate.toGMTString()
  }
}

export const readUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo')

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
    console.log(readUserInfo().nickName)
    return readUserInfo().nickName
  } catch (_) {
    return 'NULL_USER'
  }
}

export const createCookie = (name, value) => {
  let expires = ''
  var date = new Date()
  date.setTime(date.getTime() + 2 * 60 * 60 * 1000)
  expires = '; expires=' + date.toGMTString()
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

export const timeFormatToYYYYmmDDhhMMss_region = time_stamp => {
  // 将时间格式转为 yyyy-mm-dd hh:mm:ss的形式

  if (!time_stamp) return null

  let market = localStorage.getItem('market')
  let times = 0
  if (['TW', 'HK', 'PH', 'MY', 'SG'].includes(market)) {
    times = 8 * 60 * 60 * 1000
  } else if (market == 'KR') {
    times = 9 * 60 * 60 * 1000
  } else if (market == 'AU') {
    times = 10 * 60 * 60 * 1000
  } else if (market == 'NZ') {
    times = 12 * 60 * 60 * 1000
  }

  // console.log("time_stamp==>",time_stamp)
  // console.log("times==>",times)

  let dateObj = new Date(time_stamp)
  // console.log("dateObj--1==>",dateObj)
  dateObj = new Date(dateObj.getTime() + times)
  // console.log("dateObj--2==>",dateObj)

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

export const timeFormatToYYYYmmDD_region = time_stamp => {
  // 将时间格式转为 yyyy-mm-dd hh:mm:ss的形式

  if (!time_stamp) return null

  let market = localStorage.getItem('market')
  let times = 0
  if (['TW', 'HK', 'PH', 'MY', 'SG'].includes(market)) {
    times = 8 * 60 * 60 * 1000
  } else if (market == 'KR') {
    times = 9 * 60 * 60 * 1000
  } else if (market == 'AU') {
    times = 10 * 60 * 60 * 1000
  } else if (market == 'NZ') {
    times = 12 * 60 * 60 * 1000
  }

  // console.log("time_stamp==>",time_stamp)
  // console.log("times==>",times)

  let dateObj = new Date(time_stamp)
  // console.log("dateObj--1==>",dateObj)
  dateObj = new Date(dateObj.getTime() + times)
  // console.log("dateObj--2==>",dateObj)

  let Y = dateObj.getFullYear() + '/'
  let M =
    (dateObj.getUTCMonth() + 1 < 10
      ? '0' + (dateObj.getUTCMonth() + 1)
      : dateObj.getUTCMonth() + 1) + '/'
  let D =
    (dateObj.getUTCDate() < 10
      ? '0' + dateObj.getUTCDate()
      : dateObj.getUTCDate()) + ' '

  let formatedDate = Y + M + D

  return formatedDate
}

export const timeFormatToYYYYmmDDhhMMss_region2 = time_stamp => {
  // 将时间格式转为 yyyy-mm-dd hh:mm:ss的形式

  if (!time_stamp) return null

  let market = localStorage.getItem('market')
  let times = 0
  if (['TW', 'HK', 'PH', 'MY', 'SG'].includes(market)) {
    times = 8 * 60 * 60 * 1000
  } else if (market == 'KR') {
    times = 9 * 60 * 60 * 1000
  } else if (market == 'AU') {
    times = 10 * 60 * 60 * 1000
  } else if (market == 'NZ') {
    times = 12 * 60 * 60 * 1000
  }

  let dateObj = new Date(time_stamp)
  // console.log(dateObj)
  dateObj = new Date(dateObj.getTime() - times)
  // console.log(daeObj)
  let Y = dateObj.getFullYear() + '/'
  let M =
    (dateObj.getMonth() + 1 < 10
      ? '0' + (dateObj.getMonth() + 1)
      : dateObj.getMonth() + 1) + '/'
  let D =
    (dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate()) + ' '
  let h =
    (dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()) +
    ':'
  let m =
    (dateObj.getMinutes() < 10
      ? '0' + dateObj.getMinutes()
      : dateObj.getMinutes()) + ':'
  let s =
    dateObj.getSeconds() < 10
      ? '0' + dateObj.getSeconds()
      : dateObj.getSeconds()
  let formatedDate = Y + M + D + h + m + s

  return formatedDate
}

// 计算两个时间段之间相差多少小时多少分
export function timeInterval(start, end) {
  let time = parseInt((end - start) / 1000)
  return `${parseInt(time / 3600)} hours ${parseInt(
    (time % 3600) / 60
  )} minutes`
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
              x.app_name == abcList[j][2]
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
