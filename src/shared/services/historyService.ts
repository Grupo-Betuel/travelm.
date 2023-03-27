import { BaseService } from '@services/BaseService'
import { HistoryEntity } from '@shared/entities/HistoryEntity'

export class HistoryService extends BaseService<HistoryEntity> {
  constructor() {
    super('searches')
  }
}
