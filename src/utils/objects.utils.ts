import { IPaginatedResponse } from '@interfaces/pagination.interface'

export function extractContent<T>(data: IPaginatedResponse<T> | T[]): T[] {
  return (data as IPaginatedResponse<T>).content
    ? (data as IPaginatedResponse<T>).content
    : (data as T[])
}
