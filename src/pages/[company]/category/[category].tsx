import { Category } from '@screens/Category';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { IMetadata, MetaHeaders } from '@components/MetaHeaders/MetaHeaders';

export interface ICompanyProductsProps {
  metadata: IMetadata;
}
export default function CompanyProducts({ metadata }: ICompanyProductsProps) {
  return (
    <>
      <MetaHeaders metadata={metadata} />
      <Category />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const companyName = context.params?.company as string;
  const categoryId = context.params?.category as string;

  const currentCompany = (
    await axios.get<CompanyEntity>(
      `${process.env.NEXT_PUBLIC_API_URL}api/companies/by-ref-id/${companyName}`,
    )
  ).data;

  const currentCategory = (
    await axios.get<CompanyEntity>(
      `${process.env.NEXT_PUBLIC_API_URL}api/categories/${categoryId}`,
    )
  ).data;

  return {
    props: {
      metadata: {
        title: `${currentCategory.title} | ${currentCompany?.name} | ${currentCompany?.title}`,
        ogTitle: `${currentCategory.title} | ${currentCompany?.title}`,
        description:
          currentCategory.description || currentCompany?.description || '',
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
    } as ICompanyProductsProps,
  };
};
