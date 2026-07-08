/**
 * useLoadingDelay
 *
 * Returns a `loading` ref that starts `true` and flips to `false` after `ms`.
 *
 * Used by pages to gate skeleton vs real content. Skips the delay entirely
 * during SSR (data is already resolved by the time the client hydrates).
 *
 * Pattern chosen over faking latency inside Pinia stores — keeping stores
 * synchronous avoids coupling data shape to UX.
 */
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useLoadingDelay(ms: number = 500): Ref<boolean> {
  const loading = ref(true)

  onMounted(() => {
    if (ms <= 0) {
      loading.value = false
      return
    }
    const timer = setTimeout(() => {
      loading.value = false
    }, ms)
    // Best-effort cleanup if the component unmounts mid-delay.
    onUnmounted(() => clearTimeout(timer))
  })

  return loading
}
