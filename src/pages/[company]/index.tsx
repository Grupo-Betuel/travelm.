import { Company } from 'src/screens/Company';
import { GetServerSideProps, GetStaticPaths } from 'next';
// import { CompanyEntity } from '@shared/entities/CompanyEntity';
import React from 'react';
import { MetaHeaders } from '@components/MetaHeaders/MetaHeaders';
// import { getCachedResources } from '../../utils/fs.utils';
import { handleCachedResourceHook } from '@shared/hooks/handleCachedResourceHook';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import axios from 'axios';
import { handleCachedCompany } from '../../utils/server-side.utils';

export default function CompanyProducts({ metadata, cachedResources }: any) {
  const { sitemap } = handleCachedResourceHook(cachedResources);
  return (
    <>
      <MetaHeaders metadata={metadata} />
      {sitemap}
      <Company company={cachedResources?.data} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths<{ company: string }> = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}api/companies`;
  const companies: CompanyEntity[] = (await axios.get<CompanyEntity[]>(url))?.data;
  const companyPaths = companies.map((company) => ({
    params: {
      company: company.companyId,
    },
  }));

  return ({
    paths: companyPaths, // indicates that no page needs be created at build time
    fallback: true, // indicates the type of fallback
  });
};

export const getStaticProps: GetServerSideProps = async (context) => {
  const companyName = context.params?.company;
  // let currentCompany: CompanyEntity | undefined = await getCachedResources(
  // companyName as string,
  // 'companies');

  // if (currentCompany) {
  //   handleCachedCompany(companyName as string);
  // } else {

  const cachedResources = await handleCachedCompany(companyName as string);
  const {
    data: currentCompany,
  } = cachedResources;

  // }
  const keywords = `${currentCompany?.tags?.join(', ') || ''}`;
  return {
    props: {
      cachedResources,
      metadata: {
        keywords,
        title: `${currentCompany?.name} | ${currentCompany?.title}`,
        ogTitle: `${currentCompany?.name} | ${currentCompany?.title}`,
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
