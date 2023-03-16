import { BaseService } from '@services/BaseService'
import { ParamEntity } from '@shared/entities/ParamEntity'

export class ParamService extends BaseService<ParamEntity> {
  constructor() {
    super('filter-params')
  }
}
