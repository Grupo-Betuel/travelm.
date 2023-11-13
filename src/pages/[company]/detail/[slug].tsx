import { DetailView } from '@components/DetailView';
import { GetServerSideProps, GetStaticPaths } from 'next';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { IMetadata, MetaHeaders } from '@components/MetaHeaders/MetaHeaders';
import { ProductEntity } from '@shared/entities/ProductEntity';
import { handleCachedResourceHook } from '@shared/hooks/handleCachedResourceHook';
// import { getCachedResources } from '../../../utils/fs.utils';
import axios from 'axios';
import {
  handleCachedCompany,
  handleCachedProduct,
  ICachedResourceResponse,
} from '../../../utils/server-side.utils';

export interface IProductDetailsProps {
  metadata: IMetadata;
  currentCompany?: CompanyEntity;
  cachedResources: ICachedResourceResponse<ProductEntity>;
}

export default function ProductDetail({
  metadata, currentCompany, cachedResources,
}: IProductDetailsProps) {
  handleCachedResourceHook(cachedResources);
  return (
    <div>
      <MetaHeaders metadata={metadata} />
      <DetailView
        companyLogo={currentCompany?.logo}
        productDetails={cachedResources?.data}
        forceLoadProduct
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const companyUrl = `${process.env.NEXT_PUBLIC_API_URL}api/companies`;
  const companies: CompanyEntity[] = (await axios.get<CompanyEntity[]>(companyUrl)).data;
  let allProductSlugs: any[] = [];
  await Promise.all(companies.map(async (company) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}api/products/slugs/${company.companyId}`;
    const { data: productSlugs } = await axios.get<ProductEntity[]>(url);
    const productSlugsPaths = productSlugs.map((product) => ({
      params: {
        slug: product.slug,
        company: company.companyId,
      },
    }));
    allProductSlugs = [...allProductSlugs, ...productSlugsPaths];
  }));

  return ({
    paths: allProductSlugs, // indicates that no page needs be created at build time
    fallback: true, // indicates the type of fallback
  });
};

export const getStaticProps: GetServerSideProps = async (context) => {
  try {
    /// / HANDLING PRODUCT DATA
    const productSlug = context.params?.slug as string;
    // let product: ProductEntity | undefined = await getCachedResources<ProductEntity>(
    // productSlug as string,
    // 'products');
    //
    // if (product) {
    //   handleCachedProduct(productSlug as string);
    // } else {
    const cachedProductResource = await handleCachedProduct(productSlug as string);
    const product = cachedProductResource.data;
    // }

    /// / HANDLING COMPANY DATA
    const companyName = context.params?.company;
    // let currentCompany: CompanyEntity | undefined = await getCachedResources<CompanyEntity>(
    // companyName as string,
    // 'companies');

    // if (currentCompany) {
    //   handleCachedCompany(companyName as string);
    // } else {

    const cachedCompanyResource = await handleCachedCompany(companyName as string);
    const { data: currentCompany } = cachedCompanyResource;
    // }

    const keywords = `${product?.tags?.join(', ') || ''} ${currentCompany?.tags?.join(', ') || ''}`;
    return {
      props: {
        currentCompany,
        cachedResources: cachedProductResource,
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
      } as IProductDetailsProps,
    };
  } catch (error) {
    console.log('error while getting product detail', error);
    throw error;
  }
};
