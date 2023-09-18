import { Category } from '@screens/Category';
import { GetServerSideProps } from 'next';
import axios from 'axios/index';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { CategoryEntity } from '@shared/entities/CategoryEntity';

export default function CompanyProducts() {
  return <Category />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const companies = (
    await axios.get<CompanyEntity[]>(
      `${process.env.NEXT_PUBLIC_API_URL}api/companies`,
    )
  ).data;

  const categories = (
    await axios.get<CompanyEntity[]>(
      `${process.env.NEXT_PUBLIC_API_URL}api/categories`,
    )
  ).data;

  const companyName = context.params?.company as string;
  const categoryId = context.params?.category as string;
  const currentCompany = companies.find(
    (company) => company.companyId === companyName,
  ) || {} as CompanyEntity;
  const currentCategory = categories.find(cat => cat._id === categoryId) || {} as CategoryEntity};

  return {
    props: {
      metadata: {
        title: `${currentCategory.title} | ${currentCompany?.name} | ${currentCompany?.title}`,
        ogTitle: `${currentCategory.title} | ${currentCompany?.title}`,
        description: currentCategry.description || currentCompany?.description || '',
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
