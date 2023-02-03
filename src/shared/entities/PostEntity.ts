import { BaseEntity } from './/BaseEntity'

export class PostEntity extends BaseEntity {
  price: number = 0
  categoryId: string = ''
  subCategoryId: string = ''
  slug: string = ''
  statusId: string = ''
  images: any[] = []
  typeCurrencyId: string = ''
  title = ''
  description = ''
  commission?: string
  userId?: string
  storeId?: string
}
