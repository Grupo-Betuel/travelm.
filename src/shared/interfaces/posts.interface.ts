import { IFilterParam } from '@interfaces/params.interface'
import { UserRoles } from '@interfaces/users.interface'

export type SortOrderTypes = 'asc' | 'desc'

export interface IPostFilters {
  title?: string
  categoryId?: string
  subCategoryId?: string
  filterParams?: IFilterParam[]
  priceRange?: [number, number]
  role?: UserRoles[]
  price?: SortOrderTypes
  createAt?: SortOrderTypes
  commission?: boolean
}

export type PostFiltersTagNamesTypes = {
  [N in keyof IPostFilters]: string
}
