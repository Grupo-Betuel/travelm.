import { Company } from 'src/screens/Company';
import { GetServerSideProps } from 'next';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import axios from 'axios';
import Head from 'next/head';
import React from 'react';

export default function CompanyProducts({ metadata, currentCompany }: any) {
  return (
    <>
      <Head>
        <meta property="og:title" content={metadata.ogTitle} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.wallpaper} />
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
      'https://grupo-betuel-api.click/api/companies',
    )
  ).data;
  const companyIde = context.params?.company as string;
  const currentCompany = companies.find(
    (company) => company.companyId === companyIde,
  );

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
// export const getServerProps: GetServerSideProps = async (context) => {
//   console.log('app context', context.params);
//   return {} as any;
// };
