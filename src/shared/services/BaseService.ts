import { EntityNamesType } from '@services/appEntitiesWithService'
import { CRUDTypes } from '@interfaces/CRUD.interface'
import { http } from '@services/utils/http.util'
import {
  AbstractBaseService,
  CallbackType,
  HandleErrorType,
} from '@interfaces/baseService.interface'
import { IResponseError } from '@interfaces/error.interface'
import { deepMatch } from '../../utils/matching.util'
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum'
import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { extractContent } from '../../utils/objects.utils'

export interface IServiceMethodProperties<T> {
  queryParams?: { [N in keyof T]: any } | any
  endpoint?: EndpointsAndEntityStateKeys
  slug?: string
  storeDataInStateKey?: EndpointsAndEntityStateKeys
  queryString?: string
}

export type LocalStorageKeysType = {
  [N in CRUDTypes]: string
}

export class BaseService<T> implements AbstractBaseService<T> {
  version = 'v1'
  apiPrefix = 'api'
  api = ''
  localStorageKey: LocalStorageKeysType

  constructor(public entity: EntityNamesType) {
    this.api = `${this.apiPrefix}/${this.version}/${this.entity}`
    this.localStorageKey = {
      get: `store-app:get::${this.entity}`,
      add: `store-app:add::${this.entity}`,
      update: `store-app:update::${this.entity}`,
      remove: `store-app:remove::${this.entity}`,
    }
  }

  async get(
    properties: IServiceMethodProperties<T> = {} as IServiceMethodProperties<T>,
    callback: CallbackType<T>,
    handleError: HandleErrorType,
    enableCache = false,
    cacheLifeTime: number = 60 * 1000 * 5
  ): Promise<T[] | IPaginatedResponse<T> | undefined> {
    try {
      if (enableCache) {
        const cached = this.getCachedData('get', properties)
        if (cached && cached) {
          callback(cached, true)
        }
      }

      const extraPath = this.handleServiceMethodPathProperties(properties)

      let { data } = await http.get<T[] | IPaginatedResponse<T>>(
        `${this.api}${extraPath}`,
        {
          params: { ...properties.queryParams, perPage: 10 },
        }
      )
      if (enableCache) {
        const cachedData: T[] = this.cacheData(
          extractContent(data),
          'get',
          cacheLifeTime,
          properties
        ) as T[]

        if (cachedData && (data as IPaginatedResponse<T>).content) {
          ;(data as IPaginatedResponse<T>).content = cachedData
        } else if (cachedData) {
          data = cachedData
        }
      }

      callback((data as T[]) || [])
      return data
    } catch (err: any) {
      handleError && handleError(err.data ? err.data.message : err.message)
      // nothing
    }
  }

  async add(
    data: T,
    properties: IServiceMethodProperties<T> = {} as IServiceMethodProperties<T>,
    handleError?: HandleErrorType,
    enableCache = true,
    cacheLifeTime: number = 60 * 1000 * 5
  ): Promise<T | undefined> {
    try {
      const extraPath = this.handleServiceMethodPathProperties(properties)
      const res = await http.post<T>(`${this.api}${extraPath}`, data)
      enableCache && this.cacheData(res.data, 'add', cacheLifeTime)
      return res as T
    } catch (err: IResponseError | any) {
      handleError && handleError(err.data ? err.data.message : err.message)
    }
  }

  async update(
    data: { _id: string } & Partial<T>,
    handleError?: HandleErrorType,
    enableCache = true,
    cacheLifeTime: number = 60 * 1000 * 5
  ): Promise<T | undefined> {
    try {
      const res = await http.put(`${this.api}/${data._id}`, data)
      enableCache && this.cacheData(res.data as T, 'update', cacheLifeTime)
      return res as T
    } catch (err: IResponseError | any) {
      handleError && handleError(err.data.message)
    }
  }

  async remove(
    id: string,
    handleError?: HandleErrorType,
    enableCache = true,
    cacheLifeTime: number = 60 * 1000 * 5
  ): Promise<boolean | undefined> {
    try {
      const { data } = await http.delete<T>(`${this.api}/${id}`)
      enableCache && this.cacheData(data, 'remove', cacheLifeTime)
      return !!data
    } catch (err: IResponseError | any) {
      handleError && handleError(err.data.message)
    }
  }

  cacheData(
    data: T | T[],
    key: CRUDTypes,
    cacheLifeTime: number,
    properties?: IServiceMethodProperties<T>
  ): T | T[] {
    if (key === 'get') {
      let oldData: T[] = []

      if (
        properties &&
        properties.storeDataInStateKey ===
          EndpointsAndEntityStateKeys.INFINITE_SCROLL_DATA
      ) {
        oldData = JSON.parse(
          localStorage.getItem(this.localStorageKey[key]) || '[]'
        )
      }

      let items: T[] = [...(data as T[]), ...oldData]
      // when key is get just will be cached if it's longer than 1 item
      items.length &&
        items.length > 1 &&
        localStorage.setItem(this.localStorageKey[key], JSON.stringify(items))
      return items
    } else {
      localStorage.setItem(this.localStorageKey[key], JSON.stringify(data))
    }

    // automatic remove cache
    setTimeout(
      (key: string) => {
        localStorage.removeItem(key)
      },
      cacheLifeTime,
      this.localStorageKey[key]
    )

    return data
  }

  getCachedData(
    key: CRUDTypes,
    properties?: IServiceMethodProperties<T>
  ): T | T[] | null {
    const cached = localStorage.getItem(this.localStorageKey[key])
    if (cached && cached !== '[]' && cached !== '{}') {
      const data = JSON.parse(cached)
      const value = properties?.queryParams?.title || properties?.slug
      const res = value ? deepMatch(value, data) : data
      return res
    }

    return null
  }

  handleServiceMethodPathProperties(properties: IServiceMethodProperties<T>) {
    let extraPath = ''

    if (properties.endpoint) {
      extraPath = `/${properties.endpoint}`
    }

    if (properties.slug) {
      if (typeof properties.slug === 'object') {
        extraPath = `${extraPath}/${(properties.slug as any[]).join('/')}`
      } else {
        extraPath = `${extraPath}/${properties.slug}`
      }
    }

    if (properties.queryString) {
      extraPath = `${extraPath}?${properties.queryString}`
    }

    return extraPath
  }
}
