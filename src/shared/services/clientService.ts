import { BaseService } from '@services/BaseService';
import { ClientEntity } from '@shared/entities/ClientEntity';

export class ClientService extends BaseService<ClientEntity> {
  constructor() {
    super('clients');
  }
}
