import {execSync} from 'node:child_process';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// 部署地址（GitHub Pages）：https://xwmdev.github.io/sonoff-rpc-api-docs/
const PROD_URL = 'https://xwmdev.github.io';
const PROD_GITHUB_URL = 'https://github.com/xwmdev/sonoff-rpc-api-docs';

// 自动识别部署信息，优先级：
//   基地址：1. 显式环境变量 BASE_URL / URL（其它托管指定子路径、本地模拟子路径挂载时使用）
//           2. GitHub Actions 注入的 GITHUB_REPOSITORY（格式 owner/repo）
//           3. 回退为根路径 /（本地 build/serve 默认按根路径处理）
//   GitHub 仓库链接（仅用于导航栏，不影响基地址）：GITHUB_REPOSITORY → git remote origin → 回退常量
// 仓库名为 <user>.github.io 时视为根路径部署。
function detectDeployment(): {url: string; baseUrl: string; githubUrl: string} {
  const envUrl = process.env.URL;
  const envBaseUrl = process.env.BASE_URL;

  const githubRepo = process.env.GITHUB_REPOSITORY;
  const toGithubUrl = (owner: string, repo: string) =>
    `https://github.com/${owner}/${repo}`;

  // 本地构建/serve：从 git remote origin 推导仓库链接（不影响 baseUrl）
  const detectGithubUrlFromRemote = (): string | null => {
    try {
      const remote = execSync('git config --get remote.origin.url', {
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .toString()
        .trim();
      const match = remote.match(/(?:github\.com[:/])([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
      return match ? toGithubUrl(match[1], match[2]) : null;
    } catch {
      return null;
    }
  };

  const githubUrl =
    githubRepo && githubRepo.includes('/')
      ? toGithubUrl(githubRepo.split('/')[0], githubRepo.split('/')[1])
      : detectGithubUrlFromRemote() ?? PROD_GITHUB_URL;

  if (envBaseUrl) {
    return {url: envUrl || PROD_URL, baseUrl: envBaseUrl, githubUrl};
  }

  if (githubRepo && githubRepo.includes('/')) {
    const [owner, repo] = githubRepo.split('/');
    return repo.toLowerCase().endsWith('.github.io')
      ? {url: `https://${repo}`, baseUrl: '/', githubUrl}
      : {url: `https://${owner}.github.io`, baseUrl: `/${repo}/`, githubUrl};
  }

  return {url: PROD_URL, baseUrl: '/', githubUrl};
}

const {url, baseUrl, githubUrl} = detectDeployment();

const config: Config = {
  title: 'Sonoff Device API 文档',
  tagline: 'Sonoff 设备 API 接口参考文档',
  favicon: 'img/favicon.ico',

  url,
  baseUrl,

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

  // 页面访问统计：Google Analytics 4（官方插件）
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
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-HX2LV2RGTH',
        anonymizeIP: true,
      },
    ],
  ],

  // 页面访问统计：Umami Cloud（隐私友好，脚本 + 站点 ID 在 Umami 后台生成）
  scripts: [
    {
      src: 'https://cloud.umami.is/script.js',
      async: true,
      defer: true,
      'data-website-id': '7e607c9b-6683-4e7f-80f0-8c6108d9ccf2',
      'data-do-not-track': 'true',
    },
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'SONOFF',
      items: [
        {
          to: '/',
          position: 'left',
          label: '首页',
        },
        {
          // 老文档站地址：https://help.sonoff.tech/docs/puU2rU4w
          href: 'https://help.sonoff.tech/docs/puU2rU4w',
          position: 'left',
          label: '老文档站',
          target: '_blank',
        },
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: '文档',
        },
        // 预留：此处可继续追加左侧导航项
        {
          href: 'https://sonoff.tech/',
          position: 'right',
          label: '公司官网',
          target: '_blank',
        },
        {
          href: githubUrl,
          position: 'right',
          label: 'GitHub',
          target: '_blank',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Sonoff Device API Docs. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'http', 'java', 'python', 'go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
