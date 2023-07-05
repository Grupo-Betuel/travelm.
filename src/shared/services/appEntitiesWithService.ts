import { StoreApi, UseBoundStore } from 'zustand'
import { IEntityStore } from '@services/store/entityStore'
import { BaseEntity } from '@shared/entities/BaseEntity'
import { BaseService } from '@services/BaseService'
import { UserEntity } from '@shared/entities/UserEntity'
import { UserService } from '@services/userService'
import { AuthUserEntity } from '@shared/entities/AuthEntity'
import { AuthService } from '@services/authService'


export type EntityNamesType =
  | 'users'
  | 'auth/login'

export type EntityPerServiceType = {
  [N in EntityNamesType]: {
    entity: BaseEntity | any
    service: BaseService<any>
  }
}

export const appEntitiesWithService: EntityPerServiceType = {
  users: {
    entity: new UserEntity(),
    service: new UserService(),
  },
  'auth/login': {
    entity: new AuthUserEntity(),
    service: new AuthService(),
  },
}

export type AppEntitiesStoreType = {
  [N in EntityNamesType]: UseBoundStore<
    StoreApi<IEntityStore<typeof appEntitiesWithService[N]['entity']>>
  >
}
