import {type ReactNode} from 'react';
import {TitleFormatterProvider} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function LocalizedTitleFormatter({children}: {children: ReactNode}) {
  const {siteConfig} = useDocusaurusContext();
  const localizedSiteTitle = translate({id: 'siteTitle', message: siteConfig.title});
  return (
    <TitleFormatterProvider
      formatter={(params) =>
        params.defaultFormatter({...params, siteTitle: localizedSiteTitle})
      }>
      {children}
    </TitleFormatterProvider>
  );
}

export default function TitleFormatter({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <LocalizedTitleFormatter>{children}</LocalizedTitleFormatter>;
}
