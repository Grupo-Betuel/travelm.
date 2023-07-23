import { BaseService } from '@services/BaseService';
import { CompanyEntity } from '@shared/entities/CompanyEntity';

export default class CompanyService extends BaseService<CompanyEntity> {
  constructor() {
    super('companies');
  }
}
