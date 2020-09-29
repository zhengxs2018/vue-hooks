export interface MockRequest {
  url: string
  path: string
  query: Record<string, string>
  params: Record<string, string | number>
}

export interface MockTable<T = any> {
  rows: T[]
  total: number
}
