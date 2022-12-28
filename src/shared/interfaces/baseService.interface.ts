export type CallbackType<T> = (data?: T | T[]) => void
export type RollbackType = () => void
export interface AbstractBaseService<T> {
  get: (
    callBack: CallbackType<T>,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => {}
  add: (
    data: T,
    rollback: RollbackType,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => {}
  update: (
    data: { _id: string } & Partial<T>,
    rollback: RollbackType,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => {}
  remove: (
    id: string,
    rollback: RollbackType,
    enableCache?: boolean,
    cacheLifeTime?: number
  ) => {}
}
