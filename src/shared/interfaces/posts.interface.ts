import { IFilterParam } from '@interfaces/params.interface'
import { UserRoles } from '@interfaces/users.interface'
import { IOption } from './common.intefacce'

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

export type PostFiltersTagNamesType = {
  [N in Exclude<keyof IPostFilters, 'filterParams'>]: string
} & {
  filterParams?: IOption[]
}