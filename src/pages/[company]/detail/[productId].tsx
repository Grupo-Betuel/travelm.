import { DetailView } from '@components/DetailView';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { IMetadata, MetaHeaders } from '@components/MetaHeaders/MetaHeaders';
import { ProductEntity } from '@shared/entities/ProductEntity';
import { ICompanyProductsProps } from '../category/[category]';

export interface IProductDetailsProps {
  metadata: IMetadata;
}
export default function ProductDetail({ metadata }: IProductDetailsProps) {
  return (
    <div>
      <MetaHeaders metadata={metadata} />
      <DetailView />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const companyName = context.params?.company as string;
  const productId = context.params?.productId as string;

  const currentCompany = (
    await axios.get<CompanyEntity>(
      `${process.env.NEXT_PUBLIC_API_URL}api/companies/by-ref-id/${companyName}`,
    )
  ).data;

  const product = (
    await axios.get<ProductEntity>(
      `${process.env.NEXT_PUBLIC_API_URL}api/products/by-id/${productId}`,
    )
  ).data;

  return {
    props: {
      metadata: {
        title: `${product?.name} RD$${product.price.toLocaleString()}${product?.category?.title ? ` | ${product?.category?.title}` : ''} | ${currentCompany?.title}`,
        ogTitle: `${product?.name} RD$${product.price.toLocaleString()} | ${product?.category?.title || currentCompany?.title}`,
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
};
