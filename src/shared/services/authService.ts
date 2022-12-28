import { BaseService } from '@services/BaseService'
import { AuthUserEntity } from '@models/auth.model'

export class AuthService extends BaseService<AuthUserEntity> {
  constructor() {
    super('auth/login')
  }
}
