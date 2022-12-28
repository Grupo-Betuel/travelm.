import { BaseService } from '@services/BaseService'
import { ProductEntity } from '@models/ProductEntity'
import { UserEntity } from '@models/UserEntity'

export class UserService extends BaseService<UserEntity> {
  constructor() {
    super('users')
  }
}
