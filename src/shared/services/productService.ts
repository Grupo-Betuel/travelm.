import { BaseService } from '@services/BaseService';
import {
  IProductPerCategory,
  ProductEntity,
} from '@shared/entities/ProductEntity';
import axios from 'axios';
import { IPaginatedResponse } from '@interfaces/pagination.interface';

export default class ProductService extends BaseService<ProductEntity> {
  constructor() {
    super('products');
  }

  async getProductBySlug(slug: string) {
    return (
      await axios.get<ProductEntity>(
        `${process.env.NEXT_PUBLIC_API_URL}api/products/by-slug/${slug}`,
      )
    ).data;
  }

  async getProductByCompany(companyId: string) {
    return (
      await axios.get<ProductEntity[]>(
        `${process.env.NEXT_PUBLIC_API_URL}api/products/by-company/${companyId}`,
      )
    ).data;
  }

  async getProductsPerCategories(companyId: string): Promise<IProductPerCategory[]> {
    return (
      await axios.get<IPaginatedResponse<IProductPerCategory>>(
        `${process.env.NEXT_PUBLIC_API_URL}api/products/per-category/${companyId}`,
        {
          params: {
            limit: 2,
            page: 1,
          },
        },
      )
    ).data?.content;
  }
}
