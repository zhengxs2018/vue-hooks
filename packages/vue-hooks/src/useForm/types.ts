import { Ref } from 'vue'
import type { UnwrapNestedRefs } from '../types'

export interface InitialState<T extends object> {
  (): T
}

export type FormMode = 'new' | 'edit'

export interface FetchHandler<T> {
  (): Promise<T>
}

export interface ValidateHandler<T extends object> {
  (data: T): boolean | unknown | Promise<boolean | unknown>
}

export interface SubmitHandler<T> {
  (data: T, mode: FormMode): Promise<void | unknown | T>
}

export interface CreateHandler<T> {
  (data: T): Promise<void | unknown | T>
}

export interface UpdateHandler<T> {
  (data: T): Promise<void | unknown | T>
}

export interface Serialize<T extends object> {
  (payload: T, keys: Array<keyof T>): T
}

export interface BaseFormOptions<T extends object> {
  mode?: FormMode
  loading?: boolean | Ref<boolean>
  data: InitialState<T>
  serialize?: Serialize<T>
  onFetch?: FetchHandler<T>
  onValidate?: ValidateHandler<T>
  onError?: (error: Error) => Promise<unknown> | never
}

export interface CustomFormOptions<T extends object> extends BaseFormOptions<T> {
  onSubmit: SubmitHandler<T>
}

export interface GeneralFormOptions<T extends object> extends BaseFormOptions<T> {
  onCreate: CreateHandler<T>
  onUpdate: UpdateHandler<T>
}

export type UseFormOptions<T extends object> = GeneralFormOptions<T> | CustomFormOptions<T>

export interface ResetOptions {
  mode?: FormMode
}

export interface UseFormInstance<T extends object> {
  loading: Ref<boolean>
  mode: Ref<FormMode>
  data: UnwrapNestedRefs<T>
  submit(): Promise<void>
  reset(options?: ResetOptions): Promise<void>
  toJSON(): T
}
