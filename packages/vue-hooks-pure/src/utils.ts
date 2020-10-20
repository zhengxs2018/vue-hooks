export const noop = () => void 0

export const hasOwn = Object.prototype.hasOwnProperty

export function pick<T extends object, K extends (keyof T)[]>(data: T, keys: K): Partial<T> {
  return keys.reduce((obj, key) => {
    obj[key] = data[key]
    return obj
  }, {} as Partial<T>)
}


export function toSafeInteger<T = unknown>(value?: T, defaultsValue: number = 0): number {
  if (typeof value === 'string') {
    const num = parseInt(value, 10)
    return isNaN(num) ? defaultsValue : num
  }
  if (typeof value === 'number') {
    return isNaN(value) ? defaultsValue : value
  }
  return defaultsValue
}
