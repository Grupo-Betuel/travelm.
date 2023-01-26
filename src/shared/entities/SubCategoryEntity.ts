import { BaseEntity } from './/BaseEntity'
import { CategoryEntity } from './/CategoryEntity'

export class SubCategoryEntity extends BaseEntity {
  name = ''
  slug = ''
  category = new CategoryEntity()
  params = 0
  createdAt = new Date()
}
