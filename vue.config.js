const S3Plugin = require('webpack-s3-plugin')
const AWS = require('aws-sdk')
const assetsDir = `ContentCMS/cms/${formatDate()}`
const path = require('path')
function resolve(dir) {
  // 路径可能与你的项目不同
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production'
      ? 'https://appdl.xxxxxxx.com.cn'
      : '/',
  assetsDir,
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new S3Plugin({
          exclude: /.*\.html$/,
          s3Options: {
            credentials: new AWS.EC2MetadataCredentials({
              httpOptions: { timeout: 5000 },
              maxRetries: 10,
              retryDelayOptions: { base: 200 }
            }),
            region: 'cn-north-1'
          },
          s3UploadOptions: {
            Bucket: 'bjs-s3-mdm-prod-mkc-mobile-resources'
          },
          cdnizerOptions: {
            defaultCDNBase: 'https://appdl.xxxxxxx.com.cn'
          }
        })
      )
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}

function formatDate() {
  const date = new Date()
  const day = ('0' + date.getDate()).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const year = date.getFullYear()
  return `${year}${month}${day}`
}
