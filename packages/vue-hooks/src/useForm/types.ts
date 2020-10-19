import { Ref } from 'vue'
import type { UnwrapNestedRefs } from '../types'

export interface InitialState<T extends object> {
  (): T
}

export type FormMode = 'new' | 'edit'

export interface FetchHandler<T> {
  (): Promise<T>
}

export interface ValidateHandler<T> {
  (data: Partial<T>): boolean | unknown | Promise<boolean | unknown>
}

export interface SubmitHandler<T> {
  (data: Partial<T>): Promise<null | undefined | T>
}

export interface Serialize<T extends object> {
  (payload: Partial<T>, keys: Array<keyof T>): Partial<T>
}

export interface UseFormOptions<T extends object> {
  mode?: FormMode
  loading?: boolean | Ref<boolean>
  data: InitialState<T>
  serialize?: Serialize<T>
  onFetch: FetchHandler<T>
  onValidate?: ValidateHandler<T>
  onCreate: SubmitHandler<T>
  onUpdate: SubmitHandler<T>
  onError?: (error: Error) => Promise<any> | never
}

export interface ResetOptions {
  mode?: FormMode
}

export interface UseFormInstance<T extends object> {
  loading: Ref<boolean>
  mode: Ref<FormMode>
  data: UnwrapNestedRefs<T>
  submit(): Promise<void>
  reset(options?: ResetOptions): Promise<void>
  toJSON(): Partial<T>
}
