import { UserEntity } from '@shared/entities/UserEntity'

export interface IAuthResponse {
  user: UserEntity
  access_token: string
}
