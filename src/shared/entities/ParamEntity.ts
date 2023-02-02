import { BaseEntity } from '@shared/entities/BaseEntity'

export type ParamTypes = 'CHECKBOX' | 'RADIO' | 'INPUT' | 'SELECT'

export class ParamEntity extends BaseEntity {
  _id?: string // need to be removed in the future
  name?: string = ''
  label: string = ''
  parameterType: ParamTypes = 'INPUT'
  options?: any[] = []
  createdAt?: Date = new Date()
}
