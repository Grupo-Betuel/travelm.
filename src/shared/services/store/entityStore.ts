import { SetState, StoreApi, UseBoundStore } from "zustand";
import create from "zustand";
import { BaseService } from "@services/BaseService";
import { useQuery } from "@tanstack/react-query";
export interface IEntityStore<T> {
  data: T[];
  item: T;
  add: (value: T) => Promise<void>;
  update: (id: number, value: Partial<T>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  get: (property: { [N in keyof T]: any }) => void;
  loading?: boolean;
}

export function createEntityStore<T extends { id: number }>(
  initData: T[],
  service: BaseService<T>
): UseBoundStore<StoreApi<IEntityStore<T>>> {
  return create<IEntityStore<T>>((set: SetState<IEntityStore<T>>) => ({
    data: initData,
    item: initData[0],
    add: async (entityData: T) => {
      set((state) => ({ ...state, loading: true }));
      await service.add(entityData);
      set((state: any) => ({
        ...state,
        data: [...state.data, { ...entityData, id: new Date().getTime() }],
        loading: false,
      }));
    },
    update: async (id: number, entityData: Partial<T>) => {
      set((state) => ({ ...state, loading: true }));
      await service.update(id, entityData);
      set((state: any) => ({
        ...state,
        data: state.data.map((item: T) =>
          item.id === id ? { ...item, ...entityData } : item
        ),
        loading: false,
      }));
    },
    remove: async (id: number) => {
      set((state) => ({ ...state, loading: true }));
      await service.remove(id);
      set((state: any) => ({
        ...state,
        data: state.data.filter((item: T) => item.id !== id),
        loading: false,
      }));
    },
    get: (properties: { [N in keyof T]: any }, cacheLiveTime?: number) => {
      set((state) => ({ ...state, loading: true }));
      service.get((data: T[]) => {
        set((state: any) => ({
          ...state,
          data: data.filter(
            (item: T) =>
              !!Object.keys(properties).find(
                (prop) => (item as any)[prop] === (properties as any)[prop]
              )
          ),
          loading: false,
        }));
      }, cacheLiveTime);
    },
  }));
}
