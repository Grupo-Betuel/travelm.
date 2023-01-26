import { BaseEntity } from './/BaseEntity'

export class PostEntity extends BaseEntity {
  price: number = 0
  categoryId: string = ''
  subCategoryId: string = ''
  statusId: string = ''
  images: any[] = []
  typeCurrencyId: string = ''
  title = ''
  description = ''
}
