import { BaseEntity } from './BaseEntity';

export class ClientEntity extends BaseEntity {
  firstName: string = '';

  lastName: string = '';

  email: string = '';

  userName: string = '';

  phone: string = '';

  password: string = '';

  token?: string;
}
