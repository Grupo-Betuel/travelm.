import CompanyService from '@services/companyService';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import { ProductEntity } from '@shared/entities/ProductEntity';
import ProductService from '@services/productService';
import { CategoryEntity } from '@shared/entities/CategoryEntity';
import CategoryService from '@services/categoryService';
import { CachedResourceType, setCachedResource } from './fs.utils';

export const handleCachedCompany = async (companyId: string): Promise<CompanyEntity> => {
  const companyService = new CompanyService();
  const currentCompany = await companyService.getCompanyByRefName(companyId);
  currentCompany && setCachedResource(currentCompany, 'companies', currentCompany.companyId);
  return currentCompany;
};

export const handleCachedProduct = async (productId: string): Promise<ProductEntity> => {
  const productService = new ProductService();
  const product = await productService.getProductById(productId);
  product && setCachedResource(product, 'products');
  return product;
};

export const handleCachedCategories = async (catId: string): Promise<CategoryEntity> => {
  const categoryService = new CategoryService();
  const category = await categoryService.getCategoryById(catId);
  category && setCachedResource(category, 'categories');
  return category;
};
