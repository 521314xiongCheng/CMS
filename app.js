const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes/index')
const history = require('connect-history-api-fallback')
const Proxy = require('http-proxy-middleware')
const NodeCache = require('node-cache')
const tokenCache = new NodeCache()
const app = express()

app.use(cors())

const read = require('read-yaml')

// read dev manifest config
if (
  typeof process.env.NODE_ENV === 'undefined' ||
  process.env.NODE_ENV === 'local'
) {
  const {
    env
  } = read.sync(
    './manifest_config/external/manifest_local.yml'
  ).applications[0]
  Object.keys(env).forEach(i => {
    process.env[i] = env[i]
  })
}

app.all('/getTts', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')

  res.header('Access-Control-Allow-Origin', '*')

  res.header('Access-Control-Allow-Headers', '*')

  res.header('Access-Control-Allow-Methods', '*')

  res.header('Content-Type', 'application/json;charset=utf-8')

  next()
})

app.all('/clearIM', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')

  res.header('Access-Control-Allow-Headers', '*')

  res.header('Access-Control-Allow-Methods', '*')

  res.header('Content-Type', 'application/json;charset=utf-8')

  next()
})

app.all('/getVideoInfoByUrl', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')

  res.header('Access-Control-Allow-Headers', '*')

  res.header('Access-Control-Allow-Methods', '*')

  res.header('Content-Type', 'application/json;charset=utf-8')
})

app.all('/getVideoInfoByUrl', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')

  res.header('Access-Control-Allow-Headers', '*')

  res.header('Access-Control-Allow-Methods', '*')

  res.header('Content-Type', 'application/json;charset=utf-8')

  next()
})

app.use(
  cookieSession({
    name: 'session',
    keys: ['ContentCMS20170927'],
    secure: false,
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
)

const setHeadersRules = [{
    match: /^\/proxy\/content/,
    header: 'clientkey',
    headerValue: process.env.CLIENT_KEY
  },
  {
    match: /^\/proxy\/staffConsultant/,
    header: 'clientkey',
    headerValue: process.env.CLIENT_KEY
  },
  {
    match: /^\/proxy\/catalog/,
    header: 'Client-Key',
    headerValue: process.env.CATALOG_CLIENT_KEY
  },
  {
    match: /^\/proxy\/product/,
    header: 'Client-Key',
    headerValue: process.env.CATALOG_CLIENT_KEY
  },
  {
    match: /^\/proxy\/articles/,
    header: 'x-client-key',
    headerValue: 'fabf805d-0b42-11ea-af7e-02dff2cc3370'
  },
  {
    match: /^\/proxy\/dashboard/,
    header: 'x-client-key',
    headerValue: 'fabf805d-0b42-11ea-af7e-02dff2cc3370'
  },
  {
    match: /^\/proxy\/weather/,
    header: 'x-client-key',
    headerValue: process.env.Weather_CLIENT_KEY
  },
  {
    match: /^\/proxy\/mock/,
    header: 'clientkey',
    headerValue: 'fabf805d-0b42-11ea-af7e-02dff2cc3370'
  },
  {
    match: /^\/proxy\/baiduApi/
  },
  {
    match: /^\/proxy\/topic/,
    header: 'x-client-key',
    headerValue: process.env.xxxxxxx_TOPIC_CLIENT_KEY
  },
  {
    match: /^\/proxy\/power/,
    header: 'x-client-key',
    headerValue: process.env.xxxxxxx_POWER_CLIENT_KEY
  },
  {
    match: /^\/proxy\/power/,
    header: 'Subsidiary',
    headerValue: 'CN'
  },
  {
    match: /^\/proxy\/entWechat/,
    header: 'x-client-key',
    headerValue: process.env.EntWechat_CLIENT_KEY
  },
  {
    match: /^\/proxy\/xxxxxxx/,
    header: 'clientkey',
    headerValue: '14f74a3e-f7a1-4cc4-a1a9-92582f709962'
  }
]

const proxyOptions = {
  target: process.env.API_URL,
  changeOrigin: true,
  secure: false,
  logLevel: 'debug',
  pathRewrite: {
    '^/proxy/content': '',
    '^/proxy/staffConsultant': '',
    '^/proxy/articles': '',
    '^/proxy/catalog': '',
    '^/proxy/product': '',
    '^/proxy/dashboard': '',
    '^/proxy/mock': '',
    '^/proxy/weather': '',
    '^/proxy/baiduApi': '',
    '^/proxy/topic': '',
    '^/proxy/power': '',
    '^/proxy/libraryv2': '',
    '^/proxy/entWechat': '',
    '^/proxy/xxxxxxx': ''
  },
  router: {
    '/proxy/content': process.env.API_URL,
    '/proxy/staffConsultant': process.env.API_URL_v2,
    '/proxy/catalog': process.env.Catalog_API_URL,
    '/proxy/product': process.env.Product_API_URL,
    '/proxy/articles': process.env.Article_API_URL,
    '/proxy/dashboard': process.env.Dashboard_API_URL,
    '/proxy/mock': 'https://mock.xxxxxxx.com.cn/',
    '/proxy/weather': process.env.Weather_API_URL,
    '/proxy/baiduApi': 'https://aip.baidubce.com',
    '/proxy/topic': process.env.xxxxxxx_TOPIC_API_URL,
    '/proxy/power': process.env.xxxxxxx_POWER_API_URL,
    '/proxy/libraryv2': process.env.API_URL.replace('v1', 'v2'),
    '/proxy/entWechat': process.env.EntWechat_API_URL,
    '/proxy/xxxxxxx': process.env.xxxxxxx_APP_SERVICE_URL
  },
  onProxyReq: function (proxyReq, req, res) {
    const token = req.headers.authorization
    for (let index = 0; index < setHeadersRules.length; index++) {
      const item = setHeadersRules[index]
      if (req.originalUrl.match(item.match)) {
        proxyReq.setHeader(item.header, item.headerValue)
      }
    }

    if (token) {
      proxyReq.setHeader('Authorization', token)
    }
    if (req.url === '/users/verified') {
      proxyReq.setHeader('clientId', process.env.CLIENT_KEY)
    } else {
      if (!req.headers.token) {
        res.writeHead(401, {
          'Content-Type': 'application/json'
        })
        res.end(`{"code":-1,"message":"token is null"}`)
        return
      }

      let verifyToken = tokenCache.get(req.headers.token)
      if (!verifyToken || !req.headers.token) {
        res.writeHead(401, {
          'Content-Type': 'application/json'
        })
        res.end(`{"code":-1,"message":"token is incorrect,please relogin"}`)
        return
      }
    }
  },
  onProxyRes: (proxyRes, req) => {
    if (req.url === '/users/verified') {
      tokenCache.set(req.headers.token, req.headers.token, 4 * 60 * 60)
    }
  }
}
const proxy = Proxy(proxyOptions)
app.use('/proxy', proxy)

app.use(
  '/local/check',
  Proxy({
    target: process.env.API_URL.replace('v1', 'v2'),
    changeOrigin: true,
    onProxyReq: function (proxyReq) {
      proxyReq.setHeader('clientkey', process.env.CLIENT_KEY)
    },
    pathRewrite: {
      '^/local/check': ''
    }
  })
)
// proxy internal apis
// app.use(
//   '/proxy/content',
//   proxy({
//     target: process.env.API_URL,
//     changeOrigin: true,
//     onProxyReq: function(proxyReq, req) {
//       const token = req.headers.authorization
//       proxyReq.setHeader('clientkey', process.env.CLIENT_KEY)
//       if (token) {
//         proxyReq.setHeader('Authorization', token)
//       }
//       if (req.url === '/users/verified') {
//         proxyReq.setHeader('clientId', process.env.CLIENT_KEY)
//       }
//     },
//     pathRewrite: { '^/proxy/content': '' }
//   })
// )
// app.use(
//   '/category',
//   proxy({
//     target: process.env.PRODUCT_API_URL,
//     changeOrigin: true,
//     onProxyReq: function(proxyReq, req) {
//       const token = req.headers.authorization
//       proxyReq.setHeader('clientkey', 'fabf805d-0b42-11ea-af7e-02dff2cc3370')
//       if (token) {
//         proxyReq.setHeader('Authorization', token)
//       }
//       if (req.url === '/users/verified') {
//         proxyReq.setHeader('clientId', process.env.CLIENT_KEY)
//       }
//     },
//     pathRewrite: { '^/category': '' }
//   })
// )
// app.use(
//   '/dashboard',
//   proxy({
//     target: process.env.Dashboard_API_URL,
//     changeOrigin: true,
//     onProxyReq: function(proxyReq, req) {
//       const token = req.headers.authorization
//       proxyReq.setHeader('clientkey', 'fabf805d-0b42-11ea-af7e-02dff2cc3370')
//       if (token) {
//         proxyReq.setHeader('Authorization', token)
//       }
//       if (req.url === '/users/verified') {
//         proxyReq.setHeader('clientId', process.env.CLIENT_KEY)
//       }
//     },
//     pathRewrite: { '^/dashboard': '' }
//   })
// )
// app.use(
//   '/articles',
//   proxy({
//     target: process.env.Article_API_URL,
//     changeOrigin: true,
//     onProxyReq: function(proxyReq, req) {
//       // eslint-disable-next-line no-console
//       console.log(2)
//       const token = req.headers.authorization
//       proxyReq.setHeader('x-client-key', 'fabf805d-0b42-11ea-af7e-02dff2cc3370')
//       if (token) {
//         proxyReq.setHeader('Authorization', token)
//       }
//       if (req.url === '/users/verified') {
//         proxyReq.setHeader('clientId', process.env.CLIENT_KEY)
//       }
//     },
//     pathRewrite: { '^/articles': '' }
//   })
// )
// app.use(
//   '/mock',
//   proxy({
//     target: 'https://mock.xxxxxxx.com.cn/mock/271/v1',
//     changeOrigin: true,
//     onProxyReq: function(proxyReq) {
//       proxyReq.setHeader('clientkey', 'fabf805d-0b42-11ea-af7e-02dff2cc3370')
//     },
//     pathRewrite: { '^/mock': '' }
//   })
// )

app.disable('x-powered-by')
app.use(logger('dev'))
app.use(
  bodyParser.json({
    limit: '50mb'
  })
)
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  })
)
app.use(cookieParser())

app.use('/', routes)
// 处理 Vue-router mode history 情况
const staticFileMiddleware = express.static('dist')
app.use(
  history({
    disableDotRule: true,
    verbose: true
  })
)
app.use(staticFileMiddleware)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res) => {
  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'dev' ? err : {}

  // Render the error page
  res.status(err.status || 500)
  res.render('error')
})
module.exports = app
