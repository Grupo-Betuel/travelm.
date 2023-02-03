import { useContext, useEffect, useRef } from 'react'
import { appLoadingContext } from '../../pages/_app'
import { useAppStore } from '@services/store'
import { EntityNamesType } from '@services/appEntitiesWithService'
import { IServiceMethodProperties } from '@services/BaseService'
import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { debounce } from 'lodash'
import { EntityDataType, IEntityStore } from '@services/store/entityStore'
import {
  EntityEndpointsDataType,
  IEntityEndpointDataValue,
} from '@interfaces/entities.interface'

export interface IGetEntityDataHookReturn<T>
  extends Omit<IEntityStore<T>, 'data'>,
    Partial<EntityEndpointsDataType<T>> {
  data: T[]
  pagination?: Omit<IPaginatedResponse<T>, 'content'>
}

export function handleEntityHook<T>(
  entityName: EntityNamesType,
  loadDataAutomatically?: boolean,
  properties?: IServiceMethodProperties<T>,
  debounceTime?: number
): IGetEntityDataHookReturn<T> {
  const entity = useAppStore((state) => state[entityName]((statep) => statep))
  const { setAppLoading } = useContext(appLoadingContext)
  const getData = useRef(
    debounce((props: IServiceMethodProperties<T> = {}) => {
      entity.get({ ...properties, ...props })
    }, debounceTime)
  ).current

  useEffect(() => {
    loadDataAutomatically && getData()
  }, [loadDataAutomatically])

  useEffect(() => {
    setAppLoading(entity.loading)
  }, [entity.loading])

  /* divideDataAndPagination, all data from the api can has pagination, this method dived the data from the pagination
   * key: key according the endpoint data returned from api
   * */
  const divideDataAndPagination = (
    key: keyof EntityDataType<T>
  ): IEntityEndpointDataValue<T> => {
    const value = entity.data[key] || []

    const data = (value as IPaginatedResponse<T>).content
      ? (value as IPaginatedResponse<T>).content
      : (value as T[])

    const pagination = (value as IPaginatedResponse<T>).content
      ? { ...(value as IPaginatedResponse<T>), content: undefined }
      : undefined

    return { data, pagination }
  }

  const getEndpointData = () => {
    const endpointsData: EntityEndpointsDataType<T> = {} as any
    Object.keys(entity.data).forEach(
      (key: keyof EntityEndpointsDataType<T> | any) => {
        ;(endpointsData as any)[key] = divideDataAndPagination(key)
      }
    )

    return endpointsData
  }

  return {
    ...entity,
    ...divideDataAndPagination('content'),
    ...getEndpointData(),
    get: getData,
  }
}
