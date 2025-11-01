// 使用Sharp库生成PWA图标
// 安装依赖: npm install sharp

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 确保图标目录存在
const iconDir = path.join(__dirname, 'public', 'img', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 检查是否有base64编码的图标文件
const tempDir = path.join(__dirname, 'temp_icons');
const base64File = path.join(tempDir, 'lo_icon_base64.txt');

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
  { size: 512, name: 'android-chrome-512x512.png' },
  // 添加可遮罩图标
  { size: 192, name: 'android-chrome-maskable-192x192.png' },
  { size: 512, name: 'android-chrome-maskable-512x512.png' }
];

// 使用Sharp生成不同尺寸的图标
async function generateIcons(sourceBuffer) {
  console.log('开始生成PWA图标...');
  
  try {
    // 创建一个Promise数组来跟踪所有图标生成任务
    const tasks = icons.map(icon => {
      const outputPath = path.join(iconDir, icon.name);
      return sharp(sourceBuffer)
        .resize(icon.size, icon.size)
        .toFile(outputPath)
        .then(() => {
          console.log(`成功生成 ${icon.name} (${icon.size}x${icon.size})`);
        });
    });
    
    // 等待所有图标生成完成
    await Promise.all(tasks);
    console.log('所有PWA图标已生成完成！');
  } catch (error) {
    console.error('生成图标时出错:', error);
  }
}

// 主函数
async function main() {
  // 首先尝试从base64文件中获取图标数据
  if (fs.existsSync(base64File)) {
    console.log('找到图标base64文件，开始处理...');
    
    // 读取base64文件内容
    const content = fs.readFileSync(base64File, 'utf8');
    
    // 分割每个图标的数据
    const iconEntries = content.split('\n\n');
    
    // 查找512x512的图标作为源
    let sourceBase64 = null;
    for (const entry of iconEntries) {
      if (!entry.trim()) continue;
      
      const [filename, base64Data] = entry.split(':');
      if (!filename || !base64Data) continue;
      
      if (filename.trim() === 'android-chrome-512x512.png') {
        // 从base64数据中提取实际的base64编码部分
        const base64Match = base64Data.match(/^data:image\/\w+;base64,(.+)$/);
        if (base64Match) {
          sourceBase64 = base64Match[1];
          break;
        }
      }
    }
    
    if (sourceBase64) {
      // 使用找到的base64数据作为源
      const sourceBuffer = Buffer.from(sourceBase64, 'base64');
      await generateIcons(sourceBuffer);
      return;
    }
  }
  
  // 如果没有找到base64文件或512x512图标，尝试使用现有的图标文件
  const existingIconPath = path.join(iconDir, 'android-chrome-512x512.png');
  if (fs.existsSync(existingIconPath)) {
    console.log('使用现有的512x512图标作为源...');
    await generateIcons(fs.readFileSync(existingIconPath));
    return;
  }
  
  // 如果没有找到合适的源图像，尝试使用LoIcon.ico
  // 注意：Sharp可能无法直接处理.ico文件
  try {
    const sourceIcon = path.join(__dirname, 'public', 'LoIcon.ico');
    if (fs.existsSync(sourceIcon)) {
      console.log('尝试使用LoIcon.ico作为源...');
      await generateIcons(fs.readFileSync(sourceIcon));
      return;
    }
  } catch (error) {
    console.error('无法使用.ico文件作为源:', error);
  }
  
  console.error('错误：找不到合适的源图像。请提供一个512x512的PNG图像作为源。');
  console.log('提示：您可以使用pwa-icon-generator.html工具生成base64编码的图标。');
}

// 执行主函数
main();