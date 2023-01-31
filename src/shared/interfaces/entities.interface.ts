import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { Endpoints } from '@shared/enums/endpoints.enum'

export type EntityEndpointsDataType<T> = {
  [N in Endpoints]: IEntityEndpointDataValue<T>
}

export interface IEntityEndpointDataValue<T> {
  data: T[]
  pagination?: Omit<IPaginatedResponse<T>, 'content'>
}
