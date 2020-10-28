export const noop = () => void 0

export const hasOwn = Object.prototype.hasOwnProperty

/**
 *
 * @todo 这里的类型这么处理？
 *
 * @param data
 * @param keys
 */
export function pick<T extends object, K extends Array<string | symbol | number> = Array<keyof T>>(
  source: T,
  keys: K
): Partial<T> {
  const target: Partial<T> = {}

  keys.forEach((key) => {
    // @ts-ignore
    target[key] = source[key]
  })

  return target
}
