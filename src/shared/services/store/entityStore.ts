import { SetState, StoreApi, UseBoundStore } from 'zustand'
import create from 'zustand'
import { BaseService, IServiceMethodProperties } from '@services/BaseService'
import { BaseEntity } from '@shared/entities/BaseEntity'
import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { toast } from 'react-toastify'
import { Endpoints } from '@shared/enums/endpoints.enum'

export type EntityDataType<T> = {
  [N in Endpoints]: T[] | IPaginatedResponse<T>
} & { content: T[] | IPaginatedResponse<T> }

export interface IEntityStore<T> {
  data: EntityDataType<T>
  item: T
  add: (
    value: T,
    properties?: IServiceMethodProperties<T>,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => Promise<boolean | void>
  update: (
    value: { _id: string } & Partial<T>,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => Promise<boolean | void>
  remove: (id: string) => Promise<boolean | void>
  get: (
    properties?: IServiceMethodProperties<T>,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => void
  loading?: boolean
  error?: string
}

export const stateHandlerError =
  (set: SetState<IEntityStore<any>>) => (error: string) => {
    console.error('application error', error)
    if (process.env.NODE_ENV === 'development') {
      toast(`Forbidden: ${error.toString()}`, {
        autoClose: false,
        type: 'error',
      })
    }

    set((state: any) => ({
      ...state,
      error,
      loading: false,
    }))
  }

export function stateHandlerSuccess<T extends BaseEntity>(
  key: keyof IEntityStore<T>,
  data: T | T[],
  set: SetState<IEntityStore<any>>,
  endpoint?: Endpoints
) {
  const endpointData = endpoint
    ? { [endpoint]: data }
    : ({ content: data } as EntityDataType<T>)
  switch (key) {
    case 'add':
      set((state: any) => ({
        ...state,
        [key]: state.data,
        data: { ...state.data, ...endpointData },
        loading: false,
        error: undefined,
      }))
      break
    case 'update':
      set((state: any) => ({
        ...state,
        // data: state.data.map((item: T) =>
        //   item._id === (data as T)._id ? { ...item, ...data } : item
        // ),
        loading: false,
        error: undefined,
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
        data: { ...state.data, ...endpointData },
        loading: false,
        error: undefined,
      }))

      break
    case 'remove':
      set((state: any) => ({
        ...state,
        // data: state.data.filter((item: T) => item._id !== data._id),
        loading: false,
        error: undefined,
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
        properties: IServiceMethodProperties<T>,
        enableCache = true,
        cacheLifeTime: number = 60 * 1000 * 5
      ) => {
        set((state) => ({ ...state, loading: true }))
        const res = await service.add(
          entityData,
          properties,
          stateHandlerError(set),
          enableCache,
          cacheLifeTime
        )
        if (!!res) stateHandlerSuccess<T>('add', entityData, set)

        return !!res
      },
      update: async (
        entityData: { _id: string } & Partial<T>,
        enableCache?: boolean,
        cacheLifeTime: number = 60 * 1000 * 5
      ) => {
        set((state) => ({ ...state, loading: true }))
        const res = await service.update(
          entityData,
          stateHandlerError(set),
          enableCache,
          cacheLifeTime
        )
        if (!!res) {
          stateHandlerSuccess<{ _id: string } & Partial<T>>(
            'update',
            entityData,
            set
          )
        }

        return !!res
      },
      remove: async (
        id: string,
        enableCache?: boolean,
        cacheLifeTime: number = 60 * 1000 * 5
      ) => {
        set((state) => ({ ...state, loading: true }))
        const res = await service.remove(
          id,
          stateHandlerError(set),
          enableCache,
          cacheLifeTime
        )
        if (!!res) stateHandlerSuccess<BaseEntity>('remove', { _id: id }, set)
        return !!res
      },
      get: async (
        properties: IServiceMethodProperties<T>,
        enableCache = true,
        cacheLifeTime: number = 60 * 1000 * 5
      ) => {
        console.log('getting again!')
        set((state) => ({ ...state, loading: true }))
        const res = await service.get(
          properties,
          (data: T | T[] = []) => {
            stateHandlerSuccess('get', data as T[], set, properties.endpoint)
          },
          stateHandlerError(set),
          enableCache,
          cacheLifeTime
        )
        return !!res
      },
    }
  })
}
