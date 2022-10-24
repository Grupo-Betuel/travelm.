export class BaseService<T> {
  async get(properties: { [N in keyof T]: any }) {
    return (await new Promise((resolve) =>
      setTimeout(() => resolve([]), 3000)
    )) as any;
  }

  async add(data: T) {
    return (await new Promise((resolve) =>
      setTimeout(() => resolve([]), 1000)
    )) as any;
  }

  async update(id: number, data: T) {
    return (await new Promise((resolve) =>
      setTimeout(() => resolve([]), 1000)
    )) as any;
  }

  async remove(id: number) {
    return (await new Promise((resolve) =>
      setTimeout(() => resolve([]), 1000)
    )) as any;
  }
}
