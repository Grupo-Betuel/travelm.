import { IServiceMethodProperties } from '@services/store/entityStore'

export type CallbackType<T> = (data?: T | T[]) => void
export type HandleErrorType = (error: string) => void
export interface AbstractBaseService<T> {
  get: (
    properties: IServiceMethodProperties<T>,
    callBack: CallbackType<T>,
    handleError: HandleErrorType,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => {}
  add: (
    data: T,
    properties: IServiceMethodProperties<T>,
    handleError: HandleErrorType,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => {}
  update: (
    data: { _id: string } & Partial<T>,
    handleError: HandleErrorType,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => {}
  remove: (
    id: string,
    handleError: HandleErrorType,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => {}
}
