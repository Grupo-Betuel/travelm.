import { useContext, useEffect, useRef } from 'react'
import { appLoadingContext } from '../../pages/_app'
import { useAppStore } from '@services/store'
import { EntityNamesType } from '@services/appEntitiesWithService'
import { IServiceMethodProperties } from '@services/BaseService'
import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { debounce } from 'lodash'
import { IEntityStore } from '@services/store/entityStore'

export interface IGetEntityDataHookReturn<T> extends IEntityStore<T> {
  data: T[]
  pagination?: Omit<IPaginatedResponse<T>, 'content'>
}

export function handleEntityHook<T>(
  entityName: EntityNamesType,
  loadDataAutomatically?: boolean,
  properties?: IServiceMethodProperties<T>
): IGetEntityDataHookReturn<T> {
  const entity = useAppStore((state) => state[entityName]((statep) => statep))
  const { setAppLoading } = useContext(appLoadingContext)
  const getData = useRef(
    debounce((props: IServiceMethodProperties<T> = {}) => {
      entity.get({ ...properties, ...props })
    }, 600)
  ).current

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
    ...entity,
    data: [...(data || [])],
    pagination,
    get: getData,
  }
}
