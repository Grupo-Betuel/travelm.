import { EntityNamesType } from "@services/appEntitiesWithService";
import axios from "axios";

export class BaseService<T> {
  host = "http://localhost:5000";
  version = "v1";
  api = "";
  localStorageKey = "storeApp::";

  constructor(public entity: EntityNamesType) {
    this.api = `${this.host}/api/${this.version}/${this.entity}`;
    this.localStorageKey = `${this.localStorageKey}${this.entity}`;
  }

  async get(
    callback: (data: T[]) => any,
    cacheLiveTime: number = 60 * 1000 * 5
  ) {
    const cached = localStorage.getItem(this.localStorageKey);
    if (cached) {
      const data = JSON.parse(cached);
      callback(data);
      setTimeout(
        (key: string) => {
          localStorage.removeItem(key);
        },
        cacheLiveTime,
        this.localStorageKey
      );
    }

    axios.get(this.api).then((res: { data: T[] }) => {
      const { data } = res;
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      callback(data);
    });
  }

  async add(data: T): Promise<T> {
    return await axios.post(this.api, data);
  }

  async update(id: number, data: Partial<T>) {
    return await axios.put(`${this.api}/${id}`, data);
  }

  async remove(id: number) {
    return await axios.delete(`${this.api}/${id}`);
  }
}
