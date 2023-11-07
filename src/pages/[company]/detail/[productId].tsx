import { DetailView } from '@components/DetailView';
import { GetServerSideProps } from 'next';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { IMetadata, MetaHeaders } from '@components/MetaHeaders/MetaHeaders';
import { ProductEntity } from '@shared/entities/ProductEntity';
import { ICompanyProductsProps } from '../category/[category]';
import { getCachedResources } from '../../../utils/fs.utils';
import { handleCachedCompany, handleCachedProduct } from '../../../utils/server-side.utils';

export interface IProductDetailsProps {
  metadata: IMetadata;
  currentCompany?: CompanyEntity;
  product?: ProductEntity;
}
export default function ProductDetail({ metadata, currentCompany, product }: IProductDetailsProps) {
  return (
    <div>
      <MetaHeaders metadata={metadata} />
      <DetailView companyLogo={currentCompany?.logo} productDetails={product} forceLoadProduct />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    /// / HANDLING PRODUCT DATA
    const productId = context.params?.productId as string;
    let product: ProductEntity | undefined = await getCachedResources<ProductEntity>(productId as string, 'products');

    if (product) {
      handleCachedProduct(productId as string);
    } else {
      product = await handleCachedProduct(productId as string);
    }

    /// / HANDLING COMPANY DATA
    const companyName = context.params?.company;
    let currentCompany: CompanyEntity | undefined = await getCachedResources<CompanyEntity>(companyName as string, 'companies');

    if (currentCompany) {
      handleCachedCompany(companyName as string);
    } else {
      currentCompany = await handleCachedCompany(companyName as string);
    }

    const keywords = `${product?.tags?.join(', ') || ''} ${currentCompany?.tags?.join(', ') || ''}`;
    return {
      props: {
        currentCompany,
        product,
        metadata: {
          keywords,
          title: `${product?.name} RD$${product?.price.toLocaleString()}${product?.category?.title ? ` | ${product?.category?.title}` : ''} | ${currentCompany?.title} ${currentCompany?.name}`,
          ogTitle: `${product?.name} RD$${product?.price.toLocaleString()} | ${product?.category?.title || currentCompany?.title}`,
          description:
          product?.description || currentCompany?.description || '',
          image: product?.image || currentCompany?.logo || '',
          type: 'article',
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
  } catch (error) {
    console.log('error while getting product detail', error);
    throw error;
  }
};
