import { reactive, ref, unref, toRaw } from 'vue'

import type {
  CustomFormOptions,
  GeneralFormOptions,
  UseFormOptions,
  UseFormInstance,
  FormMode,
  ResetOptions,
  SubmitHandler
} from './types'

import { noop, hasOwn, pick } from '../utils'

function bindSubmit<T extends object>({ onCreate, onUpdate }: GeneralFormOptions<T>): SubmitHandler<T> {
  return (data, mode) => (mode === 'new' ? onCreate(data) : onUpdate(data))
}

export function useForm<T extends object, R = unknown>(options: UseFormOptions<T, R>): UseFormInstance<T> {
  const initialState = options.data
  const {
    serialize = pick,
    onFetch,
    onValidate = noop,
    onError = (err) => Promise.reject(err)
  } = options

  const onSubmit = typeof (options as CustomFormOptions<T>).onSubmit === 'function'
    ? (options as CustomFormOptions<T>).onSubmit
    : bindSubmit(options as GeneralFormOptions<T>)

  const modeRef = ref<FormMode>(options.mode || 'new')
  const loadingRef = ref(options.loading || false)

  const rulesRef = ref(options.rules)

  const data = reactive(initialState())
  const keys: Array<keyof T> = Object.keys(data) as Array<keyof T>

  async function reset(options?: ResetOptions): Promise<void> {
    if (hasOwn.call(options, 'mode')) {
      modeRef.value = options?.mode as FormMode
    }

    try {
      loadingRef.value = true

      const mode = unref(modeRef.value)
      if (mode !== 'new' && typeof onFetch === 'function') {
        Object.assign(data, initialState(), await onFetch())
      } else {
        Object.assign(data, initialState())
      }
    } finally {
      loadingRef.value = false
    }
  }

  async function submit(): Promise<void> {
    if (loadingRef.value) return

    try {
      const result = await Promise.resolve(onValidate((data as unknown) as T))
      if (result !== false) {
        loadingRef.value = true
        Object.assign(data, await onSubmit(toJSON(), unref(modeRef.value)))
      }
    } catch (err) {
      return onError(err) as never
    } finally {
      loadingRef.value = false
    }
  }

  function toJSON(): T {
    // @ts-ignore
    return serialize(toRaw(data), keys) as T
  }

  return {
    loading: loadingRef,
    mode: modeRef,
    data,
    rules: rulesRef,
    submit,
    reset,
    toJSON
  }
}
