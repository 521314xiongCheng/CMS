const AipSpeechClient = require('baidu-aip-sdk').speech
// const fs = require('fs')
//convert to text to audit,
//text length can't exceed more than 2000 words
function textConvertToAudio(text) {
  return new Promise((resolve, reject) => {
    try {
      if (text && text.length > 2000) {
        console.log('文字长度超过2000')
        reject('文字长度超过2000')
      }
      console.log('process.env.NODE_ENV', process.env.BAIDU_APP_ID)
      var baidu_APP_ID = process.env.BAIDU_APP_ID
      var baidu_API_KEY = process.env.BAIDU_API_KEY
      var baidu_SECRET_KEY = process.env.BAIDU_SECRET_KEY

      var client = new AipSpeechClient(
        baidu_APP_ID,
        baidu_API_KEY,
        baidu_SECRET_KEY
      )
      console.log('client', client)
      client
        .text2audio(text, { spd: 5, pit: 5, vol: 8, per: 0 })
        .then(
          function(result) {
            console.log('text2audio RESULT', result)
            if (result.data) {
              resolve(result.data)
            } else {
              reject(result)
            }
          },
          function(err) {
            console.log('text2audio ERR', err)
            reject(err)
          }
        )
        .catch(err => {
          console.log('text2audio catch', err)
          reject(err)
        })
    } catch (err) {
      console.log('try catch', err)
      reject(err)
    }
  })
}
exports.textConvertToAudio = textConvertToAudio
