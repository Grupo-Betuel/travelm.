import { BaseEntity } from '@models/BaseEntity'
import { CategoryEntity } from '@models/CategoryEntity'

export class SubCategoryEntity extends BaseEntity {
  name = ''
  slug = ''
  category = new CategoryEntity()
  params = 0
  createdAt = new Date()
}
