import { SetState, StoreApi, UseBoundStore } from 'zustand'
import create from 'zustand'
import { BaseService } from '@services/BaseService'
import { BaseEntity } from '@models/BaseEntity'
export interface IEntityStore<T> {
  data: T[]
  item: T
  add: (
    value: T,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => Promise<void>
  update: (
    value: { _id: string } & Partial<T>,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => Promise<void>
  remove: (id: string) => Promise<void>
  get: (
    property: { [N in keyof T]: any },
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => void
  loading?: boolean
}

export const stopLoadingRollback = (set: SetState<IEntityStore<any>>) => () => {
  set((state: any) => ({
    ...state,
    loading: false,
  }))
}
export function updateState<T extends BaseEntity>(
  key: keyof IEntityStore<T>,
  data: T | T[],
  set: SetState<IEntityStore<any>>
) {
  switch (key) {
    case 'add':
      set((state: any) => ({
        ...state,
        data: [...state.data, { ...data }],
        loading: false,
      }))
      break
    case 'update':
      set((state: any) => ({
        ...state,
        data: state.data.map((item: T) =>
          item._id === (data as T)._id ? { ...item, ...data } : item
        ),
        loading: false,
      }))
      break
    case 'get':
      set((state: any) => ({
        ...state,
        // data: (data as T[]).filter(
        //   (item: T) =>
        //     !!Object.keys(properties).find(
        //       (prop) => (item as any)[prop] === (properties as any)[prop]
        //     )
        // ),
        data,
        loading: false,
      }))
      break
    case 'remove':
      set((state: any) => ({
        ...state,
        data: state.data.filter((item: T) => item._id !== data._id),
        loading: false,
      }))
      break
  }
}

export function createEntityStore<T extends BaseEntity>(
  initData: T[],
  service: BaseService<T>
): UseBoundStore<StoreApi<IEntityStore<T>>> {
  return create<IEntityStore<T>>((set: SetState<IEntityStore<T>>) => {
    return {
      data: initData,
      item: initData[0],
      add: async (
        entityData: T,
        enableCache = true,
        cacheLifeTime: number = 60 * 1000 * 5
      ) => {
        set((state) => ({ ...state, loading: true }))
        await service.add(
          entityData,
          stopLoadingRollback(set),
          enableCache,
          cacheLifeTime
        )
        updateState<T>('add', entityData, set)
      },
      update: async (
        entityData: { _id: string } & Partial<T>,
        enableCache?: boolean,
        cacheLifeTime: number = 60 * 1000 * 5
      ) => {
        set((state) => ({ ...state, loading: true }))
        await service.update(
          entityData,
          stopLoadingRollback(set),
          enableCache,
          cacheLifeTime
        )
        updateState<{ _id: string } & Partial<T>>('update', entityData, set)
      },
      remove: async (
        id: string,
        enableCache?: boolean,
        cacheLifeTime: number = 60 * 1000 * 5
      ) => {
        set((state) => ({ ...state, loading: true }))
        await service.remove(
          id,
          stopLoadingRollback(set),
          enableCache,
          cacheLifeTime
        )
        updateState<BaseEntity>('remove', { _id: id }, set)
      },
      get: async (
        properties: { [N in keyof T]: any },
        enableCache = true,
        cacheLifeTime: number = 60 * 1000 * 5
      ) => {
        set((state) => ({ ...state, loading: true }))
        await service.get(
          (data?: T | T[]) => {
            updateState('get', data as T[], set)
          },
          enableCache,
          cacheLifeTime
        )
      },
    }
  })
}
