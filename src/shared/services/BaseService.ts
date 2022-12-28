import { EntityNamesType } from '@services/appEntitiesWithService'
import { CRUDTypes } from '@interfaces/CRUD.interface'
import { http } from '@services/utils/http.util'
import {
  AbstractBaseService,
  CallbackType,
  RollbackType,
} from '@interfaces/baseService.interface'

export type LocalStorageKeysType = {
  [N in CRUDTypes]: string
}

export class BaseService<T> implements AbstractBaseService<T> {
  version = 'v1'
  apiPrefix = 'api'
  api = ''
  localStorageKey: LocalStorageKeysType

  constructor(public entity: EntityNamesType) {
    this.api = `http://localhost:5000/${this.apiPrefix}/${this.version}/${this.entity}`
    this.localStorageKey = {
      get: `store-app:get::${this.entity}`,
      add: `store-app:add::${this.entity}`,
      update: `store-app:update::${this.entity}`,
      remove: `store-app:remove::${this.entity}`,
    }
  }

  async get(
    callback: CallbackType<T>,
    enableCache = true,
    cacheLifeTime: number = 60 * 1000 * 5
  ) {
    try {
      if (enableCache) {
        const cached = this.getCachedData('get')
        if (cached) {
          callback(cached)
        }
      }

      const { data } = await http.get<T[]>(this.api)
      enableCache && this.cacheData(data, 'get', cacheLifeTime)
      callback(data)
    } catch (err) {
      // nothing
    }
  }

  async add(
    data: T,
    rollback?: RollbackType,
    enableCache = true,
    cacheLifeTime: number = 60 * 1000 * 5
  ) {
    try {
      const res = await http.post<T>(this.api, data)
      enableCache && this.cacheData(res.data, 'add', cacheLifeTime)
    } catch (err) {
      rollback && rollback()
    }
  }

  async update(
    data: { _id: string } & Partial<T>,
    rollback?: RollbackType,
    enableCache = true,
    cacheLifeTime: number = 60 * 1000 * 5
  ) {
    try {
      const res = await http.put(`${this.api}/${data._id}`, data)
      enableCache && this.cacheData(res.data as T, 'update', cacheLifeTime)
    } catch (err) {
      rollback && rollback()
    }
  }

  async remove(
    id: string,
    rollback?: RollbackType,
    enableCache = true,
    cacheLifeTime: number = 60 * 1000 * 5
  ) {
    try {
      const { data } = await http.delete<T>(`${this.api}/${id}`)
      enableCache && this.cacheData(data, 'remove', cacheLifeTime)
    } catch (err) {
      rollback && rollback()
    }
  }

  cacheData(data: T | T[], key: CRUDTypes, cacheLifeTime: number) {
    localStorage.setItem(this.localStorageKey[key], JSON.stringify(data))

    // automatic remove cache
    setTimeout(
      (key: string) => {
        localStorage.removeItem(key)
      },
      cacheLifeTime,
      this.localStorageKey[key]
    )
  }

  getCachedData(key: CRUDTypes): T | T[] | null {
    const cached = localStorage.getItem(this.localStorageKey[key])
    if (cached) {
      return JSON.parse(cached)
    }

    return null
  }
}
