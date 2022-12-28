import { EntityNamesType } from '@services/appEntitiesWithService'
import axios from 'axios'
import { CRUDTypes } from '@interfaces/CRUD.interface'
export type LocalStorageKeysType = {
  [N in CRUDTypes]: string
}

export class BaseService<T> {
  host = 'http://localhost:5000'
  version = 'v1'
  api = ''
  localStorageKey: LocalStorageKeysType

  constructor(public entity: EntityNamesType) {
    this.api = `${this.host}/api/${this.version}/${this.entity}`
    this.localStorageKey = {
      get: `store-app:get::${this.entity}`,
      add: `store-app:add::${this.entity}`,
      update: `store-app:update::${this.entity}`,
      remove: `store-app:remove::${this.entity}`,
    }
  }

  async get(
    callback: (data: T[]) => any,
    enableCache = true,
    cacheLiveTime: number = 60 * 1000 * 5
  ) {
    if (enableCache) {
      const cached = localStorage.getItem(this.localStorageKey.get)
      if (cached) {
        const data = JSON.parse(cached)
        callback(data)
        setTimeout(
          (key: string) => {
            localStorage.removeItem(key)
          },
          cacheLiveTime,
          this.localStorageKey.get
        )
      }
    }

    axios.get(this.api).then((res: { data: T[] }) => {
      const { data } = res
      localStorage.setItem(this.localStorageKey.get, JSON.stringify(data))
      callback(data)
    })
  }

  async add(
    data: T,
    callback?: (data: T) => void,
    enableCache = true,
    cacheLiveTime: number = 60 * 1000 * 5
  ): Promise<T> {
    if (enableCache) {
      const cached = localStorage.getItem(this.localStorageKey.add)
      if (cached) {
        const data = JSON.parse(cached) as T
        callback && callback(data)
        setTimeout(
          (key: string) => {
            localStorage.removeItem(key)
          },
          cacheLiveTime,
          this.localStorageKey.add
        )
      }
    }
    return await axios.post(this.api, data)
  }

  async update(id: number, data: Partial<T>) {
    return await axios.put(`${this.api}/${id}`, data)
  }

  async remove(id: number) {
    return await axios.delete(`${this.api}/${id}`)
  }
}
