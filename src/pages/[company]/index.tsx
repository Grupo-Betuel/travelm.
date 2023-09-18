import { Company } from 'src/screens/Company';
import { GetServerSideProps } from 'next';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import axios from 'axios';
import Head from 'next/head';
import React from 'react';

export default function CompanyProducts({ metadata }: any) {
  console.log('metadata', metadata);
  return (
    <>
      <Head>
        <meta property="og:title" content={metadata.ogTitle} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />
        <meta property="og:video" content={metadata.video.url} />
        <meta
          property="og:video:secure_url"
          content={metadata.video.secureUrl}
        />
        <meta property="og:video:type" content={metadata.video.type} />
        <meta property="og:type" content="website" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      <Company />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const companies = (
    await axios.get<CompanyEntity[]>(
      `${process.env.NEXT_PUBLIC_API_URL}api/companies`,
    )
  ).data;

  const companyName = context.params?.company as string;
  const currentCompany = companies.find((company) => company.companyId === companyName)
    || ({} as CompanyEntity);

  return {
    props: {
      metadata: {
        title: `${currentCompany?.name} | ${currentCompany?.title}`,
        ogTitle: currentCompany?.title,
        description: currentCompany?.description || '',
        image: currentCompany?.wallpaper || currentCompany?.logo || '',
        url: `https://grupo-betuel-api.click/${currentCompany?.companyId}`,
        type: 'website',
        video: {
          url: currentCompany?.video || '',
          secureUrl: currentCompany?.video || '',
          type: currentCompany?.video?.includes('mp4')
            ? 'video/mp4'
            : 'video/ogg',
        },
      },
    },
  } as any;
};
