import Head from 'next/head';

export interface IMetadata {
  ogTitle?: string;
  description?: string;
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
    <meta property="og:video:secure_url" content={metadata?.video?.secureUrl || ''} />
    <meta property="og:video:type" content={metadata?.video?.type || ''} />
    <meta property="og:type" content={metadata?.type || ''} />
    <title>{metadata?.title || ''}</title>
    <meta name="description" content={metadata?.description || ''} />
  </Head>
);
