import { BaseService } from '@services/BaseService'
import { ViewEntity } from '@shared/entities/ViewEntity'

export class ViewService extends BaseService<ViewEntity> {
  constructor() {
    super('views')
  }
}
