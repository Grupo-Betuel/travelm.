import CompanyService from '@services/companyService';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { ProductEntity } from '@shared/entities/ProductEntity';
import ProductService from '@services/productService';
import { CategoryEntity } from '@shared/entities/CategoryEntity';
import CategoryService from '@services/categoryService';
// import { setCachedResource } from './fs.utils';
export interface IErrorResponse {
  status: number;
  message: string;
}

export interface ICachedResourceResponse<T> {
  data?: T;
  error?: IErrorResponse | null;
}

export const handleCachedCatch = (res: any) => {
  const { response: { data, status } } = res;
  return { error: { message: data, status } as IErrorResponse };
};

export async function handleCachedCompany(
  companyId: string,
): Promise<ICachedResourceResponse<CompanyEntity>> {
  try {
    const companyService = new CompanyService();
    const currentCompany = await companyService.getCompanyByRefName(companyId);
    // currentCompany && setCachedResource(currentCompany, 'companies', currentCompany.companyId);
    return { data: currentCompany };
  } catch (res: any) {
    return handleCachedCatch(res);
  }
}

export const handleCachedProduct = async (
  productId: string,
): Promise<ICachedResourceResponse<ProductEntity>> => {
  try {
    const productService = new ProductService();
    const product = await productService.getProductById(productId);
    // product && setCachedResource(product, 'products');
    return { data: product };
  } catch (res: any) {
    return handleCachedCatch(res);
  }
};

export const handleCachedCategories = async (
  catId: string,
): Promise<ICachedResourceResponse<CategoryEntity>> => {
  try {
    const categoryService = new CategoryService();
    const category = await categoryService.getCategoryById(catId);
    // category && setCachedResource(category, 'categories');
    return { data: category };
  } catch (res: any) {
    return handleCachedCatch(res);
  }
};
