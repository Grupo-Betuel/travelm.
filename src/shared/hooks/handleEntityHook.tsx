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

export interface HandleEntityProps<T> extends IServiceMethodProperties<T> {
  debounceTime?: number
}

export interface IGetEntityDataHookReturn<T>
  extends Omit<IEntityStore<T>, 'data'>,
    Partial<EntityEndpointsDataType<T>> {
  data: T[]
  pagination?: Omit<IPaginatedResponse<T>, 'content'>
}

export function handleEntityHook<T>(
  entityName: EntityNamesType,
  loadDataAutomatically?: boolean,
  properties?: HandleEntityProps<T>
): IGetEntityDataHookReturn<T> {
  const entity = useAppStore((state) => state[entityName]((statep) => statep))
  const { setAppLoading } = useContext(appLoadingContext)
  const entityDataRef = useRef<EntityEndpointsDataType<T>>(
    {} as EntityEndpointsDataType<T>
  )
  const getDataMethod = (props: IServiceMethodProperties<T> = {}) => {
    entity.get({ ...properties, ...props })
  }
  const getData = useRef(
    properties?.debounceTime
      ? debounce(getDataMethod, properties.debounceTime)
      : getDataMethod
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

  const getAllEntityData = () => {
    const endpointsData: EntityEndpointsDataType<T> =
      {} as EntityEndpointsDataType<T>
    Object.keys(entity.data).forEach(
      (key: keyof EntityEndpointsDataType<T> | any) => {
        ;(endpointsData as any)[key] = divideDataAndPagination(key)
      }
    )

    return endpointsData
  }

  useEffect(() => {
    entityDataRef.current = getAllEntityData()
  }, [entity.data])

  return {
    ...entity,
    ...divideDataAndPagination('content'),
    ...entityDataRef.current,
    get: getData,
  }
}
