import { Dispatch } from 'redux'

export type RESTMethodsType = 'post' | 'put' | 'get' | 'delete'

export interface IRESTEndpointStructure {
  method: RESTMethodsType
  path: string
}

export enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotFound = 404,
  BadRequest = 400,
}

export type RESTApiType<T> = (data?: T) => (dispatch: Dispatch) => () => void
