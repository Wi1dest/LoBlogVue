const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 确保图标目录存在
const iconDir = path.join(__dirname, 'public', 'img', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 使用ImageMagick转换图标
// 注意：这需要安装ImageMagick
console.log('开始生成PWA图标...');

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
  { size: 512, name: 'android-chrome-512x512.png' }
];

// 源图像路径 - 使用项目中的LoIcon.ico
const sourceIcon = path.join(__dirname, 'public', 'LoIcon.ico');

// 检查源图像是否存在
if (!fs.existsSync(sourceIcon)) {
  console.error('错误：源图像文件不存在:', sourceIcon);
  process.exit(1);
}

// 使用ImageMagick生成不同尺寸的图标
let completedCount = 0;
icons.forEach(icon => {
  const outputPath = path.join(iconDir, icon.name);
  const command = `magick convert "${sourceIcon}" -resize ${icon.size}x${icon.size} "${outputPath}"`;
  
  console.log(`生成 ${icon.name} (${icon.size}x${icon.size})...`);
  
  exec(command, (error) => {
    if (error) {
      console.error(`生成 ${icon.name} 时出错:`, error);
    } else {
      completedCount++;
      console.log(`成功生成 ${icon.name} (${completedCount}/${icons.length})`);
      
      if (completedCount === icons.length) {
        console.log('所有PWA图标已生成完成！');
      }
    }
  });
});

console.log('图标生成进行中，请稍候...');