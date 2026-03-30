const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, 'dist');
const SRC_DIR = path.join(__dirname, 'src');

program
  .name('poetry-cli')
  .description('中国诗词大会网站命令行工具')
  .version('1.0.0');

program
  .command('init')
  .description('初始化项目结构')
  .action(async () => {
    try {
      console.log('🚀 开始初始化项目...');
      
      await fs.ensureDir(SRC_DIR);
      await fs.ensureDir(path.join(SRC_DIR, 'css'));
      await fs.ensureDir(path.join(SRC_DIR, 'images'));
      await fs.ensureDir(path.join(SRC_DIR, 'js'));
      
      console.log('✅ 项目目录结构创建完成！');
      console.log('📁 请在 src 目录下添加页面文件');
    } catch (error) {
      console.error('❌ 初始化失败:', error.message);
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('启动本地服务预览网站')
  .option('-p, --port <port>', '端口号', '8080')
  .action((options) => {
    try {
      console.log(`🌐 启动本地服务，端口: ${options.port}`);
      console.log(`📂 服务目录: ${SRC_DIR}`);
      console.log(`🔗 访问地址: http://localhost:${options.port}`);
      
      execSync(`npx http-server "${SRC_DIR}" -p ${options.port} -c-1 -o`, {
        stdio: 'inherit',
        cwd: __dirname
      });
    } catch (error) {
      console.error('❌ 启动服务失败:', error.message);
      process.exit(1);
    }
  });

program
  .command('build')
  .description('打包项目')
  .action(async () => {
    try {
      console.log('📦 开始打包项目...');
      
      await fs.ensureDir(DIST_DIR);
      await fs.emptyDir(DIST_DIR);
      
      await fs.copy(SRC_DIR, DIST_DIR);
      
      console.log('✅ 项目打包完成！');
      console.log(`📂 打包目录: ${DIST_DIR}`);
    } catch (error) {
      console.error('❌ 打包失败:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
