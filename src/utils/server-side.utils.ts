import CompanyService from '@services/companyService';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { ProductEntity } from '@shared/entities/ProductEntity';
import ProductService from '@services/productService';
import { CategoryEntity } from '@shared/entities/CategoryEntity';
import CategoryService from '@services/categoryService';
import {
  generateCategoryJSONLD,
  generateCompanyJSONLD,
  generateProductJSONLD, getCategoryUrl, getCompanyUrl, getProductUrl,
} from './seo.utils';
import { BETUEL_GROUP_ECOMMERCE_URL } from './constants/url.constants';

// import { setCachedResource } from './fs.utils';
export interface IErrorResponse {
  status: number;
  message: string;
}

export interface ICachedResourceResponse<T> {
  data?: T;
  error?: IErrorResponse | null;
  sitemapURL?: string;
  jsonld?: string;
  canonical?: string;
  products?: ProductEntity[];
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
    const productService = new ProductService();
    const currentCompany = await companyService.getCompanyByRefName(companyId);
    const products = await productService.getProductByCompany(currentCompany.companyId);

    // currentCompany && setCachedResource(currentCompany, 'companies', currentCompany.companyId);
    const sitemapURL = `${BETUEL_GROUP_ECOMMERCE_URL}sitemaps/companies/${currentCompany._id}.xml`;
    const jsonld = currentCompany && generateCompanyJSONLD(currentCompany);
    const canonical = getCompanyUrl(currentCompany);
    return {
      data: currentCompany,
      sitemapURL,
      jsonld,
      canonical,
      products,
    };
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
    const canonical = getProductUrl(product);
    const sitemapURL = `${BETUEL_GROUP_ECOMMERCE_URL}sitemaps/products/${product._id}.xml`;
    const jsonld = product && generateProductJSONLD(product);

    return {
      data: product, sitemapURL, jsonld, canonical,
    };
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
    const sitemapURL = `${BETUEL_GROUP_ECOMMERCE_URL}sitemaps/categories/${category._id}.xml`;
    const jsonld = category && generateCategoryJSONLD(category);
    const canonical = getCategoryUrl(category);

    // category && setCachedResource(category, 'categories');
    return {
      data: category, sitemapURL, jsonld, canonical,
    };
  } catch (res: any) {
    return handleCachedCatch(res);
  }
};
