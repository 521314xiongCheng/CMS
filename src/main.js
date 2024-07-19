import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import storage from 'good-storage'
import 'element-ui/lib/theme-chalk/index.css'
// import './styles/style/theme/index.css' //主题编辑器
// import '../theme/index.css' //命令行主题工具
import 'nprogress/nprogress.css'
import locale from 'element-ui/lib/locale/lang/en'
import 'normalize.css'
import './styles/style.less'
import App from './App.vue'
import axios from './lib/my_axios'
import './icons' // icon
import quillEditor from 'vue-quill-editor'
import './styles/plugin/quill/quill.core.css'
import './styles/plugin/quill/quill.snow.css'
import './styles/plugin/quill/quill.bubble.css'
import Vconsole from 'vconsole'
let cssText = storage.get('cssText')
if (cssText) {
  let styleTag = document.getElementById('chalk-style')
  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.setAttribute('id', 'chalk-style')
    document.head.appendChild(styleTag)
  }
  styleTag.innerText = cssText
}
let Size = quillEditor.Quill.import('attributors/style/size')
Size.whitelist = ['10px', '12px', '14px', '16px', '20px', '24px', '36px', false]
quillEditor.Quill.register(Size, true)
Vue.use(quillEditor)
Vue.use(ElementUI, { locale })

let envs = location.host.includes('dev-')
  ? 'dev'
  : location.host.includes('qa-')
  ? 'qa'
  : location.host.includes('uat-')
  ? 'uat'
  : ''
if (envs) {
  let vConsole = new Vconsole()
  Vue.use(vConsole)
}

// 添加自定义方法
if (!Vue.prototype.hasOwnProperty('$curl')) {
  Vue.prototype['$curl'] = axios
}

import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
