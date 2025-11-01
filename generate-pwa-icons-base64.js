// 使用base64数据生成PWA图标
const fs = require('fs');
const path = require('path');

// 确保图标目录存在
const iconDir = path.join(__dirname, 'public', 'img', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 检查是否有base64编码的图标文件
const tempDir = path.join(__dirname, 'temp_icons');
const base64File = path.join(tempDir, 'lo_icon_base64.txt');

console.log('开始处理PWA图标...');

// 检查base64文件是否存在
if (fs.existsSync(base64File)) {
  console.log('找到图标base64文件，开始处理...');
  
  // 读取base64文件内容
  const content = fs.readFileSync(base64File, 'utf8');
  
  // 分割每个图标的数据
  const iconEntries = content.split('\n\n');
  let processedCount = 0;
  
  // 处理每个图标
  iconEntries.forEach(entry => {
    if (!entry.trim()) return;
    
    const colonIndex = entry.indexOf(':');
    if (colonIndex === -1) return;
    
    const filename = entry.substring(0, colonIndex).trim();
    const base64Data = entry.substring(colonIndex + 1).trim();
    
    // 从base64数据中提取实际的base64编码部分
    const base64Match = base64Data.match(/^data:image\/\w+;base64,(.+)$/);
    if (!base64Match) return;
    
    const imageData = Buffer.from(base64Match[1], 'base64');
    
    // 写入图标文件
    const outputPath = path.join(iconDir, filename);
    fs.writeFileSync(outputPath, imageData);
    console.log(`已创建图标: ${filename} (${imageData.length} 字节)`);
    processedCount++;
  });
  
  console.log(`处理完成！成功创建 ${processedCount} 个PWA图标。`);
} else {
  console.error('错误：找不到base64图标文件。');
  console.log(`请确保文件存在于: ${base64File}`);
}