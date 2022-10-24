import create, {
  GetState,
  Mutate,
  SetState,
  StoreApi,
  UseBoundStore,
} from "zustand";
import { persist } from "zustand/middleware";
import { createEntityStore, IEntityStore } from "@services/store/entityStore";
import { ProductEntity } from "@models/ProductEntity";
import {
  appEntitiesWithService,
  AppEntitiesStoreType,
} from "@services/store/appEntitiesWithService.ts";
import { EntityNamesType } from "@services/store/appEntitiesWithService";

/// APP STORE
export interface IAppStore extends AppEntitiesStoreType {
  count: number;
  handleCount: (isSubs?: boolean) => () => void;
}

export const appStore = (set: SetState<IAppStore>) => {
  const appStoreInit: IAppStore = {
    count: 0,
    handleCount: (isSubstract?: boolean) => () => {
      set((state) => ({
        ...state,
        count: isSubstract ? state.count - 1 : state.count + 1,
      }));
    },
  } as IAppStore;

  Object.keys(appEntitiesWithService).forEach(
    (k: EntityNamesType | any) =>
      ((appStoreInit as any)[k] = createEntityStore<ProductEntity>(
        [appEntitiesWithService[k].entity],
        appEntitiesWithService[k].service
      ))
  );

  return appStoreInit;
};

/// PERSIST DATA
export interface IPersistStore {
  name: string;
}

const persistStore = persist<IPersistStore>(
  (set) => ({
    name: "Williams",
  }),
  { name: "persist/commission" }
);

export const useStore = create<IAppStore & IPersistStore>((set, get, api) => ({
  ...persistStore(set, get, api),
  ...appStore(set),
}));
