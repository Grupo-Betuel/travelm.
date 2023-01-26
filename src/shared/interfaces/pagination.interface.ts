export interface IPaginatedResponse<Data> {
  content: Data[]
  hasNext: boolean
  page: number
  payloadSize: number
  perPage: number
  totalPages: number
  totalRecords: number
}
