import { BaseEntity } from '@shared/entities/BaseEntity'
import { ParamTypes } from '@interfaces/params.interface'

export class ParamEntity extends BaseEntity {
  name?: string = ''
  label: string = ''
  searchParameterType: ParamTypes = 'INPUT'
  responseParameterType: ParamTypes = 'INPUT'
  options?: string[] = []
  createdAt?: Date = new Date()
}
