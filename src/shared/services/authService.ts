import { BaseService } from '@services/BaseService'
import { AuthUser } from '@interfaces/auth.interface'

export class AuthService extends BaseService<AuthUser> {
  constructor() {
    super('users')
  }
}
