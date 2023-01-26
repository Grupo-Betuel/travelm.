import { BaseEntity } from '@models/BaseEntity'
import { SubCategoryEntity } from '@models/SubCategoryEntity'

export class CategoryEntity extends BaseEntity {
  name = ''
  slug = ''
  subCategories: SubCategoryEntity[] = []
  createdAt = new Date()
}
