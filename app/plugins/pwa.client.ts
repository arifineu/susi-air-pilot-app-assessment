/**
 * PWA service worker registration.
 *
 * Client-only (`.client.ts` suffix). Skips registration in dev so HMR
 * isn't fighting the SW cache.
 */
export default defineNuxtPlugin(() => {
  if (import.meta.dev) return
  if (!('serviceWorker' in navigator)) return

  // Register after window load to avoid competing with first paint.
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        // Check for updates every hour.
        setInterval(() => reg.update(), 60 * 60 * 1000)
      })
      .catch((err) => {
        console.warn('[pwa] SW registration failed:', err)
      })
  })
})
