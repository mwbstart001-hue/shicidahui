#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const http = require('http');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const program = new Command();

program
  .name('shicidahui')
  .description('《中国诗词大会》网站 CLI 工具')
  .version('1.0.0');

// ─────────────────────────────────────────────
// init 命令
// ─────────────────────────────────────────────
program
  .command('init')
  .description('初始化项目结构，检测并创建必要目录与文件骨架')
  .action(() => {
    const srcDir = path.join(__dirname, 'src');
    const cssDir = path.join(srcDir, 'css');
    const imagesDir = path.join(srcDir, 'images');
    const pages = ['index.html', 'list.html', 'detail.html', 'login.html'];

    // 创建目录
    [srcDir, cssDir, imagesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ 创建目录: ${path.relative(__dirname, dir)}`);
      }
    });

    // 检测页面文件
    pages.forEach(page => {
      const p = path.join(srcDir, page);
      if (!fs.existsSync(p)) {
        console.log(`⚠️  缺少文件: src/${page}，请确保已完成页面开发`);
      } else {
        console.log(`✔  已存在: src/${page}`);
      }
    });

    console.log('\n🎉 项目初始化完成！');
    console.log('   运行 node index.js serve 启动本地预览');
  });

// ─────────────────────────────────────────────
// serve 命令
// ─────────────────────────────────────────────
program
  .command('serve')
  .description('启动本地静态文件服务器预览网站')
  .option('-p, --port <port>', '指定端口号', '3000')
  .action((options) => {
    const port = parseInt(options.port, 10);
    const staticDir = path.join(__dirname, 'src');

    const MIME = {
      '.html': 'text/html; charset=utf-8',
      '.css':  'text/css; charset=utf-8',
      '.js':   'application/javascript; charset=utf-8',
      '.png':  'image/png',
      '.jpg':  'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif':  'image/gif',
      '.svg':  'image/svg+xml',
      '.ico':  'image/x-icon',
      '.mp4':  'video/mp4',
      '.webp': 'image/webp',
    };

    const server = http.createServer(async (req, res) => {
      let urlPath = req.url.split('?')[0];
      if (urlPath === '/') urlPath = '/index.html';

      const filePath = path.join(staticDir, urlPath);
      const ext = path.extname(filePath).toLowerCase();

      try {
        const data = await fsp.readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      } catch {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - 文件未找到</h1>');
      }
    });

    server.listen(port, () => {
      console.log('');
      console.log('🚀 《中国诗词大会》本地服务已启动！');
      console.log(`   首页地址: http://localhost:${port}/index.html`);
      console.log(`   列表页面: http://localhost:${port}/list.html`);
      console.log(`   详情页面: http://localhost:${port}/detail.html`);
      console.log(`   登录页面: http://localhost:${port}/login.html`);
      console.log('');
      console.log('   按 Ctrl+C 停止服务');
      console.log('');
    });
  });

// ─────────────────────────────────────────────
// build 命令
// ─────────────────────────────────────────────
program
  .command('build')
  .description('将 src/ 目录打包输出到 dist/ 目录')
  .action(async () => {
    const srcDir  = path.join(__dirname, 'src');
    const distDir = path.join(__dirname, 'dist');

    if (!fs.existsSync(srcDir)) {
      console.error('❌ src/ 目录不存在，请先运行 node index.js init');
      process.exit(1);
    }

    console.log('📦 开始打包...');

    // 递归复制目录
    async function copyDir(src, dest) {
      await fsp.mkdir(dest, { recursive: true });
      const entries = await fsp.readdir(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath  = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fsp.copyFile(srcPath, destPath);
          console.log(`   复制: ${path.relative(__dirname, destPath)}`);
        }
      }
    }

    try {
      // 清空 dist
      if (fs.existsSync(distDir)) {
        await fsp.rm(distDir, { recursive: true, force: true });
      }
      await copyDir(srcDir, distDir);
      console.log('');
      console.log('✅ 打包完成！输出目录: dist/');
    } catch (err) {
      console.error('❌ 打包失败:', err.message);
    }
  });

program.parse(process.argv);
