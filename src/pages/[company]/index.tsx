import { Company } from 'src/screens/Company';
import { GetServerSideProps } from 'next';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import axios from 'axios';
import React from 'react';
import { MetaHeaders } from '@components/MetaHeaders/MetaHeaders';

export default function CompanyProducts({ metadata }: any) {
  console.log('metadata', metadata);
  return (
    <>
      <MetaHeaders metadata={metadata} />
      <Company />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const companyName = context.params?.company as string;

  const currentCompany = (
    await axios.get<CompanyEntity>(
      `${process.env.NEXT_PUBLIC_API_URL}api/companies/by-ref-id/${companyName}`,
    )
  ).data;

  return {
    props: {
      metadata: {
        title: `${currentCompany?.name} | ${currentCompany?.title}`,
        ogTitle: currentCompany?.title,
        description: currentCompany?.description || '',
        image: currentCompany?.wallpaper || currentCompany?.logo || '',
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
