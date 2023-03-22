import { IPaginatedResponse } from '@interfaces/pagination.interface'
import { IOption } from '@interfaces/common.intefacce'
import queryString from 'query-string'

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

export enum ObjectQueryIdentifierEnum {
  OBJECT = '%',
}

export function parseQueryToObject<T>(path: string): T {
  const res: T = queryString.parse(path, {
    arrayFormat: 'comma',
    parseNumbers: true,
  }) as T
  ;(Object.keys(res as object) as any).forEach((K: keyof T) => {
    if (
      typeof res[K] === 'string' &&
      (res[K] as string).includes(ObjectQueryIdentifierEnum.OBJECT)
    ) {
      res[K] = JSON.parse(res[K] as string)
    }
  })

  return res
}
