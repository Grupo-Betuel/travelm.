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
  const res: T = Object.fromEntries(new URLSearchParams(path))
  
  // const res: T = queryString.parse(path, {
  //   arrayFormat: 'comma',
  //   parseNumbers: true,
  // }) as T

  console.log('res filters', res, path)
  Object.keys(res).forEach((K: any) => {
    const v = (res as any)[K]
    if (v.includes('{') || v.includes('[')) {
      ;(res as any)[K] = JSON.parse(v)
    }
  })

  console.log('results', res)
  return res
}
