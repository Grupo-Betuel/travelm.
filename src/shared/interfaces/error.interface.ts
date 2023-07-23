import { StatusCode } from '@interfaces/REST.interface';

export interface IResponseError {
  data: {
    message: string
    statusCode: StatusCode
  }
  status: StatusCode
  statusText: string
}
