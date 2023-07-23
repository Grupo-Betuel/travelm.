import { StoreApi, UseBoundStore } from 'zustand';
import { IEntityStore } from '@services/store/entityStore';
import { BaseEntity } from '@shared/entities/BaseEntity';
import { BaseService } from '@services/BaseService';
import { ClientEntity } from '@shared/entities/ClientEntity';
import { ClientService } from '@services/clientService';
import { ProductEntity } from '@shared/entities/ProductEntity';
import ProductService from '@services/productService';
import OrderEntity from '@shared/entities/OrderEntity';
import OrderService from '@services/orderService';
import { CategoryEntity } from '@shared/entities/CategoryEntity';
import CategoryService from '@services/categoryService';
import { CompanyEntity } from '@shared/entities/CompanyEntity';
import CompanyService from '@services/companyService';

export type EntityNamesType =
  | 'clients'
  | 'products'
  | 'orders'
  | 'categories'
  | 'companies';

export type EntityPerServiceType = {
  [N in EntityNamesType]: {
    entity: BaseEntity | any
    service: BaseService<any>
  }
};

export const appEntitiesWithService: EntityPerServiceType = {
  clients: {
    entity: new ClientEntity(),
    service: new ClientService(),
  },
  products: {
    entity: new ProductEntity(),
    service: new ProductService(),
  },
  orders: {
    entity: new OrderEntity(),
    service: new OrderService(),
  },
  categories: {
    entity: new CategoryEntity(),
    service: new CategoryService(),
  },
  companies: {
    entity: new CompanyEntity(),
    service: new CompanyService(),
  },
};

export type AppEntitiesStoreType = {
  [N in EntityNamesType]: UseBoundStore<
  StoreApi<IEntityStore<(typeof appEntitiesWithService)[N]['entity']>>
  >
};
