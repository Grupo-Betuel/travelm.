import { BaseService } from '@services/BaseService'
import { PostEntity } from '@models/PostEntity'

export class ProductService extends BaseService<PostEntity> {
  constructor() {
    super('posts')
  }
}
