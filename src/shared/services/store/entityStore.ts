import { SetState, StoreApi, UseBoundStore, create } from 'zustand';
import { BaseService, IServiceMethodProperties } from '@services/BaseService';
import { BaseEntity } from '@shared/entities/BaseEntity';
import { IPaginatedResponse } from '@interfaces/pagination.interface';
import { toast } from 'react-toastify';
import { EndpointsAndEntityStateKeys } from '@shared/enums/endpoints.enum';

export type EntityDataType<T> = {
  [N in EndpointsAndEntityStateKeys]: T[] | IPaginatedResponse<T>;
} & { content: T[] | IPaginatedResponse<T> };

export interface IEntityStore<T> {
  data: EntityDataType<T>;
  item: T;
  add: (
    value: Omit<T, '_id'>,
    properties?: IServiceMethodProperties<T>,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => Promise<boolean | void>;
  update: (
    value: { _id: string } & Partial<T>,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => Promise<boolean | void>;
  remove: (id: string) => Promise<boolean | void>;
  get: (
    properties?: IServiceMethodProperties<T>,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => void;
  loading?: boolean;
  fetching?: boolean;
  error?: string;
}

export const stateHandlerError =
  (set: SetState<IEntityStore<any>>) => (error: string) => {
    console.error('application error', error);
    if (process.env.NODE_ENV === 'development') {
      toast(`App Error: ${error?.toString()}`, {
        autoClose: false,
        type: 'error',
      });
    }

    set((state: any) => ({
      ...state,
      error,
      loading: false,
    }));
  };

export function stateHandlerSuccess<T extends BaseEntity>(
  key: keyof IEntityStore<T>,
  data: T | T[],
  set: SetState<IEntityStore<any>>,
  properties?: IServiceMethodProperties<T>,
  isCached?: boolean
) {
  let endpointData = {};
  let item: T;
  const content = data as T[];
  if (content.length === 1) item = content[0];

  if (!(data as any).content && !Array.isArray(content)) {
    item = !(content as T[]).length ? (data as T) : content[0];
  } else {
    const stateDataKey =
      properties?.storeDataInStateKey || properties?.endpoint;
    endpointData = stateDataKey
      ? { [stateDataKey]: data }
      : ({ content: data } as EntityDataType<T>);
  }

  switch (key) {
    case 'add':
      set((state: any) => ({
        ...state,
        item: item || state.item,
        data: { ...state.data, ...endpointData },
        loading: false,
        fetching: !!isCached,
        error: undefined,
      }));
      break;
    case 'update':
      set((state: any) => ({
        ...state,
        item: item || state.item,
        loading: false,
        fetching: !!isCached,
        error: undefined,
      }));
      break;
    case 'get':
      set((state: any) => ({
        ...state,
        item: item || state.item,
        data: { ...state.data, ...endpointData },
        loading: false,
        fetching: !!isCached,
        error: undefined,
      }));

      break;
    case 'remove':
      set((state: any) => ({
        ...state,
        // data: state.data.filter((item: T) => item._id !== data._id),
        loading: false,
        fetching: !!isCached,
        error: undefined,
      }));
      break;
  }
}

export function createEntityStore<T extends BaseEntity>(
  initData: T[],
  service: BaseService<T>
): UseBoundStore<StoreApi<IEntityStore<T>>> {
  return create<IEntityStore<T>>((set: SetState<IEntityStore<T>>): any => ({
    data: initData,
    item: initData[0],
    add: async (
      entityData: T,
      properties: IServiceMethodProperties<T>,
      enableCache = true,
      cacheLifeTime: number = 60 * 1000 * 5
    ) => {
      set((state) => ({ ...state, loading: true }));
      const res = await service.add(
        entityData,
        properties,
        stateHandlerError(set),
        enableCache,
        cacheLifeTime
      );
      if (res) stateHandlerSuccess<T>('add', res, set);

      return !!res;
    },
    update: async (
      entityData: { _id: string } & Partial<T>,
      enableCache: boolean = true,
      cacheLifeTime: number = 60 * 1000 * 5
    ) => {
      set((state) => ({ ...state, loading: true }));
      const res = await service.update(
        entityData,
        stateHandlerError(set),
        enableCache,
        cacheLifeTime
      );
      if (res) {
        stateHandlerSuccess<{ _id: string } & Partial<T>>(
          'update',
          entityData,
          set
        );
      }

      return !!res;
    },
    remove: async (
      id: string,
      enableCache?: boolean,
      cacheLifeTime: number = 60 * 1000 * 5
    ) => {
      set((state) => ({ ...state, loading: true }));
      const res = await service.remove(
        id,
        stateHandlerError(set),
        enableCache,
        cacheLifeTime
      );
      if (res) stateHandlerSuccess<BaseEntity>('remove', { _id: id }, set);
      return !!res;
    },
    get: async (
      properties: IServiceMethodProperties<T>,
      enableCache = true,
      cacheLifeTime: number = 60 * 1000 * 5
    ) => {
      set((state) => ({ ...state, loading: true, fetching: true }));
      console.log('klk men!');

      const res = await service.get(
        properties,
        (data: T | T[] = [], isCached?: boolean) => {
          stateHandlerSuccess('get', data as T[], set, properties, isCached);
        },
        stateHandlerError(set),
        enableCache,
        cacheLifeTime
      );
      return !!res;
    },
  }));
}
