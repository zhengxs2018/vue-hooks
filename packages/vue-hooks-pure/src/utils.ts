export const noop = () => void 0

export const hasOwn = Object.prototype.hasOwnProperty

export function pick<T extends object, K extends (keyof T)[]>(data: T, keys: K): Partial<T> {
  return keys.reduce((obj, key) => {
    obj[key] = data[key]
    return obj
  }, {} as Partial<T>)
}
