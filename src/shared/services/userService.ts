import { BaseService } from '@services/BaseService'
import { PostEntity } from '@shared/entities/PostEntity'
import { UserEntity } from '@shared/entities/UserEntity'

export class UserService extends BaseService<UserEntity> {
  constructor() {
    super('users')
  }
}
