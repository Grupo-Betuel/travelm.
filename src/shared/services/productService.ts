import { BaseService } from '@services/BaseService'
import { ProductEntity } from '@shared/entities/ProductEntity'

export default class ProductService extends BaseService<ProductEntity> {
  constructor() {
    super('products')
  }
}
