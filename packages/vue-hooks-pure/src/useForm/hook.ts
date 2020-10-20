import axios from 'axios'

import { noop, hasOwn, pick } from '../utils'

import type { UseFormOptions, UseFormInstance, ResetOptions, FormMode } from './types'

export function useForm<T extends object>(options: UseFormOptions<T>): UseFormInstance<T> {
  const initialState = options.data
  const {
    serialize = pick,
    onFetch,
    onCreate,
    onUpdate,
    onValidate = noop,
    onError = err => Promise.reject(err)
  } = options

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

      if (state.mode === 'new') {
        state.data = initialState()
      } else {
        state.data = Object.assign(initialState(), await onFetch())
      }
    } finally {
      state.loading = false
    }
  }

  async function submit() {
    try {
      const formData = toJSON()
      const result = await Promise.resolve(onValidate(formData))
      if (result === false) return

      state.loading = true
      if (state.mode === 'new') {
        state.data = Object.assign(state.data, await onCreate(formData))
      } else {
        state.data = Object.assign(state.data, await onUpdate(formData))
      }
    } catch (err) {
      if (axios.isCancel(err)) return
      return onError(err)
    } finally {
      state.loading = false
    }
  }

  function toJSON() {
    return serialize(state.data, keys)
  }

  return Object.assign(state, {
    submit,
    reset,
    toJSON
  })
}
