import { useContext, useEffect } from 'react'
import { appLoadingContext } from '../../pages/_app'
import { useAppStore } from '@services/store'
import { EntityNamesType } from '@services/appEntitiesWithService'
import { IServiceMethodProperties } from '@services/BaseService'
import { IPaginatedResponse } from '@interfaces/pagination.interface'
import _ from 'lodash'

export interface IGetEntityDataHookReturn<T> {
  loading?: boolean
  data: T[]
  getData: (props?: IServiceMethodProperties<T>) => void
  pagination?: Omit<IPaginatedResponse<T>, 'content'>
}

export function getEntityDataHook<T>(
  entityName: EntityNamesType,
  loadDataAutomatically?: boolean,
  properties?: IServiceMethodProperties<T>
): IGetEntityDataHookReturn<T> {
  const entity = useAppStore((state) => state[entityName]((statep) => statep))
  const { setAppLoading } = useContext(appLoadingContext)
  const getData = _.debounce((props: IServiceMethodProperties<T> = {}) => {
    console.log('getting data!')
    entity.get({ ...properties, ...props })
  }, 600)

  useEffect(() => {
    loadDataAutomatically && getData()
  }, [loadDataAutomatically])

  useEffect(() => {
    setAppLoading(entity.loading)
  }, [entity.loading])

  const data = (entity.data as IPaginatedResponse<T>).content
    ? (entity.data as IPaginatedResponse<T>).content
    : (entity.data as T[])
  const pagination = (entity.data as IPaginatedResponse<T>).content
    ? { ...(entity.data as IPaginatedResponse<T>), content: undefined }
    : undefined

  return {
    loading: entity.loading,
    data: [...(data || [])],
    pagination,
    getData,
  }
}
