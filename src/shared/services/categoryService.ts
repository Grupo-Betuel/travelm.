import { BaseService } from '@services/BaseService';
import { CategoryEntity } from '@shared/entities/CategoryEntity';
import axios from 'axios';

export default class CategoryService extends BaseService<CategoryEntity> {
  constructor() {
    super('categories');
  }

  async getCategoryBySlug(slug: string) {
    return (await axios.get<CategoryEntity>(
      `${process.env.NEXT_PUBLIC_API_URL}api/categories/by-slug/${slug}`,
    )).data;
  }
}
