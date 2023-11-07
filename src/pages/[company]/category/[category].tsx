import { Category } from '@screens/Category';
import { GetServerSideProps } from 'next';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { IMetadata, MetaHeaders } from '@components/MetaHeaders/MetaHeaders';
import { CategoryEntity } from '@shared/entities/CategoryEntity';
import { getCachedResources } from '../../../utils/fs.utils';
import { handleCachedCategories, handleCachedCompany, handleCachedProduct } from '../../../utils/server-side.utils';

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
  /// / HANDLING COMPANY DATA
  const companyName = context.params?.company;
  let currentCompany: CompanyEntity | undefined = await getCachedResources<CompanyEntity>(companyName as string, 'companies');

  if (currentCompany) {
    handleCachedCompany(companyName as string);
  } else {
    currentCompany = await handleCachedCompany(companyName as string);
  }

  /// / HANDLING PRODUCT DATA
  const categoryId = context.params?.category as string;

  let currentCategory: CategoryEntity | undefined = await getCachedResources<CategoryEntity>(categoryId as string, 'categories');

  if (currentCategory) {
    handleCachedProduct(categoryId as string);
  } else {
    currentCategory = await handleCachedCategories(categoryId as string);
  }

  const keywords = `${currentCategory?.tags?.join(', ') || ''} ${currentCompany?.tags?.join(', ') || ''}`;

  return {
    props: {
      metadata: {
        keywords,
        title: `${currentCategory.title} | ${currentCompany?.name} ${currentCompany?.title}`,
        ogTitle: `${currentCategory.title} | ${currentCompany?.name} ${currentCompany?.title}`,
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
