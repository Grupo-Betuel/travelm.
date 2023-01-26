import { BaseService } from '@services/BaseService'
import { PostEntity } from '@models/PostEntity'
import { UserEntity } from '@models/UserEntity'

export class UserService extends BaseService<UserEntity> {
  constructor() {
    super('users')
  }
}
