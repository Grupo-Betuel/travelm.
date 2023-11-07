import { BaseService } from '@services/BaseService';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import axios from 'axios';

export default class CompanyService extends BaseService<CompanyEntity> {
  constructor() {
    super('companies');
  }

  async getCompanyByRefName(companyId: string) {
    return (await axios.get<CompanyEntity>(
      `${process.env.NEXT_PUBLIC_API_URL}api/companies/by-ref-id/${companyId}`,
    )).data;
  }
}
