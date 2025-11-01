/**
 * 这个脚本用于复制现有图标并创建PWA所需的不同尺寸图标
 * 使用方法: node copy-icon.js
 */

const fs = require('fs');
const path = require('path');

// 确保图标目录存在
const iconDir = path.join(__dirname, 'public', 'img', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 创建临时目录存放base64编码的图标
const tempDir = path.join(__dirname, 'temp_icons');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// 创建一个简单的HTML文件，用于生成不同尺寸的图标
const createIconGeneratorHtml = () => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>PWA图标生成器</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .container { margin-bottom: 20px; }
    canvas { border: 1px solid #ccc; margin: 10px 0; }
    button { padding: 10px 15px; background: #409EFF; color: white; border: none; border-radius: 4px; cursor: pointer; }
    input[type="file"] { margin-bottom: 10px; }
    .icon-preview { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
    .icon-item { text-align: center; }
    .icon-item img { border: 1px solid #eee; }
    .icon-item p { margin: 5px 0; font-size: 12px; }
    .instructions { background: #f8f8f8; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
    .instructions ol { padding-left: 20px; }
    .instructions li { margin-bottom: 10px; }
    .download-all { margin-top: 20px; }
  </style>
</head>
<body>
  <h1>PWA图标生成器</h1>
  
  <div class="instructions">
    <h3>使用说明：</h3>
    <ol>
      <li>选择一个方形图片作为图标源（建议使用512x512或更大尺寸的PNG图片）</li>
      <li>点击"生成PWA图标"按钮</li>
      <li>预览生成的各种尺寸图标</li>
      <li>点击"下载所有图标"按钮，将生成一个zip文件</li>
      <li>解压下载的zip文件，将所有图标放入项目的public/img/icons/目录中</li>
    </ol>
  </div>

  <div class="container">
    <input type="file" id="imageInput" accept="image/*">
    <button id="generateBtn">生成PWA图标</button>
  </div>

  <div id="canvasContainer"></div>
  
  <div class="icon-preview" id="iconPreview"></div>
  
  <div class="download-all">
    <button id="downloadBtn" style="display: none;">下载所有图标</button>
  </div>

  <script>
    // 需要生成的图标尺寸
    const iconSizes = [
      { size: 16, name: 'favicon-16x16.png' },
      { size: 32, name: 'favicon-32x32.png' },
      { size: 60, name: 'apple-touch-icon-60x60.png' },
      { size: 76, name: 'apple-touch-icon-76x76.png' },
      { size: 120, name: 'apple-touch-icon-120x120.png' },
      { size: 144, name: 'msapplication-icon-144x144.png' },
      { size: 152, name: 'apple-touch-icon-152x152.png' },
      { size: 180, name: 'apple-touch-icon-180x180.png' },
      { size: 180, name: 'apple-touch-icon.png' },
      { size: 192, name: 'android-chrome-192x192.png' },
      { size: 512, name: 'android-chrome-512x512.png' }
    ];

    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const imageInput = document.getElementById('imageInput');
    const canvasContainer = document.getElementById('canvasContainer');
    const iconPreview = document.getElementById('iconPreview');
    
    let generatedIcons = [];

    generateBtn.addEventListener('click', () => {
      const file = imageInput.files[0];
      if (!file) {
        alert('请先选择一个图片文件');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          canvasContainer.innerHTML = '';
          iconPreview.innerHTML = '';
          generatedIcons = [];

          iconSizes.forEach(iconConfig => {
            const { size, name } = iconConfig;
            
            // 创建canvas并绘制图标
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, size, size);
            
            // 获取图标的data URL
            const dataUrl = canvas.toDataURL('image/png');
            generatedIcons.push({ name, dataUrl });
            
            // 创建预览
            const iconItem = document.createElement('div');
            iconItem.className = 'icon-item';
            
            const iconImg = document.createElement('img');
            iconImg.src = dataUrl;
            iconImg.width = size;
            iconImg.height = size;
            
            const iconName = document.createElement('p');
            iconName.textContent = name;
            
            const iconSize = document.createElement('p');
            iconSize.textContent = \`\${size}x\${size}\`;
            
            iconItem.appendChild(iconImg);
            iconItem.appendChild(iconName);
            iconItem.appendChild(iconSize);
            
            iconPreview.appendChild(iconItem);
          });
          
          downloadBtn.style.display = 'block';
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    downloadBtn.addEventListener('click', () => {
      // 创建一个文本区域，包含所有图标的base64编码
      let textContent = '';
      generatedIcons.forEach(icon => {
        textContent += \`\${icon.name}:\${icon.dataUrl}\n\n\`;
      });
      
      // 创建一个Blob对象
      const blob = new Blob([textContent], { type: 'text/plain' });
      
      // 创建一个下载链接
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'lo_icon_base64.txt';
      
      // 触发下载
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      alert('图标已下载为文本文件。请将此文件放在项目根目录的temp_icons文件夹中，然后运行node copy-icon.js命令来处理这些图标。');
    });
  </script>
</body>
</html>
  `;

  fs.writeFileSync(path.join(__dirname, 'pwa-icon-generator.html'), html);
  console.log('已创建PWA图标生成器HTML文件：pwa-icon-generator.html');
  console.log('请在浏览器中打开此文件，按照说明生成图标。');
};

// 检查是否存在base64编码的图标文件
const base64File = path.join(tempDir, 'lo_icon_base64.txt');
if (fs.existsSync(base64File)) {
  console.log('找到图标base64文件，开始处理...');
  
  // 读取base64文件内容
  const content = fs.readFileSync(base64File, 'utf8');
  
  // 分割每个图标的数据
  const iconEntries = content.split('\n\n');
  
  // 处理每个图标
  iconEntries.forEach(entry => {
    if (!entry.trim()) return;
    
    const [filename, base64Data] = entry.split(':');
    if (!filename || !base64Data) return;
    
    // 从base64数据中提取实际的base64编码部分
    const base64Match = base64Data.match(/^data:image\/\w+;base64,(.+)$/);
    if (!base64Match) return;
    
    const imageData = Buffer.from(base64Match[1], 'base64');
    
    // 写入图标文件
    fs.writeFileSync(path.join(iconDir, filename.trim()), imageData);
    console.log(`已创建图标: ${filename.trim()}`);
  });
  
  console.log('所有PWA图标已成功创建！');
} else {
  console.log('未找到图标base64文件。');
  console.log('将为您创建一个HTML工具来生成PWA图标...');
  createIconGeneratorHtml();
}