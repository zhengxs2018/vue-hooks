import { reactive, ref } from 'vue'

import type { UseFormOptions, UseFormInstance, FormMode, ResetOptions } from './types'

import { noop, hasOwn, pick } from '../utils'

export function useForm<T extends object>(options: UseFormOptions<T>): UseFormInstance<T> {
  const initialState = options.data
  const {
    serialize = pick,
    onFetch,
    onCreate,
    onUpdate,
    onValidate = noop,
    onError = (err) => Promise.reject(err)
  } = options

  const modeRef = ref<FormMode>(options.mode || 'new')
  const loadingRef = ref(options.loading || false)

  const data = reactive(initialState())
  const keys: Array<keyof T> = Object.keys(data) as Array<keyof T>

  async function reset(options?: ResetOptions): Promise<void> {
    if (hasOwn.call(options, 'mode')) {
      modeRef.value = options?.mode as FormMode
    }

    try {
      loadingRef.value = true

      if (modeRef.value === 'new') {
        Object.assign(data, initialState())
      } else {
        Object.assign(data, initialState(), await onFetch())
      }
    } finally {
      loadingRef.value = false
    }
  }

  async function submit() {
    if (loadingRef.value) return

    try {
      const formData = toJSON()
      const result = await Promise.resolve(onValidate(formData))
      if (result === false) return

      loadingRef.value = true
      if (modeRef.value === 'new') {
        Object.assign(data, await onCreate(formData))
      } else {
        Object.assign(data, await onUpdate(formData))
      }
    } catch (err) {
      return onError(err)
    } finally {
      loadingRef.value = false
    }
  }

  function toJSON(): Partial<T> {
    return serialize(data, keys)
  }

  return {
    loading: loadingRef,
    mode: modeRef,
    data,
    submit,
    reset,
    toJSON
  }
}
