# Sonoff Device API 文档

基于 [Docusaurus](https://docusaurus.io) 的 Sonoff 设备 RPC API 接口文档站点，支持**本地全文搜索、多语言（简体中文 / English）**；多版本能力内置，当前为单版本（详见[版本维护](#版本维护多版本)）。

## 环境要求

- Node.js **20.0+**（推荐 22 LTS）

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run start` | 本地预览中文版（热更新），http://localhost:3000 |
| `npm run start -- --locale en` | 本地预览英文版，http://localhost:3000/en/ |
| `npm run build` | 构建静态站点到 `build/`（本地默认按根路径 `/`） |
| `npm run serve` | 本地预览构建产物（全语言、与发布一致），http://localhost:3000/ |
| `npm run clear` | 清理缓存 |
| `npm run write-translations -- --locale <语言>` | 从代码抽取/更新界面文案语言包 `i18n/<语言>/code.json` |
| `npm run typecheck` | TypeScript 类型检查 |

> **多语言预览说明**：Docusaurus 的开发服务器一次只服务一种语言。
> `npm run start` 只生成中文路由，此时页面右上角语言切换器跳到 `/en/...` 会显示"内容 404 / 加载失败"（页头页脚仍在，因为布局与路由无关）——这是 Docusaurus 的设计，不是故障。
>
> - 预览**英文版**：用 `npm run start -- --locale en`。
> - 需要**同时访问全部语言、效果与线上一致**：用 `npm run build && npm run serve`，此时 `/` 为中文、`/en/` 为英文，语言切换器完全可用。

> 基地址自动识别：`docusaurus.config.ts` 按以下优先级自动推导 `url` / `baseUrl`，无需手动改配置。
>
> 1. 显式环境变量 `BASE_URL`（其它托管指定子路径、或本地模拟子路径挂载时使用）；
> 2. GitHub Actions 构建时自动读取 `GITHUB_REPOSITORY`（`owner/repo`）得到子路径 `/repo/`；
> 3. 否则回退为根路径 `/`（本地 `build` / `serve` 默认按根路径处理）。
>
> 本地默认构建在根路径，直接上传静态托管即可；发布到 GitHub Pages 时由 CI 自动使用子路径。
> 如需在本地预览发布后的子路径效果，可这样操作：
>
> ```bash
> BASE_URL=/sonoff-rpc-api-docs/ npm run build
> BASE_URL=/sonoff-rpc-api-docs/ npm run serve
> # 访问 http://localhost:3000/sonoff-rpc-api-docs/
> ```

## 项目结构

```
docs/                        # 文档（默认语言：简体中文），内容源头
├── Welcome.md               # 文档导读（/docs/ 落地页）
├── QuickStart.md            # 快速开始
├── General/                 # 通用协议：RPC 协议、传输通道、认证等
├── Components/              # 各功能组件接口文档
├── Devices/                 # 设备文档
└── Changelog.md             # 变更记录
i18n/
├── en/                      # 英文翻译目录
│   ├── code.json            # 界面文案翻译（代码语言包，translate() 读取）
│   ├── docusaurus-plugin-content-docs/current/   # 英文文档（与 docs/ 对应）
│   └── docusaurus-theme-classic/                 # 导航栏/页脚文案
└── zh-Hans/                 # 简体中文翻译目录（结构与 en/ 相同）
src/
├── pages/index.tsx          # 首页（界面文案用 translate() 取语言包）
└── theme/                   # 主题覆盖（如 TitleFormatter：标签页标题按语言本地化）
docusaurus.config.ts         # 站点配置（多语言/搜索）
sidebars.ts                  # 侧边栏配置
```

## 内容维护

### 文档内容翻译

新增/修改文档时，简体中文文档写入 `docs/`，英文翻译写入 `i18n/en/docusaurus-plugin-content-docs/current/`，两者保持相同的相对路径与文件名。文档间相对链接建议使用 `.md` 后缀写法（如 `[RPC 协议](General/RPCProtocol.md)`），构建时会被解析为正确的文档链接。

### 界面文案翻译（代码语言包）

页面/组件的界面文案（如首页按钮、卡片标题）在代码中用 `translate({id, message})` 标记，翻译统一放在 `i18n/<语言>/code.json`，**文案与代码分离**：

- 写界面文案时：`translate({id: 'home.learnMore', message: '了解更多'})`（`message` 为中文默认文案，缺翻译时回退）
- 翻译维护在 `i18n/en/code.json`：`"home.learnMore": { "message": "Learn more", "description": "..." }`
- `npm run write-translations -- --locale en` 可自动从代码抽取/更新 `code.json` 的翻译键脚手架

### 新增一种语言（零代码改动）

1. `docusaurus.config.ts` → `i18n.locales` 中加入新语言（如 `'fr'`）
2. 生成界面文案语言包：`npm run write-translations -- --locale fr`，然后翻译 `i18n/fr/code.json`
3. 文档翻译：把 `docs/` 内容复制到 `i18n/fr/docusaurus-plugin-content-docs/current/` 并翻译
4. 导航栏/页脚文案：翻译 `i18n/fr/docusaurus-theme-classic/navbar.json`、`footer.json`
5. 无需改动任何源码（首页等界面文案均走语言包）

### 版本维护（多版本）

> 当前状态：尚未创建任何正式版本，`docs/` 即唯一版本 `current`（最新开发版）。多版本能力由 Docusaurus 内置，按需启用。

**创建首个正式版本**（把当前 `docs/` 固化为版本快照）：

```bash
npm run docusaurus docs:version 1.0.0
```

该命令会：
- 复制 `docs/` → `versioned_docs/version-1.0.0/`
- 复制 `sidebars.ts` → `versioned_sidebars/version-1.0.0-sidebars.json`
- 生成/更新 `versions.json`

创建之后：

- `docs/` 变为 `next`（未发布的开发版，导航栏版本选择器显示 "next" 徽标）
- 要默认展示某个正式版本：在 `docusaurus.config.ts` 的 `docs` 下配置 `lastVersion: '1.0.0'`
- 修改已发布版本的内容：直接编辑 `versioned_docs/version-<版本>/`（与 `docs/` 互不影响）
- 版本列表与顺序：由 `versions.json` 控制
- 版本 + 多语言叠加：`docs:version` 创建版本后，各语言翻译位于 `i18n/<语言>/docusaurus-plugin-content-docs/version-<版本>/`；`current`（即 `docs/`）的翻译仍在 `.../current/`
- 发布新版本时记得同步翻译各语言目录

## 部署（GitHub Pages）

项目已内置 GitHub Actions 工作流（`.github/workflows/deploy.yml`），推送代码后自动构建并发布。

首次部署步骤：

1. **创建仓库**：在 GitHub 新建仓库，命名为 `sonoff-rpc-api-docs`。
2. **配置用户名**：把 `docusaurus.config.ts` 中 `url` 的 `github-username` 替换为你的 GitHub 用户名。
3. **推送代码**：

   ```bash
   git init
   git add .
   git commit -m "init docs site"
   git branch -M main
   git remote add origin git@github.com:<用户名>/sonoff-rpc-api-docs.git
   git push -u origin main
   ```

4. **启用 Pages**：仓库 Settings → Pages → Source 选择 **GitHub Actions**。
5. 等待 Actions 运行完成，站点地址为 `https://<用户名>.github.io/sonoff-rpc-api-docs/`。

之后每次 `git push` 到 main 分支都会自动重新构建发布。
