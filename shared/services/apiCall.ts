import { RESTMethodsType } from "@interfaces/REST-interface";

const baseUrl = "http://localhost";

export function apiCall<T>(body: any, method: RESTMethodsType, path: string) {
  const pathname = baseUrl + path;

  try {
    return fetch(pathname, {
      method,
      body,
    }).then((res) => res.json());
  } catch (err: any) {
    throw err.message;
  }
}
