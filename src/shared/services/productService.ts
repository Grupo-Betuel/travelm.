import { BaseService } from '@services/BaseService'
import { PostEntity } from '@shared/entities/PostEntity'

export class ProductService extends BaseService<PostEntity> {
  constructor() {
    super('posts')
  }
}
