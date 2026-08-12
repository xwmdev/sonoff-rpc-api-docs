import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

type FeatureItem = {
  title: string;
  description: string;
  to: string;
  icon: string;
};

const featureListZh: FeatureItem[] = [
  {
    title: '快速开始',
    icon: '🚀',
    description: '从零开始：设备联网、获取 IP、设置密码，完成第一次受控调用。',
    to: '/docs/QuickStart',
  },
  {
    title: '通用协议',
    icon: '📡',
    description: 'JSON-RPC 2.0 协议、HTTP / WebSocket / MQTT 传输通道与认证机制。',
    to: '/docs/General/RPCProtocol',
  },
  {
    title: '组件接口',
    icon: '🧩',
    description: 'System、WiFi、Switch、Timer 等 12 个组件的完整方法、数据结构与示例。',
    to: '/docs/Components/Cloud',
  },
  {
    title: '设备支持',
    icon: '📱',
    description: '各款设备支持的组件清单、例外情况与使用注意事项。',
    to: '/docs/Devices/SonoffMini1GSP',
  },
];

const featureListEn: FeatureItem[] = [
  {
    title: 'Quick Start',
    icon: '🚀',
    description:
      'From zero to your first controlled call: connect the device, get its IP, set a password.',
    to: '/docs/QuickStart',
  },
  {
    title: 'General Protocol',
    icon: '📡',
    description:
      'JSON-RPC 2.0 protocol, HTTP / WebSocket / MQTT transport channels and authentication.',
    to: '/docs/General/RPCProtocol',
  },
  {
    title: 'Component APIs',
    icon: '🧩',
    description:
      'Full methods, data structures and examples for 12 components like System, WiFi, Switch and Timer.',
    to: '/docs/Components/Cloud',
  },
  {
    title: 'Device Support',
    icon: '📱',
    description:
      'Components supported by each device model, exceptions and usage notes.',
    to: '/docs/Devices/SonoffMini1GSP',
  },
];

function FeatureCard({title, description, icon, to}: FeatureItem) {
  return (
    <Link className={styles.card} to={to}>
      <span className={styles.cardIcon}>{icon}</span>
      <Heading as="h3" className={styles.cardTitle}>
        {title}
      </Heading>
      <p className={styles.cardDescription}>{description}</p>
      <span className={styles.cardLink}>
        了解更多
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

function HomepageHeader({isEnglish}: {isEnglish: boolean}) {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>
          {isEnglish
            ? 'Monitor and control Sonoff devices through the RPC API. Protocol reference, component APIs, device guides and examples.'
            : '通过 RPC API 监控与控制 Sonoff 设备。协议参考、组件接口、设备指南与完整示例。'}
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.primaryButton} to="/docs/">
            {isEnglish ? 'Read the Docs' : '阅读文档'}
          </Link>
          <Link className={styles.secondaryButton} to="/docs/QuickStart">
            {isEnglish ? 'Quick Start' : '快速开始'}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig, i18n} = useDocusaurusContext();
  const isEnglish = i18n.currentLocale === 'en';
  const features = isEnglish ? featureListEn : featureListZh;

  return (
    <Layout
      title={siteConfig.title}
      description={
        isEnglish
          ? 'Sonoff device RPC API reference documentation, with local search and multilingual support.'
          : 'Sonoff 设备 RPC API 接口参考文档，支持本地搜索与多语言。'
      }>
      <HomepageHeader isEnglish={isEnglish} />
      <main className={styles.features}>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
