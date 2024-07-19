'use strict'

const path = require('path')
const axios = require('axios')
const querystring = require('querystring')
const {
  createAuthUrl,
  readSamlResponse
} = require('../auth/index')
const {
  parseExcelToJson
} = require('../utils/excelParse')
const {
  excelParseToJson
} = require('../utils/excel_to_json')
const {
  textConvertToAudio
} = require('../utils/tts')
const {
  upload
} = require('../utils/upload')
const Formdata = require('form-data')
const request = require('request')
const {
  response
} = require('express')
// const ffmpeg = require('fluent-ffmpeg')
// const ffmpeg_static = require('ffmpeg-static')

exports.goAuth = (req, res) => {
  const idpKey = 'default'
  let issuerValue
  let realmURL
  let relayState
  if (req.url === '/auth') {
    issuerValue = process.env.ISSUER_VALUE_INTERNAL
    realmURL = process.env.REALMURL_INTERNAL
    relayState = process.env.RETURN_URL_INTERNAL
  } else if (req.url === '/index') {
    issuerValue = process.env.ISSUER_VALUE_EXTERNAL
    realmURL = process.env.REALMURL_EXTERNAL
    relayState = req.query.url || process.env.RETURN_URL_EXTERNAL

  }
  // res.cookie('redirectUrl', relayState, {
  //   encode: String,
  //   domain: '.xxxxxxx.cn'
  // })
  createAuthUrl(relayState, idpKey, issuerValue, realmURL, (url, err) => {
    if (!url) {
      res.send(err)
      return
    }
    res.redirect(url)
  })
}

exports.handleCallback = (req, res) => {
  if (req.url === '/tts' || req.url === '/ttsTest') {
    return res.redirect(req.url)
  }
  const SAMLResponse = req.body.SAMLResponse
  const referer = req.get('Referer')
  const RelayState = querystring.parse(referer).RelayState
  console.log('RelayState', RelayState)
  return readSamlResponse(SAMLResponse, email => {
    checkAccess(req, res, email, RelayState)
  })
}

exports.handleIndex = (req, res) => {
  if (req.url === '/healthcheck') {
    return res.redirect(req.url)
  }
  if (!req.cookies.token) {
    return res.redirect('/index')
  }
  return res.sendFile(path.resolve('./dist', 'index.html'))
}

exports.signOut = (req, res) => {
  res.clearCookie('token')
  res.redirect('/index')
}

exports.ttsTest = async (req, res) => {
  var ttsText = req.body.text
  console.log('body text:' + ttsText)
  var tt = await textConvertToAudio(ttsText)
  res.status = 200
  res.send(tt)
}

exports.getTts = async (req, res) => {
  var ttsText = req.body.text
  var audioBuffer = await textConvertToAudio(ttsText)
  upload(audioBuffer, 'LibraryResource')
    .then(url => {
      console.log('upload file url', url)
      res.status = 200
      return res.send(url)
    })
    .catch(err => {
      console.log('upload file err', err)
      res.status = 500
      return res.send(err)
    })
}

exports.getVideoInfoByUrl = async (req, res) => {
  var url = req.body.url
  request(url).pipe(res)
  // let filename = url.substring(url.lastIndexOf('/') + 1)
  // console.log(filename)
  // let writeStream = fs.createWriteStream(filename)
  // request(url).pipe(writeStream)
  // writeStream.on('finish', async () => {
  //   writeStream.end()
  //   res.status = 200
  //   let jsonBuffer = await fs.readFileSync(filename)
  //   fs.unlinkSync(filename)
  //   return res.send(jsonBuffer)
  // })
  // 使用ffmpeg截取视频第一帧
  // let exec = require('child_process').exec
  // let filename = url.substring(url.lastIndexOf('/') + 1)
  // let writeStream = fs.createWriteStream(filename)
  // request(url).pipe(writeStream)
  // writeStream.on('finish', async () => {
  //   writeStream.end()
  //   let imgname = filename.split('.')[0]
  //   fs.createWriteStream(`${imgname}.png`)
  //   exec(
  //     ffmpeg_static +
  //       ' -ss 00:00:01 -i ' +
  //       filename +
  //       ' -f image2 -y ' +
  //       imgname +
  //       '.png',
  //     async () => {
  //       let jsonBuffer = await fs.readFileSync(`${imgname}.png`)
  //       console.log(jsonBuffer)
  //       return res.send(jsonBuffer)
  //     }
  //   )
  // })
}

exports.handleRedirect = (req, res) => {
  if (process.env.NODE_ENV === 'prod')
    return res.status(401).send({
      message: 'Unauthorized'
    })
  const email = req.query.email
  console.log('email', email)
  checkAccess(req, res, email)
}

exports.clearIM = (req, res) => {
  let at = req.body.assess_token
  console.log('clearIM at', at)
  axios({
      method: 'DELETE',
      url: `${process.env.ONE_IM_SVC}/internal/debug-tools/users?clientName=xxxxxxx`,
      headers: {
        Authorization: at,
        'x-access-token': 123123,
        'x-client-key': '62551422-67EC-4ECA-B68E-07E55DF31808'
      },
      data: {
        oauth_client_id: '6CEA2AD8-3EC8-4FC4-9438-F89F8F9A9C9D',
        wechat_app_id: 'wx3196491b6ae7d9a3',
        wechat_code: '0627Ye1w3U9bhV2pk02w3DbCha07Ye1I1',
        auto_merge_password: true
      }
    })
    .then(data => {
      console.log('clearIM success', data)
      res.status = 200
      res.send({
        message: 'success'
      })
    }).catch(err => {
      console.log('clearIM error', err)
      res.status = 500
      res.send('service error')
    })
}

const checkAccess = (req, res, email, redirectUrl) => {
  let env = ''
  let url = process.env.API_URL.replace('v1', 'v2')
  if (redirectUrl && redirectUrl.indexOf('qa') > -1) env = 'qa'
  if (redirectUrl && redirectUrl.indexOf('uat') > -1) env = 'uat'
  console.log('env', env)
  if (env) url = url.replace('dev', env)
  axios({
      method: 'GET',
      url: `${url}/users/login?email=${email}`,
      headers: {
        clientKey: process.env.CLIENT_KEY
      }
    })
    .then(data => {
      const {
        token
      } = data.data
      if (!token) {
        return res.send("You don't have access!")
      }
      res.cookie('token', token, {
        encode: String,
        domain: '.xxxxxxx.cn'
      })
      if (!redirectUrl) return res.redirect('/')
      return res.redirect(
        redirectUrl.indexOf('http') > -1 ?
        redirectUrl :
        'https://' + redirectUrl
      )
    })
    .catch(err => {
      return res.send(err.message)
    })
}

exports.handleApiRequest = (req, res) => {
  let file
  let form = new Formdata()
  if (req.hasOwnProperty('file')) {
    file = req.file
    if (req.url.indexOf('doctojson') > -1) {
      if (req.query.type === 'test') {
        return res.send(parseExcelToJson(file.buffer))
      }
      return res.send(excelParseToJson(file.buffer))
    }

    form.append('file', file.buffer, {
      knownLength: file.size,
      filename: file.originalname,
      contentType: file.mimetype
    })
  }

  res.status(400).json({
    message: '请检查参数'
  })
}
