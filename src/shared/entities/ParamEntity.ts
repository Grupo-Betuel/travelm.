import { BaseEntity } from '@shared/entities/BaseEntity'

export type ParamTypes = 'CHECKBOX' | 'RADIO' | 'INPUT' | 'SELECT'

export class ParamEntity extends BaseEntity {
  name?: string = ''
  label: string = ''
  searchParameterType: ParamTypes = 'INPUT'
  responseParameterType: ParamTypes = 'INPUT'
  options?: string[] = []
  createdAt?: Date = new Date()
}
