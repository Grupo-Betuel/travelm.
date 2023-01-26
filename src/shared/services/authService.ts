import { BaseService } from '@services/BaseService'
import { AuthUserEntity } from '@shared/entities/AuthEntity'

export class AuthService extends BaseService<AuthUserEntity> {
  constructor() {
    super('auth/login')
  }
}
