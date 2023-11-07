import { BaseService } from '@services/BaseService';
import { ProductEntity } from '@shared/entities/ProductEntity';
import axios from 'axios';

export default class ProductService extends BaseService<ProductEntity> {
  constructor() {
    super('products');
  }

  async getProductById(productId: string) {
    return (await axios.get<ProductEntity>(
      `${process.env.NEXT_PUBLIC_API_URL}api/products/by-id/${productId}`,
    )).data;
  }
}
