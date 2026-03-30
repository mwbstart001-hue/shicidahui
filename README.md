# 🏮 中国诗词大会 — 静态网站

> 基于 Node.js + Commander 开发的《中国诗词大会》主题静态网站，包含 CLI 工具与 4 个静态页面。

## 目录结构

```
60-shicidahui/
├── index.js          # CLI 工具入口（Commander）
├── package.json      # 项目配置
├── README.md         # 项目说明
├── src/
│   ├── css/
│   │   └── style.css     # 统一样式文件
│   ├── images/           # 图片资源目录
│   ├── index.html        # 首页
│   ├── list.html         # 二级列表页
│   ├── detail.html       # 内容详情页
│   └── login.html        # 登录页
└── dist/             # build 打包输出目录
```

## 快速开始

### 安装依赖

```bash
npm install
```

### CLI 命令

| 命令 | 说明 |
|------|------|
| `node index.js init` | 初始化项目，检测目录与文件结构 |
| `node index.js serve` | 启动本地静态文件服务器（默认端口 3000） |
| `node index.js serve --port 8080` | 指定端口启动服务 |
| `node index.js build` | 将 `src/` 打包输出到 `dist/` |

### 启动预览

```bash
node index.js serve
```

浏览器访问：

- 首页：http://localhost:3000/index.html
- 列表页：http://localhost:3000/list.html
- 详情页：http://localhost:3000/detail.html
- 登录页：http://localhost:3000/login.html

## 页面说明

| 页面 | 功能 |
|------|------|
| `index.html` | 首页：自动轮播、精选诗词推荐、节目介绍统计 |
| `list.html` | 列表页：9 首诗词卡片（唐诗/宋词/元曲分类筛选）+ 选手风采 |
| `detail.html` | 详情页：URL 参数 `?id=` 动态渲染诗词全文、注释与赏析 |
| `login.html` | 登录页：表单验证 + Toast 提示反馈（测试账号 admin/123456） |

## 技术栈

- **后端/CLI**：Node.js + Commander
- **前端**：HTML5 + CSS3 + 原生 JavaScript
- **字体**：Noto Serif SC（Google Fonts）
- **风格**：古典红金主题，导航下拉菜单，卡片悬浮动效

## 版权信息

班级：7002 | 学号：60 | 姓名：同学

© 2026 中国诗词大会 · 仅供学习使用
