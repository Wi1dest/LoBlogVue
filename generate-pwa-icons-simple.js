// 使用Sharp库生成PWA图标 - 简化版
// 安装依赖: npm install sharp

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 确保图标目录存在
const iconDir = path.join(__dirname, 'public', 'img', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 检查现有图标
console.log('检查现有图标...');
const existingIcons = fs.readdirSync(iconDir);
console.log(`找到 ${existingIcons.length} 个现有图标`);

// 查找最大尺寸的图标作为源
let sourceIcon = null;
let maxSize = 0;

for (const icon of existingIcons) {
  if (icon.includes('android-chrome') && icon.includes('512')) {
    sourceIcon = path.join(iconDir, icon);
    maxSize = 512;
    break;
  }
}

if (!sourceIcon && existingIcons.length > 0) {
  // 如果没有找到512尺寸的图标，使用任何现有图标
  sourceIcon = path.join(iconDir, existingIcons[0]);
  console.log(`未找到512x512图标，将使用 ${existingIcons[0]} 作为源`);
}

// 如果没有找到任何图标，尝试使用项目根目录中的图标
if (!sourceIcon) {
  const rootIcon = path.join(__dirname, 'public', 'LoIcon.ico');
  if (fs.existsSync(rootIcon)) {
    sourceIcon = rootIcon;
    console.log('将使用项目根目录中的LoIcon.ico作为源');
  }
}

// 如果仍然没有找到图标，退出
if (!sourceIcon) {
  console.error('错误：找不到源图标。请确保项目中有至少一个图标文件。');
  process.exit(1);
}

// 需要生成的图标尺寸和名称
const icons = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 144, name: 'msapplication-icon-144x144.png' },
  { size: 150, name: 'mstile-150x150.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 192, name: 'android-chrome-maskable-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 512, name: 'android-chrome-maskable-512x512.png' }
];

// 使用Sharp生成不同尺寸的图标
async function generateIcons() {
  console.log(`开始生成PWA图标，使用源图标: ${sourceIcon}`);
  
  try {
    // 读取源图标
    const sourceBuffer = fs.readFileSync(sourceIcon);
    
    // 创建一个Promise数组来跟踪所有图标生成任务
    const tasks = icons.map(icon => {
      // 跳过已经存在的图标
      const outputPath = path.join(iconDir, icon.name);
      if (fs.existsSync(outputPath) && path.basename(sourceIcon) !== icon.name) {
        console.log(`跳过已存在的图标: ${icon.name}`);
        return Promise.resolve();
      }
      
      return sharp(sourceBuffer)
        .resize(icon.size, icon.size)
        .png() // 确保输出为PNG格式
        .toFile(outputPath)
        .then(() => {
          console.log(`成功生成 ${icon.name} (${icon.size}x${icon.size})`);
        })
        .catch(err => {
          console.error(`生成 ${icon.name} 时出错:`, err);
        });
    });
    
    // 等待所有图标生成完成
    await Promise.all(tasks);
    console.log('所有PWA图标已生成完成！');
  } catch (error) {
    console.error('生成图标时出错:', error);
  }
}

// 执行图标生成
generateIcons();