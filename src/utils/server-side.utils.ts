import CompanyService from '@services/companyService';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { ProductEntity } from '@shared/entities/ProductEntity';
import ProductService from '@services/productService';
import { CategoryEntity } from '@shared/entities/CategoryEntity';
import CategoryService from '@services/categoryService';
import {
  generateCategorySitemapXml,
  generateCompanySitemapXml,
  generateProductJSONLD,
  generateProductSitemapXML,
} from './seo.utils';

// import { setCachedResource } from './fs.utils';
export interface IErrorResponse {
  status: number;
  message: string;
}

export interface ICachedResourceResponse<T> {
  data?: T;
  error?: IErrorResponse | null;
  sitemapXML?: string;
  jsonld?: string;
}

export const handleCachedCatch = (res: any) => {
  const data = res.response ? res.response.data : res?.message;
  const status = res.response ? res.response.status : 500;

  // const { response: { data, status } } = res;
  return { error: { message: data, status } as IErrorResponse };
};

export async function handleCachedCompany(
  companyId: string,
): Promise<ICachedResourceResponse<CompanyEntity>> {
  try {
    const companyService = new CompanyService();
    const currentCompany = await companyService.getCompanyByRefName(companyId);
    // currentCompany && setCachedResource(currentCompany, 'companies', currentCompany.companyId);
    const companyXML = currentCompany && generateCompanySitemapXml(currentCompany);

    return { data: currentCompany, sitemapXML: companyXML };
  } catch (res: any) {
    return handleCachedCatch(res);
  }
}

export const handleCachedProduct = async (
  slug: string,
): Promise<ICachedResourceResponse<ProductEntity>> => {
  try {
    const productService = new ProductService();
    const product = await productService.getProductBySlug(slug);
    // const product = await productService.get({
    //   endpoint: EndpointsAndEntityStateKeys.BY_SLUG,
    //   slug,
    // }) as any;
    // product && setCachedResource(product, 'products');
    const sitemapXML = product && generateProductSitemapXML(product);
    const jsonld = product && generateProductJSONLD(product);

    return { data: product, sitemapXML, jsonld };
  } catch (res: any) {
    return handleCachedCatch(res);
  }
};

export const handleCachedCategories = async (
  catSlug: string,
): Promise<ICachedResourceResponse<CategoryEntity>> => {
  try {
    const categoryService = new CategoryService();
    const category = await categoryService.getCategoryBySlug(catSlug);
    const catXML = category && generateCategorySitemapXml(category);

    // category && setCachedResource(category, 'categories');
    return { data: category, sitemapXML: catXML };
  } catch (res: any) {
    return handleCachedCatch(res);
  }
};
