import { BaseEntity } from './BaseEntity';

export class CompanyEntity extends BaseEntity {
  name: string = '';

  companyId: string = '';

  phone: string = '';

  logo: string = '';
}
