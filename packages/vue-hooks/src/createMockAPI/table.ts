import Mock from 'better-mock'

import type { MockTable } from './types'

export function createMockTable<T = any>(template: string | Record<string, any> | Function, range = 83): MockTable<T> {
  return Mock.mock({
    [`rows|${range}`]: [template],
    total() {
      return this.rows.length
    }
  })
}
