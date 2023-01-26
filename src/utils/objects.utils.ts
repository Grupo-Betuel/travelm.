import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { IOption } from '@interfaces/common.intefacce'

export function extractContent<T>(data: IPaginatedResponse<T> | T[]): T[] {
  return (data as IPaginatedResponse<T>).content
    ? (data as IPaginatedResponse<T>).content
    : (data as T[])
}

export function parseToOptionList<T>(
  data: T[],
  valueProp: keyof T,
  labelProp: keyof T
): IOption[] {
  return data.map((item) => ({
    label: item[labelProp] as string,
    value: item[valueProp] as string,
  }))
}
