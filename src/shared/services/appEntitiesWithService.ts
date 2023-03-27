import { StoreApi, UseBoundStore } from 'zustand'
import { IEntityStore } from '@services/store/entityStore'
import { PostEntity } from '@shared/entities/PostEntity'
import { BaseEntity } from '@shared/entities/BaseEntity'
import { BaseService } from '@services/BaseService'
import { ProductService } from '@services/productService'
import { UserEntity } from '@shared/entities/UserEntity'
import { UserService } from '@services/userService'
import { AuthUserEntity } from '@shared/entities/AuthEntity'
import { AuthService } from '@services/authService'
import { CategoryEntity } from '@shared/entities/CategoryEntity'
import { CategoryService } from '@services/categoryService'
import { ParamEntity } from '@shared/entities/ParamEntity'
import { ParamService } from '@services/paramService'
import { HistoryEntity } from '@shared/entities/HistoryEntity'
import { HistoryService } from './historyService'
import { ViewEntity } from '@shared/entities/ViewEntity'
import { ViewService } from './viewService'

export type EntityNamesType =
  | 'posts'
  | 'users'
  | 'auth/login'
  | 'categories'
  | 'filter-params'
  | 'searches'
  | 'views'

export type EntityPerServiceType = {
  [N in EntityNamesType]: {
    entity: BaseEntity | any
    service: BaseService<any>
  }
}

export const appEntitiesWithService: EntityPerServiceType = {
  posts: {
    entity: new PostEntity(),
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
  categories: {
    entity: new CategoryEntity(),
    service: new CategoryService(),
  },
  'filter-params': {
    entity: new ParamEntity(),
    service: new ParamService(),
  },
  searches: {
    entity: new HistoryEntity(),
    service: new HistoryService(),
  },
  views: {
    entity: new ViewEntity(),
    service: new ViewService(),
  },
}

export type AppEntitiesStoreType = {
  [N in EntityNamesType]: UseBoundStore<
    StoreApi<IEntityStore<typeof appEntitiesWithService[N]['entity']>>
  >
}
