import { Dispatch } from "redux";

export type RESTMethodsType = "post" | "put" | "get" | "delete";

export interface IRESTEndpointStructure {
  method: RESTMethodsType;
  path: string;
}

export type RESTApiType<T> = (data?: T) => (dispatch: Dispatch) => () => void;
