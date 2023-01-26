import { BaseEntity } from './/BaseEntity'

export class UserEntity extends BaseEntity {
  name: string = ''
  lastName: string = ''
  email: string = ''
  userName: string = ''
  phone: number = 0
  role: string = ''
  password: string = ''
  storeMetadata?: any
}
