module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  productionSourceMap: false,
  devServer: {
    port: 8080,
    open: true
  },
  // PWA配置
  pwa: {
    name: 'Lo哔哔机',
    themeColor: 'transparent',
    msTileColor: '#409EFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'transparent',
    // 简化的Workbox配置
    workboxOptions: {
      // 不缓存开发环境
      skipWaiting: true,
      clientsClaim: true,
      // 简化缓存策略
      runtimeCaching: [
        // 缓存API请求
        {
          urlPattern: new RegExp('^https://api\\.example\\.com/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 1天
            }
          }
        },
        // 缓存图片
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7天
            }
          }
        },
        // 缓存JS和CSS
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 1天
            }
          }
        },
        // 缓存字体
        {
          urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30天
            }
          }
        },
        // 缓存CDN资源
        {
          urlPattern: /^https:\/\/cdnjs\.cloudflare\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'cdn-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7天
            }
          }
        }
      ]
    },
    // manifest配置
    manifestOptions: {
      name: 'Lo哔哔机',
      short_name: 'Lo哔哔机',
      description: '一个基于Vue的个人博客',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#409EFF',
      icons: [
        {
          src: './img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: './img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    // 图标配置
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/mstile-150x150.png'
    }
  }
}