import Head from 'next/head';

export interface IMetadata {
  ogTitle?: string;
  description?: string;
  jsonld?: string;
  sitemapURL?: string;
  canonical?: string;
  keywords?: string;
  type?: 'article' | 'website';
  image?: string;
  video?: {
    url?: string;
    secureUrl?: string;
    type?: string;
  };
  title?: string;
}

export interface IMetaHeadersProps {
  metadata: IMetadata;
}
export const MetaHeaders = ({ metadata }: IMetaHeadersProps) => (
  <Head>
    <meta property="og:title" content={metadata?.ogTitle || ''} />
    <meta property="og:description" content={metadata?.description || ''} />
    <meta property="og:image" content={metadata?.image || ''} />
    <meta property="og:video" content={metadata?.video?.url || ''} />
    <meta
      property="og:video:secure_url"
      content={metadata?.video?.secureUrl || ''}
    />
    <meta property="og:video:type" content={metadata?.video?.type || ''} />
    <meta property="og:type" content={metadata?.type || ''} />
    <title>{metadata?.title || ''}</title>
    <meta name="description" key="desc" content={metadata?.description || ''} />
    <meta name="keywords" content={metadata?.keywords || ''} />
    <meta charSet="utf-8" />
    {/* <link */}
    {/*  rel={'sitemap' as any} */}
    {/*  type="application/xml" */}
    {/*  title="Sitemap" */}
    {/*  href={metadata?.sitemapURL} */}
    {/* /> */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: metadata?.jsonld || '',
      }}
    />
    <link rel="canonical" href={metadata.canonical} />
  </Head>
);
