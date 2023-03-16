import { BaseEntity } from './/BaseEntity'
import { SubCategoryEntity } from './/SubCategoryEntity'

export class CategoryEntity extends BaseEntity {
  name = ''
  slug = ''
  subCategories: SubCategoryEntity[] = []
  createdAt?: Date = new Date()
  params: string[] = []
}
