export interface IPagination {
  hasNext: boolean
  page: number
  payloadSize: number
  perPage: number
  totalPages: number
  totalRecords: number
}

export interface IPaginatedResponse<Data> extends IPagination {
  content: Data[]
}
