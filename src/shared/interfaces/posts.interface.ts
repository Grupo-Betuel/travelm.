import { FilterParam } from '@interfaces/params.interface'
import { UserRoles } from '@interfaces/users.interface'

export type SortOrderTypes = 'asc' | 'desc'

export interface IPostFilters {
  title: string
  categoryId: string
  subCategoryId: string
  filterParams: FilterParam[]
  priceRange: [number, number]
  role: UserRoles[]
  price: SortOrderTypes
  createAt: SortOrderTypes
  commission: boolean
}
