import { BaseService } from '@services/BaseService'
import { CategoryEntity } from '@shared/entities/CategoryEntity'

export default class CategoryService extends BaseService<CategoryEntity> {
  constructor() {
    super('categories')
  }
}
