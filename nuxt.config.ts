// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/fonts'],

  // Components are namespaced by their full directory path under app/components/.
  // e.g. app/components/atoms/form/BaseInput.vue → <AtomsFormBaseInput />.
  // Subdirectories group components by domain (form, feedback, dashboard, etc.)
  // so flat atomic-layer folders stay scannable as the library grows.
  components: [{ path: '~/components', pathPrefix: true }],

  css: ['~/assets/scss/tokens.scss'],

  app: {
    head: {
      title: 'Susi Air Pilot App',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        // iOS Safari standalone support (manifest spec isn't fully honored).
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Susi Air' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#0E2138' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: '/pwa-192.png' },
      ],
    },
  },

  // @nuxt/fonts auto-detects `font-family: 'Plus Jakarta Sans'` in tokens.scss
  // and serves the font from our own origin (no Google Fonts request).
  fonts: {
    families: [
      {
        name: 'Plus Jakarta Sans',
        provider: 'google',
        weights: [400, 500, 600, 700, 800],
        styles: ['normal'],
      },
    ],
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api', 'import'],
        },
      },
    },
  },

  typescript: {
    strict: true,
  },
})

