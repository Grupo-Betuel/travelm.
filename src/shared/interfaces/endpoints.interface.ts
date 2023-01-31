import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { Endpoints } from '@shared/enums/endpoints.enum'

export type EndpointsDataType<T> = {
  [N in Endpoints]: IEndpointDataValue<T>
}

export interface IEndpointDataValue<T> {
  data: T[]
  pagination?: Omit<IPaginatedResponse<T>, 'content'>
}
