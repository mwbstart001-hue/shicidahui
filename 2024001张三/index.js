#!/usr/bin/env node

const { program } = require('commander');
const express = require('express');
const fs = require('fs');
const path = require('path');

const PACKAGE_VERSION = '1.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');
const DIST_DIR = path.join(__dirname, 'dist');

program
  .name('poetry-cli')
  .description('中国诗词大会网站命令行工具')
  .version(PACKAGE_VERSION);

program
  .command('init')
  .description('初始化项目，创建必要的目录结构')
  .action(() => {
    console.log('\n🚀 正在初始化项目...\n');
    
    const dirs = [
      PUBLIC_DIR,
      path.join(PUBLIC_DIR, 'css'),
      path.join(PUBLIC_DIR, 'images'),
      DIST_DIR
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ 创建目录: ${path.relative(__dirname, dir)}`);
      } else {
        console.log(`📁 目录已存在: ${path.relative(__dirname, dir)}`);
      }
    });
    
    console.log('\n✨ 项目初始化完成！\n');
    console.log('📝 接下来可以运行:');
    console.log('   node index.js serve  - 启动本地服务预览网站');
    console.log('   node index.js build  - 打包项目\n');
  });

program
  .command('serve')
  .description('启动本地服务器预览网站')
  .option('-p, --port <port>', '指定端口号', '3000')
  .action((options) => {
    const port = parseInt(options.port);
    const app = express();
    
    app.use(express.static(PUBLIC_DIR));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
    });
    
    app.listen(port, () => {
      console.log('\n🌐 中国诗词大会网站服务已启动！\n');
      console.log(`📍 本地访问地址: http://localhost:${port}`);
      console.log(`📂 静态文件目录: ${PUBLIC_DIR}\n`);
      console.log('💡 按 Ctrl+C 停止服务\n');
    });
  });

program
  .command('build')
  .description('打包项目到 dist 目录')
  .action(() => {
    console.log('\n📦 正在打包项目...\n');
    
    if (fs.existsSync(DIST_DIR)) {
      fs.rmSync(DIST_DIR, { recursive: true });
    }
    
    fs.mkdirSync(DIST_DIR, { recursive: true });
    
    function copyDir(src, dest) {
      fs.mkdirSync(dest, { recursive: true });
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
          console.log(`✅ 复制文件: ${path.relative(__dirname, destPath)}`);
        }
      });
    }
    
    if (fs.existsSync(PUBLIC_DIR)) {
      copyDir(PUBLIC_DIR, DIST_DIR);
      console.log('\n✨ 项目打包完成！');
      console.log(`📂 输出目录: ${DIST_DIR}\n`);
    } else {
      console.log('❌ 错误: public 目录不存在，请先运行 node index.js init\n');
    }
  });

program.parse();
