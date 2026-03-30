#!/usr/bin/env node

const { Command } = require('commander');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const program = new Command();

const PORT = 3000;
const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 - 页面未找到</h1>');
      return;
    }
    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  });
}

program
  .name('poetry-site')
  .description('《中国诗词大会》静态网站 CLI 工具')
  .version('1.0.0');

program
  .command('init')
  .description('初始化项目')
  .action(() => {
    console.log('🚀 正在初始化项目...');
    
    const dirs = ['src/css', 'src/js', 'src/images', 'dist', 'public'];
    dirs.forEach(dir => {
      const fullPath = path.join(__dirname, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ 创建目录: ${dir}`);
      }
    });
    
    console.log('✅ 项目初始化完成！');
    console.log('📁 项目结构:');
    console.log('   src/        - 源代码目录');
    console.log('   src/css/    - 样式文件');
    console.log('   src/js/     - JavaScript 文件');
    console.log('   src/images/ - 图片资源');
    console.log('   dist/       - 打包输出目录');
    console.log('   public/     - 公共资源目录');
  });

program
  .command('serve')
  .description('启动本地服务预览网站')
  .option('-p, --port <port>', '指定端口号', PORT)
  .action((options) => {
    const port = parseInt(options.port) || PORT;
    
    const server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      let filePath = path.join(SRC_DIR, req.url === '/' ? 'index.html' : req.url);
      
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      
      if (!path.extname(filePath)) {
        filePath += '.html';
      }
      
      serveFile(res, filePath);
    });
    
    server.listen(port, () => {
      console.log(`🌐 服务器已启动！`);
      console.log(`📍 访问地址: http://localhost:${port}`);
      console.log(`⏹️  按 Ctrl+C 停止服务`);
      
      const url = `http://localhost:${port}`;
      exec(`open "${url}"`, (err) => {
        if (err) {
          console.log('请手动打开浏览器访问上述地址');
        }
      });
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ 端口 ${port} 已被占用，请尝试其他端口`);
        console.log(`💡 使用: node index.js serve -p 3001`);
      } else {
        console.error('❌ 服务器错误:', err.message);
      }
    });
  });

program
  .command('build')
  .description('项目打包')
  .action(() => {
    console.log('📦 开始打包项目...');
    
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR, { recursive: true });
    }
    
    function copyDir(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    copyDir(SRC_DIR, DIST_DIR);
    
    console.log('✅ 打包完成！');
    console.log(`📁 输出目录: ${DIST_DIR}`);
    
    const files = fs.readdirSync(DIST_DIR);
    console.log('📄 打包文件:');
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
  });

program.parse();
