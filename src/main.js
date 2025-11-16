import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import ElementUI from 'element-ui'
import http from './utils/request'
import common from './utils/common'
import constant from './utils/constant'
import mavonEditor from 'mavon-editor'
//引入js
// import './utils/live2d'
import './utils/title'
//引入css
// 设置自定义字体
const fontFile = process.env.VUE_APP_FONT_FILE || 'LXGWWenKaiGBLite.woff2'
console.log('Font file from env:', process.env.VUE_APP_FONT_FILE)
console.log('Using font file:', fontFile)

let fontUrl = ''
try {
  // 尝试导入指定的字体文件
  fontUrl = require(`@/assets/fonts/${fontFile}`)
  console.log('Successfully loaded font:', fontFile)
} catch (e) {
  // 如果指定的字体文件不存在，回退到默认字体
  console.warn('Failed to load custom font:', fontFile, ', fallback to default')
  try {
    fontUrl = require('@/assets/fonts/LXGWWenKaiGBLite.woff2')
    console.log('Using default font')
  } catch (fallbackError) {
    console.error('Error loading default font:', fallbackError)
  }
}

if (fontUrl) {
  console.log('Setting CSS variable for font:', fontUrl)
  // 动态创建 @font-face 规则
  const style = document.createElement('style')
  style.textContent = `
    @font-face {
      font-family: MyGlobalFont;
      src: url(${fontUrl});
      font-display: swap;
    }
  `
  document.head.appendChild(style)
}

import './assets/css/animation.css'
import './assets/css/tocbot.css'
import './assets/css/color.css'
import './assets/css/markdown-highlight.css'
import './assets/css/font-awesome.min.css'
import 'mavon-editor/dist/css/index.css'
import './assets/css/index.css'

import {vueBaberrage} from 'vue-baberrage'

Vue.use(ElementUI)
Vue.use(vueBaberrage)
Vue.use(mavonEditor)

Vue.prototype.$http = http
Vue.prototype.$common = common
Vue.prototype.$constant = constant

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')