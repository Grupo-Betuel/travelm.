import { UserEntity } from '@models/UserEntity'

export interface IAuthResponse {
  user: UserEntity
  access_token: string
}
