import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Sonoff RPC API 文档',
  tagline: 'Sonoff 设备 RPC API 接口参考文档',
  favicon: 'img/favicon.ico',

  // GitHub Pages 部署配置
  // 1. 将下面的 github-username 替换为你的 GitHub 用户名（如 alice）
  // 2. 创建仓库 sonoff-rpc-api-docs，并把代码推送上去
  // 3. 仓库 Settings → Pages → Source 选择 "GitHub Actions"
  url: 'https://xwmdev.github.io',
  baseUrl: '/sonoff-rpc-api-docs/',

  // GitHub Pages 使用静态文件托管，关闭尾斜杠可生成 .html 文件并保证链接可直达
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
    // 文档含表格内嵌 HTML（如 <br>）与花括号文本，按纯 Markdown 解析而非 MDX
    format: 'md',
    // 启用 Mermaid 流程图渲染（配合 @docusaurus/theme-mermaid）
    mermaid: true,
  },

  // 多语言配置：默认简体中文，辅以英文
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': {
        label: '简体中文',
        htmlLang: 'zh-Hans',
      },
      en: {
        label: 'English',
        htmlLang: 'en',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        // 本项目专注技术文档，不需要博客，故关闭
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // 本地搜索插件（无需外部服务，支持中文分词，兼容多语言）
  // 索引构建在本地，站内即可全文搜索
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['zh', 'en'],
        docsRouteBasePath: ['/docs'],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        searchResultContextMaxLength: 140,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Sonoff RPC API',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: '文档',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Sonoff RPC API Docs. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'http', 'java', 'python', 'go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
