import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

type FeatureItem = {
  id: string;
  title: string;
  description: string;
  to: string;
  icon: ReactNode;
};

const IconRocket = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8-.8-.7-2.2-.7-3 .8Z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 15 5c3.6-.5 4.5 1.5 5 4.5.4 2.5-1 4.8-3.1 6a22 22 0 0 1-3.9 2Z" />
    <path d="M9 12H4s.6-3.3 2.3-5C8.8 4.6 12.8 3.7 15 5c1.3 1.3 2.4 4.6 1.7 8" />
    <path d="M12 15v5s3.3-.6 5-2.3c1.7-1.7 2.6-5 1.4-8" />
    <circle cx="12" cy="12" r="1.4" />
  </svg>
);

const IconProtocol = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 6h13M8 12h13M8 18h13" />
    <path d="M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

const IconComponents = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconDevices = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const featureList: FeatureItem[] = [
  {
    id: 'quickStart',
    title: '快速开始',
    description: '从零开始：设备联网、获取 IP、设置密码，完成第一次受控调用。',
    to: '/docs/QuickStart',
    icon: IconRocket,
  },
  {
    id: 'generalProtocol',
    title: '通用协议',
    description: 'JSON-RPC 2.0 协议、HTTP / WebSocket / MQTT 传输通道与认证机制。',
    to: '/docs/General/RPCProtocol',
    icon: IconProtocol,
  },
  {
    id: 'componentApis',
    title: '组件接口',
    description: 'System、WiFi、Switch、Timer 等 12 个组件的完整方法、数据结构与示例。',
    to: '/docs/Components/Cloud',
    icon: IconComponents,
  },
  {
    id: 'deviceSupport',
    title: '设备支持',
    description: '各款设备支持的组件清单、例外情况与使用注意事项。',
    to: '/docs/Devices/SonoffMini1GSP',
    icon: IconDevices,
  },
];

function FeatureCard({id, title, description, icon, to}: FeatureItem) {
  return (
    <Link className={styles.card} to={to}>
      <span className={styles.cardIcon}>{icon}</span>
      <Heading as="h3" className={styles.cardTitle}>
        {translate({id: `home.feature.${id}.title`, message: title})}
      </Heading>
      <p className={styles.cardDescription}>
        {translate({id: `home.feature.${id}.description`, message: description})}
      </p>
      <span className={styles.cardLink}>
        {translate({id: 'home.learnMore', message: '了解更多'})}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroTitle}>
          {translate({id: 'home.heroTitle', message: 'Sonoff Device API 文档'})}
        </Heading>
        <p className={styles.heroSubtitle}>
          {translate({
            id: 'home.heroSubtitle',
            message: '通过 RPC API 监控与控制 Sonoff 设备。协议参考、组件接口、设备指南与完整示例。',
          })}
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.primaryButton} to="/docs/">
            {translate({id: 'home.readTheDocs', message: '阅读文档'})}
          </Link>
          <Link className={styles.secondaryButton} to="/docs/QuickStart">
            {translate({id: 'home.quickStart', message: '快速开始'})}
          </Link>
        </div>
      </div>
    </header>
  );
}

function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.featuresGrid}>
        {featureList.map((feature) => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({id: 'home.title', message: 'Sonoff Device API 文档'})}
      description={translate({
        id: 'home.description',
        message: 'Sonoff 设备 RPC API 接口参考文档，支持本地搜索与多语言。',
      })}>
      <HomepageHeader />
      <Features />
    </Layout>
  );
}
