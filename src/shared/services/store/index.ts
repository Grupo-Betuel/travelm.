import { create, SetState } from 'zustand';
import { persist } from 'zustand/middleware';
import { createEntityStore } from '@services/store/entityStore';
import { mountStoreDevtool } from 'simple-zustand-devtools';

import {
  appEntitiesWithService,
  AppEntitiesStoreType,
  EntityNamesType,
} from '@services/appEntitiesWithService';
import { BaseEntity } from '@shared/entities/BaseEntity';
import OrderEntity from '@shared/entities/OrderEntity';

/// APP STORE
export interface IAppStore extends AppEntitiesStoreType {
  count: number;
  handleCount: (isSubs?: boolean) => () => void;
  handleCurrentOrder: (order: OrderEntity) => void;
  currentOrder: OrderEntity;
}

export const appStore = (set: SetState<IAppStore>) => {
  const appStoreInit: IAppStore = {
    count: 0,
    handleCurrentOrder: (order: OrderEntity) => {
      set((state) => ({
        ...state,
        currentOrder: order,
      }));
    },
    handleCount: (isSubstract?: boolean) => () => {
      set((state) => ({
        ...state,
        count: isSubstract ? state.count - 1 : state.count + 1,
      }));
    },
  } as IAppStore;
  (Object.keys(appEntitiesWithService) as EntityNamesType[]).forEach(
    (k: EntityNamesType) => ((
      appStoreInit as any
    )[k] = createEntityStore<BaseEntity>(
      [appEntitiesWithService[k].entity],
      appEntitiesWithService[k].service,
    )),
  );

  return appStoreInit;
};

/// PERSIST DATA
export interface IPersistStore {
  name: string;
}

const persistStore = persist<IPersistStore>(
  () => ({
    name: 'Williams',
    // order: new OrderEntity(),
  }),
  { name: 'persist/commission' },
);

export const useAppStore = create<IAppStore & IPersistStore>(
  (set, get, api) => ({
    ...persistStore(set, get, api),
    ...appStore(set),
  }),
);

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('appStore', useAppStore);
}
