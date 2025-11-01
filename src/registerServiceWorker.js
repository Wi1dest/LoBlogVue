/* eslint-disable no-console */

import { register } from 'register-service-worker'

// 检查是否在生产环境
if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    // 注册成功
    ready () {
      console.log(
        '应用正在使用缓存的内容。'
      )
    },
    // 注册成功
    registered (registration) {
      console.log('Service worker 已注册。')
      
      // 定期检查更新
      setInterval(() => {
        registration.update()
      }, 1000 * 60 * 60) // 每小时检查一次更新
    },
    // 缓存成功
    cached () {
      console.log('内容已被缓存以供离线使用。')
    },
    // 更新时
    updatefound () {
      console.log('正在下载新内容。')
    },
    // 更新就绪
    updated (registration) {
      console.log('有新内容可用，请刷新。')
      // 发送更新事件，通知应用有新版本
      document.dispatchEvent(
        new CustomEvent('swUpdated', { detail: registration })
      )
    },
    // 离线就绪
    offline () {
      console.log('未检测到网络连接。应用在离线模式下运行。')
    },
    // 注册出错
    error (error) {
      console.error('Service worker 注册期间出错:', error)
    }
  })
}