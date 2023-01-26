import { BaseService } from '@services/BaseService'
import { CategoryEntity } from '@models/CategoryEntity'

export class CategoryService extends BaseService<CategoryEntity> {
  constructor() {
    super('categories')
  }
}
