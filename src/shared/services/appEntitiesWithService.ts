import { StoreApi, UseBoundStore } from 'zustand'
import { IEntityStore } from '@services/store/entityStore'
import { ProductEntity } from '@models/ProductEntity'
import { BaseEntity } from '@models/BaseEntity'
import { BaseService } from '@services/BaseService'
import { ProductService } from '@services/productService'
import { UserEntity } from '@models/UserEntity'
import { UserService } from '@services/userService'
import { AuthUserEntity } from '@models/auth.model'
import { AuthService } from '@services/authService'

export type EntityNamesType = 'posts' | 'users' | 'auth/login'

export type EntityPerServiceType = {
  [N in EntityNamesType]: {
    entity: BaseEntity | any
    service: BaseService<any>
  }
}

export const appEntitiesWithService: EntityPerServiceType = {
  posts: {
    entity: new ProductEntity(),
    service: new ProductService(),
  },
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
