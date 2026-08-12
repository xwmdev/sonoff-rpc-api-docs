# Sonoff RPC API 文档

基于 [Docusaurus](https://docusaurus.io) 的 Sonoff 设备 RPC API 接口文档站点，支持**本地全文搜索、多语言（简体中文 / English）**。

## 环境要求

- Node.js **20.0+**（推荐 22 LTS）

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run start` | 本地预览（热更新），http://localhost:3000 |
| `npm run start -- --locale en` | 本地预览英文版 |
| `npm run build` | 构建静态站点到 `build/` |
| `npm run serve` | 本地预览构建产物 |
| `npm run clear` | 清理缓存 |
| `npm run write-translations -- --locale <语言>` | 生成/更新语言翻译文件 |

## 项目结构

```
docs/                        # 文档（默认语言：简体中文），内容源头
├── Welcome.md               # 文档导读（/docs/ 落地页）
├── QuickStart.md            # 快速开始
├── General/                 # 通用协议：RPC 协议、传输通道、认证等
├── Components/              # 各功能组件接口文档
├── Devices/                 # 设备文档
└── Changelog.md             # 变更记录
i18n/en/                     # 英文翻译目录（与 docs/ 结构一一对应）
input-docs/                  # 文档源（未转换的原始 md），转换后内容同步到 docs/ 与 i18n/
docusaurus.config.ts         # 站点配置（多语言/搜索）
sidebars.ts                  # 侧边栏配置
```

## 内容维护

新增/修改文档时，简体中文文档写入 `docs/`，英文翻译写入 `i18n/en/docusaurus-plugin-content-docs/current/`，两者保持相同的相对路径与文件名。文档间相对链接建议使用 `.md` 后缀写法（如 `[RPC 协议](General/RPCProtocol.md)`），构建时会被解析为正确的文档链接。

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
   git remote add origin https://github.com/<用户名>/sonoff-rpc-api-docs.git
   git push -u origin main
   ```

4. **启用 Pages**：仓库 Settings → Pages → Source 选择 **GitHub Actions**。
5. 等待 Actions 运行完成，站点地址为 `https://<用户名>.github.io/sonoff-rpc-api-docs/`。

之后每次 `git push` 到 main 分支都会自动重新构建发布。
