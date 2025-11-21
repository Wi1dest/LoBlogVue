# LoBlogVue

一个基于 Vue.js 的现代化博客系统，支持 PWA 功能。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build
```

## 📦 部署指南

### Vercel 部署

1. **通过 GitHub 部署（推荐）**
   - Fork 本项目到你的 GitHub
   - 访问 [Vercel](https://vercel.com)
   - 点击 "New Project" 并选择你的 GitHub 仓库
   - 配置环境变量（见下方配置）
   - 点击 "Deploy"

2. **通过 Vercel CLI 部署**
   ```bash
   # 安装 Vercel CLI
   npm i -g vercel
   
   # 登录 Vercel
   vercel login
   
   # 部署
   vercel --prod
   ```

### Cloudflare Pages 部署

1. **通过 GitHub 部署**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 进入 "Pages" 页面
   - 点击 "Create a project" → "Connect to Git"
   - 选择你的 GitHub 仓库
   - 配置构建设置：
     - 构建命令：`npm run build`
     - 构建输出目录：`dist`
   - 配置环境变量（见下方配置）
   - 点击 "Save and Deploy"

2. **通过 Wrangler CLI 部署**
   ```bash
   # 安装 Wrangler
   npm install -g wrangler
   
   # 登录 Cloudflare
   wrangler login
   
   # 构建项目
   npm run build
   
   # 部署到 Cloudflare Pages
   wrangler pages publish dist
   ```

## ⚙️ 环境变量配置

### 必需的环境变量

在部署平台中配置以下环境变量：

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `VUE_APP_BASE_URL` | 后端 API 基础地址 | `https://api.yourdomain.com` |

### 可选的环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `VUE_APP_FONT_FILE` | 自定义字体文件地址 | - |

### Vercel 环境变量配置

1. 在 Vercel 项目设置中找到 "Environment Variables"
2. 添加环境变量：
   ```
   VUE_APP_BASE_URL = https://your-api-domain.com
   ```

### Cloudflare Pages 环境变量配置

1. 在 Cloudflare Pages 项目设置中找到 "Environment variables"
2. 添加环境变量：
   ```
   VUE_APP_BASE_URL = https://your-api-domain.com
   ```

## 🔧 配置文件说明

### `src/utils/constant.js`

主要配置文件，包含：
- API 地址配置
- 第三方服务配置
- 主题颜色配置
- 功能开关配置

关键配置项：
```javascript
// API 基础地址（支持环境变量）
baseURL: process.env.VUE_APP_BASE_URL || "默认地址"

// 加密密钥（16位）
cryptojs_key: "aoligeimeimaobin"

// 用户ID和来源
userId: 1,
source: 0
```

## 📝 部署注意事项

1. **API 地址配置**：确保 `VUE_APP_BASE_URL` 指向正确的后端服务地址
2. **HTTPS 支持**：生产环境建议使用 HTTPS
3. **跨域配置**：确保后端服务允许前端域名的跨域请求
4. **缓存策略**：静态资源建议配置适当的缓存策略

## 🛠️ 构建配置

### Vercel 配置文件 `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Cloudflare Pages 配置文件 `_redirects`

```
/*    /index.html   200
```

## 📱 PWA 功能

项目支持 PWA（Progressive Web App）功能：
- 离线访问
- 桌面安装
- 推送通知

确保在生产环境中正确配置 Service Worker。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License