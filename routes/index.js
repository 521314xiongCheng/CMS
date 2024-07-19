const express = require('express')
const Controller = require('../controller/index')
const router = express.Router() // eslint-disable-line
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage
})

/* GET home page. */
router.post('/ttsTest', Controller.ttsTest)
router.post('/getTts', Controller.getTts)
router.post('/clearIM', Controller.clearIM)
router.post('/getVideoInfoByUrl', Controller.getVideoInfoByUrl)
router.post('/', Controller.handleCallback)
router.post('/index', Controller.handleCallback)
router.get('/', Controller.handleIndex)

router.post('/doctojson', upload.single('file'), Controller.handleApiRequest)

router.get('/env', (req, res) => res.send(process.env.NODE_ENV))
router.get('/healthcheck', (req, res) => res.send('OK'))
router.get('/cloudfoundryapplication', (req, res) => res.send('OK'))
router.get('/auth', Controller.goAuth)
router.get('/index', Controller.goAuth)
router.get('/signOut', Controller.signOut)
router.get('/redirect', Controller.handleRedirect)
module.exports = router
