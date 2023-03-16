import { BaseEntity } from './/BaseEntity'
import { CategoryEntity } from './/CategoryEntity'

export class SubCategoryEntity extends BaseEntity {
  name = ''
  slug = ''
  createdAt?: Date = new Date()
  params: string[] = []
}
