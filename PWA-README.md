# 博客PWA功能说明

本博客已经支持PWA（渐进式Web应用）功能，使用户可以将网站添加到主屏幕，并在离线状态下使用。

## PWA功能特点

1. **离线访问**：即使在没有网络连接的情况下，用户仍然可以访问已缓存的内容
2. **添加到主屏幕**：用户可以将网站添加到设备主屏幕，像原生应用一样使用
3. **自动更新**：当有新版本可用时，会自动提示用户更新
4. **快速加载**：通过缓存策略，提高页面加载速度

## 技术实现

本项目使用以下技术实现PWA功能：

- `@vue/cli-plugin-pwa`：Vue CLI的PWA插件
- `register-service-worker`：用于注册Service Worker的库
- `Workbox`：Google的Service Worker工具库，用于缓存策略管理

## 缓存策略

项目使用了以下缓存策略：

1. **API请求**：使用NetworkFirst策略，优先从网络获取，网络不可用时使用缓存
2. **图片资源**：使用CacheFirst策略，优先从缓存获取，提高加载速度
3. **JS和CSS文件**：使用StaleWhileRevalidate策略，先从缓存获取，同时在后台更新缓存
4. **字体文件**：使用CacheFirst策略，优先从缓存获取
5. **CDN资源**：使用StaleWhileRevalidate策略，确保资源更新的同时提供快速访问

## 更新机制

当有新版本可用时，系统会自动检测并通过右下角的提示框通知用户。用户可以选择：

- **立即刷新**：立即更新到最新版本
- **稍后提醒**：稍后再次提示更新

系统会定期（每小时）检查更新，确保用户能够使用最新版本。

## 图标生成

项目包含了一个图标生成脚本`generate-pwa-icons.js`，可以根据基础图标生成各种尺寸的PWA图标：

```bash
# 安装依赖
npm install sharp

# 运行图标生成脚本
node generate-pwa-icons.js
```

## 测试PWA功能

要测试PWA功能，请按照以下步骤操作：

1. 构建生产版本：`npm run build`
2. 使用HTTP服务器提供构建后的文件（如使用`serve -s dist`）
3. 在Chrome浏览器中访问网站
4. 打开开发者工具，切换到"Application"标签
5. 在"Service Workers"部分查看Service Worker状态
6. 在"Manifest"部分查看Web App Manifest信息
7. 使用Chrome的Lighthouse工具进行PWA评分测试

## 注意事项

- PWA功能仅在HTTPS或localhost环境下可用
- 某些浏览器可能不完全支持PWA的所有功能
- 首次访问网站时，PWA功能可能不会立即生效，需要用户多次访问才会提示添加到主屏幕