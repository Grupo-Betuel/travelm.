import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'

export type EntityEndpointsDataType<T> = {
  [N in EndpointsAndEntityStateKeys]: IEntityEndpointDataValue<T>
}

export interface IEntityEndpointDataValue<T> {
  data: T[]
  pagination?: Omit<IPaginatedResponse<T>, 'content'>
}
