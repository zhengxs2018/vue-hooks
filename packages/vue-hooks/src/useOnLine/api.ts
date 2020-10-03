import { ref, onUnmounted } from 'vue'

export function useOnLine() {
  const networkStatus = ref<boolean>(navigator.onLine)

  const updateOnlineStatus = () => {
    networkStatus.value = navigator.onLine
  }

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)

  return { networkStatus }
}
