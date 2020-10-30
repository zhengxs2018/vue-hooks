import axios from 'axios'

import { noop, hasOwn, pick } from '../utils'

import type {
  CustomFormOptions,
  GeneralFormOptions,
  UseFormOptions,
  UseFormInstance,
  FormMode,
  ResetOptions,
  SubmitHandler
} from './types'

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

  const state = {
    mode: options.mode || 'new',
    loading: false,
    data: initialState(),
    rules: options.rules
  }

  const keys = Object.keys(state.data) as Array<keyof T>

  async function reset(options: ResetOptions) {
    if (hasOwn.call(options, 'mode')) {
      state.mode = options.mode as FormMode
    }

    try {
      state.loading = true

      if (state.mode !== 'new' && typeof onFetch === 'function') {
        state.data = Object.assign(initialState(), await onFetch())
      } else {
        state.data = initialState()
      }
    } finally {
      state.loading = false
    }
  }

  async function submit(): Promise<void> {
    if (state.loading) return

    try {
      const result = await Promise.resolve(onValidate(state.data))
      if (result === false) return

      state.loading = true
      state.data = Object.assign(state.data, await onSubmit(toJSON(), state.mode))
    } catch (err) {
      if (axios.isCancel(err)) return
      return onError(err) as never
    } finally {
      state.loading = false
    }
  }

  function toJSON(): T {
    // @ts-ignore
    return serialize(state.data, keys)
  }

  return Object.assign(state, {
    submit,
    reset,
    toJSON
  })
}
